import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter } from "lucide-react";

export default function SearchPage() {
    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Navbar />
            <main className="flex-1 bg-slate-50">
                {/* Search Header */}
                <div className="bg-white border-b border-gray-200 py-8">
                    <div className="container mx-auto px-4 md:px-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-4">Buscar Colegios</h1>
                        <div className="flex gap-2 max-w-2xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input placeholder="Distrito, nombre o zona..." className="pl-9" />
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filtros
                            </Button>
                            <Button>Buscar</Button>
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <div className="container mx-auto px-4 md:px-6 py-8 flex gap-8">
                    {/* Map Placeholder - hidden on mobile */}
                    <div className="hidden lg:block w-1/3 h-[600px] bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <MapPin className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                            <p>Mapa Interactivo en construcción</p>
                        </div>
                    </div>

                    {/* List Placeholder */}
                    <div className="flex-1 space-y-4">
                        {/* Mock Result Card */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <div className="h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                                Imagen del Colegio
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Colegio San Ejemplo</h3>
                            <p className="text-sm text-gray-500 mb-4">Los Olivos, Lima</p>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-blue-600">S/ 450 - S/ 800</span>
                                <Button variant="outline" size="sm">Ver Detalles</Button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <div className="h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                                Imagen del Colegio
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Institución Educativa Futuro</h3>
                            <p className="text-sm text-gray-500 mb-4">San Miguel, Lima</p>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-blue-600">S/ 600 - S/ 950</span>
                                <Button variant="outline" size="sm">Ver Detalles</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
