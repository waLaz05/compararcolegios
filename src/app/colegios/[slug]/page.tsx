'use client'

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { School } from '@/types/database';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Globe, Star, Users, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Importación dinámica del mapa
const SchoolMiniMap = dynamic(() => import('@/components/SchoolMiniMap'), {
    ssr: false,
    loading: () => <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">Cargando mapa...</div>
});

function SchoolDetail() {
    const params = useParams();
    const slug = params?.slug as string;
    const [school, setSchool] = useState<School | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) fetchSchool();
    }, [slug]);

    async function fetchSchool() {
        try {
            const { data, error } = await supabase
                .from('colegios')
                .select(`*, distritos ( nombre )`)
                .eq('slug', slug)
                .single();

            if (data) setSchool(data);
            if (error) console.error(error);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><p className="animate-pulse">Cargando colegio...</p></div>;
    if (!school) return <div className="h-screen flex items-center justify-center bg-slate-50">Colegio no encontrado</div>;

    const coords: [number, number] | null = (() => {
        try {
            const clean = school.coordenadas?.replace(/[()]/g, '') || "";
            const parts = clean.split(',');
            if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
                return [parseFloat(parts[0]), parseFloat(parts[1])];
            }
        } catch { }
        return null;
    })();

    return (
        <div className="flex flex-col min-h-screen font-sans bg-slate-50">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Sección Hero / Cabecera */}
                <div className="bg-white border-b border-gray-200">
                    <div className="relative h-[300px] md:h-[400px] w-full bg-slate-200 overflow-hidden">
                        {school.fotos && school.fotos.length > 0 ? (
                            <img src={school.fotos[0]} alt={school.nombre} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">Sin Imagen de Portada</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
                            <div className="max-w-6xl mx-auto">
                                <div className="flex gap-2 mb-2">
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">{school.tipo}</span>
                                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded border border-white/30">{school.distritos?.nombre}</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold mb-2 shadow-sm">{school.nombre}</h1>
                                <div className="flex items-center gap-2 text-sm md:text-base text-gray-200">
                                    <MapPin className="h-4 w-4" />
                                    {school.direccion}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Izquierda: Información Principal */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Tarjetas de Resumen */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <Star className="h-6 w-6 text-yellow-500 mb-2" />
                                <span className="text-2xl font-bold text-slate-800">{school.rating_promedio || "-"}</span>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Rating</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <Users className="h-6 w-6 text-blue-500 mb-2" />
                                <span className="text-2xl font-bold text-slate-800">Mix</span>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Género</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <Briefcase className="h-6 w-6 text-purple-500 mb-2" />
                                <span className="text-2xl font-bold text-slate-800">Inglés</span>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Idioma</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <Calendar className="h-6 w-6 text-green-500 mb-2" />
                                <span className="text-2xl font-bold text-slate-800">Mar-Dic</span>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Año Escolar</span>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Sobre el colegio</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Esta institución educativa se destaca por su excelencia académica y formación en valores.
                                Con años de experiencia formando líderes, ofrece una propuesta educativa integral que abarca desde
                                habilidades blandas hasta un alto nivel competitivo en ciencias y humanidades.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Cuentan con infraestructura moderna, laboratorios equipados y áreas deportivas que permiten
                                el desarrollo pleno del estudiante.
                            </p>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h3 className="font-bold text-slate-900 mb-3">Niveles Educativos</h3>
                                <div className="flex gap-3">
                                    {['Inicial', 'Primaria', 'Secundaria'].map(level => (
                                        <div key={level} className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            {level}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sección de Galería */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Galería de Fotos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {school.fotos && school.fotos.map((img, idx) => (
                                    <div key={idx} className="rounded-lg overflow-hidden h-48 bg-slate-100">
                                        <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Columna Derecha: Sidebar (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Tarjeta de Precios */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Mensualidad estimada</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-slate-900">S/ {school.mensualidad_min}</span>
                                        <span className="text-gray-400 font-medium">-</span>
                                        <span className="text-xl font-bold text-slate-700">S/ {school.mensualidad_max}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-100 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Cuota de Ingreso</span>
                                        <span className="font-semibold text-slate-900">S/ {school.cuota_ingreso}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Matrícula</span>
                                        <span className="font-semibold text-slate-900">S/ {school.matricula}</span>
                                    </div>
                                </div>

                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 mb-3 font-bold">
                                    Solicitar Información
                                </Button>
                                <Button variant="outline" className="w-full border-slate-300 text-slate-700">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Llamar ahora
                                </Button>
                                {school.telefono && (
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <div className="bg-blue-50 p-2 rounded-full">
                                                <Phone className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400">Teléfono</span>
                                                <a href={`tel:${school.telefono}`} className="font-medium hover:text-blue-600 transition-colors">
                                                    {school.telefono}
                                                </a>
                                            </div>
                                        </div>
                                        {school.web && (
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <div className="bg-purple-50 p-2 rounded-full">
                                                    <Globe className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-xs text-gray-400">Sitio Web</span>
                                                    <a href={`https://${school.web.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-purple-600 transition-colors truncate">
                                                        {school.web}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tarjeta de Ubicación */}
                            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <h3 className="font-bold text-slate-900 mb-3 px-2">Ubicación</h3>
                                <a
                                    href={school.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${coords ? `${coords[0]},${coords[1]}` : encodeURIComponent(`${school.direccion}, ${school.distritos?.nombre || 'Lima'}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group"
                                >
                                    <div className="h-48 w-full rounded-xl overflow-hidden bg-slate-100 mb-3 relative z-0 border border-gray-100 group-hover:border-blue-400 transition-colors">
                                        {coords ? (
                                            <SchoolMiniMap coords={coords} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-gray-400">Sin Mapa</div>
                                        )}
                                        {/* Overlay de ayuda */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                                            <span className="bg-white/90 text-xs font-bold px-3 py-1 rounded-full shadow-sm text-slate-700 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> Ver en Google Maps
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-2 pb-2">
                                        <p className="text-sm text-gray-600 flex gap-2 group-hover:text-blue-600 transition-colors">
                                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-blue-500" />
                                            {school.direccion}, {school.distritos?.nombre}
                                        </p>
                                    </div>
                                </a>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}

export default function SchoolDetailPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <SchoolDetail />
        </Suspense>
    )
}
