'use client'

import { useEffect, useState, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, School as SchoolIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { School } from "@/types/database";
import { useSearchParams } from 'next/navigation';
import { SearchFilters, FilterState } from "@/components/SearchFilters";
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Importación dinámica del MiniMapa para evitar problemas de SSR
const SchoolMiniMap = dynamic(() => import('@/components/SchoolMiniMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-xs">Mapa...</div>
});
// Colección de imágenes de respaldo para asegurar variedad cuando faltan fotos
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1523050854058-8df90110c5f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596796531920-7a5cebd6f68b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1427504746083-a931a2c3d517?auto=format&fit=crop&w=800&q=80",
];

const getFallbackImage = (name: string) => {
    // Selección determinista basada en el nombre
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % FALLBACK_IMAGES.length;
    return FALLBACK_IMAGES[index];
};

function SearchResults() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || "";
    const [query, setQuery] = useState(initialQuery);
    const [schools, setSchools] = useState<School[]>([]);
    const [districts, setDistricts] = useState<{ id: string; nombre: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 10;

    // Estado de Filtros
    const [filters, setFilters] = useState<FilterState>({
        minPrice: "",
        maxPrice: "",
        districtId: "",
        type: ""
    });

    // Estado de Geolocalización
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [searchRadius, setSearchRadius] = useState<number | null>(null);

    const handleUseLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition((position) => {
                const userLoc: [number, number] = [position.coords.latitude, position.coords.longitude];
                setUserLocation(userLoc);
                setSearchRadius(5); // Default to 5km
                setLoading(false);
            }, (error) => {
                console.error("Error getting location", error);
                alert("No pudimos obtener tu ubicación. Verifica los permisos.");
                setLoading(false);
            });
        } else {
            alert("Tu navegador no soporta geolocalización.");
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    async function fetchDistricts() {
        try {
            const { data } = await supabase.from('distritos').select('id, nombre').order('nombre');
            if (data) setDistricts(data.map(d => ({ id: d.id.toString(), nombre: d.nombre })));
        } catch (e) {
            console.error("Error fetching districts", e);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0);
            fetchSchools(query, 0, false);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters, query, userLocation, searchRadius]);

    async function fetchSchools(searchTerm: string = "", pageIndex: number = 0, isLoadMore: boolean = false) {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        try {
            let queryBuilder = supabase
                .from('colegios')
                .select(`*, distritos ( nombre )`);

            if (searchTerm) queryBuilder = queryBuilder.ilike('nombre', `%${searchTerm}%`);
            if (filters.minPrice) queryBuilder = queryBuilder.gte('mensualidad_min', parseInt(filters.minPrice));
            if (filters.maxPrice) queryBuilder = queryBuilder.lte('mensualidad_max', parseInt(filters.maxPrice));
            if (filters.districtId) queryBuilder = queryBuilder.eq('distrito_id', parseInt(filters.districtId));
            if (filters.type) queryBuilder = queryBuilder.ilike('tipo', filters.type);

            const from = pageIndex * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;
            queryBuilder = queryBuilder.range(from, to);

            const { data, error } = await queryBuilder;

            if (error) {
                console.error('Error fetching schools:', error);
            } else {
                let newSchools = data as any[] || [];

                // Lógica de distancia en el cliente
                if (userLocation) {
                    newSchools = newSchools.map(s => {
                        let dist = Infinity;
                        try {
                            const clean = s.coordenadas?.replace(/[()]/g, '') || "";
                            const parts = clean.split(',');
                            if (parts.length === 2) {
                                dist = calculateDistance(userLocation[0], userLocation[1], parseFloat(parts[0]), parseFloat(parts[1]));
                            }
                        } catch { }
                        return { ...s, distance: dist };
                    });

                    if (searchRadius) {
                        newSchools = newSchools.filter(s => s.distance <= searchRadius);
                    }
                    newSchools.sort((a, b) => a.distance - b.distance);
                }

                if (isLoadMore) setSchools(prev => [...prev, ...newSchools]);
                else setSchools(newSchools);

                if (newSchools.length < ITEMS_PER_PAGE) setHasMore(false);
                else setHasMore(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSchools(query, nextPage, true);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchSchools(query, 0, false);
    };

    return (
        <div className="flex h-screen flex-col font-sans overflow-hidden">
            <Navbar />

            {/* Main Content - Full Width Single Column */}
            <div className="flex-1 w-full overflow-y-auto bg-slate-50 relative">

                {/* Sticky Header with Search & Filters */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                    {/* Top Row: Search */}
                    <div className="py-4 px-4 md:px-6 flex flex-col md:flex-row items-center gap-4 w-full max-w-6xl mx-auto">
                        <div className="flex-1 w-full">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Buscar colegios..."
                                        className="pl-9 bg-slate-50 border-gray-200 focus-visible:ring-blue-500"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Buscar</Button>
                            </form>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto justify-end">
                            {userLocation && (
                                <select
                                    className="h-10 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                                    value={searchRadius || ""}
                                    onChange={(e) => setSearchRadius(e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">Todo Lima</option>
                                    <option value="3">A 3 km</option>
                                    <option value="5">A 5 km</option>
                                    <option value="10">A 10 km</option>
                                </select>
                            )}
                            <Button
                                variant={userLocation ? "default" : "outline"}
                                onClick={handleUseLocation}
                                className={userLocation ? "bg-green-600 hover:bg-green-700 text-white border-transparent" : "text-slate-700 border-slate-300"}
                            >
                                <MapPin className="h-4 w-4 mr-2" />
                                {userLocation ? "Ubicación activa" : "Usar mi ubicación"}
                            </Button>
                        </div>
                    </div>

                    {/* Bottom Row: Filters */}
                    <div className="px-4 md:px-6 pb-3 pt-1 bg-slate-50/50 border-t border-gray-100">
                        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                            <SearchFilters
                                filters={filters}
                                setFilters={setFilters}
                                onApply={() => { }}
                                districts={districts}
                                variant="horizontal"
                            />
                            {userLocation && (
                                <div className="text-xs text-green-700 font-medium px-2 py-1 bg-green-100 rounded-md flex items-center gap-1 animate-in fade-in">
                                    <MapPin className="h-3 w-3" />
                                    Resultados ordenados por cercanía
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lista de Resultados */}
                <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
                    {/* Contador de resultados */}
                    <div className="text-sm text-gray-500 font-medium">
                        {loading ? "Buscando..." : `${schools.length} colegios encontrados`}
                    </div>

                    {loading && !loadingMore ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
                            <p>Cargando colegios...</p>
                        </div>
                    ) : schools.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <SchoolIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">No encontramos colegios</h3>
                            <p className="text-gray-500 mt-1 max-w-md mx-auto">Intenta ajustar los filtros o ampliar el radio de búsqueda.</p>
                            {(searchRadius || filters.districtId || filters.minPrice) && (
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setSearchRadius(null);
                                        setFilters({ minPrice: "", maxPrice: "", districtId: "", type: "" });
                                    }}
                                    className="mt-4 text-blue-600"
                                >
                                    Limpiar todos los filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        schools.map((school) => (
                            <div key={school.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col md:flex-row group h-auto">
                                {/* Image Section */}
                                {/* Image Section */}
                                {/* Image Section */}
                                <div className="w-full md:w-64 h-48 md:h-auto bg-slate-100 relative overflow-hidden shrink-0 flex items-center justify-center">
                                    {school.fotos && school.fotos.length > 0 ? (
                                        <img
                                            src={school.fotos[0]}
                                            alt={school.nombre}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.classList.add('fallback-visible');
                                            }}
                                        />
                                    ) : null}

                                    {/* Neutral Placeholder that shows behind image (or if img hidden) */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none -z-10 bg-slate-100 fallback-content">
                                        <SchoolIcon className="h-12 w-12 mb-2 opacity-50" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Sin Foto</span>
                                    </div>

                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm z-10">
                                        {school.tipo || "Privado"}
                                    </div>
                                </div>

                                {/* Sección de Contenido */}
                                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                                    {school.nombre}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {school.direccion || school.distritos?.nombre}
                                                </div>
                                            </div>

                                            {/* Distance Badge */}
                                            {(school as any).distance !== undefined && (school as any).distance !== Infinity && (
                                                <div className="flex flex-col items-end">
                                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                                                        📍 {(school as any).distance.toFixed(1)} km
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {school.rating_promedio > 0 && (
                                                <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded border border-yellow-100 font-medium">
                                                    ⭐ {school.rating_promedio}
                                                </span>
                                            )}
                                            {/* Etiquetas de características (placeholder) */}
                                            <span className="bg-slate-50 text-slate-600 text-xs px-2 py-1 rounded border border-slate-100">Bilingüe</span>
                                            <span className="bg-slate-50 text-slate-600 text-xs px-2 py-1 rounded border border-slate-100">Deportes</span>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-50">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Mensualidad desde</p>
                                            <p className="text-2xl font-bold text-slate-900">S/ {school.mensualidad_min}</p>
                                        </div>
                                        <Link href={`/colegios/${school.slug}`} passHref className="w-auto">
                                            <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                                                Ver detalles
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Mini Mapa - Solo desktop si hay coordenadas */}
                                <div className="hidden lg:block w-56 border-l border-gray-100 bg-slate-50 relative group/map">
                                    try {
                                            // Manejar varios formatos de coordenadas por seguridad
                                            const clean = school.coordenadas?.replace(/[()]/g, '') || "";
                                    const parts = clean.split(',');
                                    if (parts.length === 2) {
                                                const lat = parseFloat(parts[0]);
                                    const lng = parseFloat(parts[1]);
                                    if (!isNaN(lat) && !isNaN(lng)) {
                                                    return (
                                    <>
                                        <div className="absolute inset-0 z-0">
                                            <SchoolMiniMap coords={[lat, lng]} />
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
                                            <p className="text-white text-[10px] text-center font-medium">Ver en mapa grande</p>
                                        </div>
                                    </>
                                    )
                                                }
                                            }
                                        } catch { }
                                    return (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                                        <MapPin className="h-8 w-8 mb-2 opacity-50" />
                                        <span className="text-xs">Ubicación no disponible</span>
                                    </div>
                                    );
                                    })()}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Paginación / Cargar más */}
                    {!loading && schools.length > 0 && hasMore && (
                        <div className="flex justify-center pt-8 pb-10">
                            <Button
                                variant="outline"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="px-8 py-6 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                            >
                                {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {loadingMore ? "Cargando..." : "Cargar más resultados"}
                            </Button>
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Cargando...</div>}>
            <SearchResults />
        </Suspense>
    )
}
