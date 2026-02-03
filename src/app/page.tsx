'use client'

import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, School, CheckCircle2 } from "lucide-react";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Sección Hero */}
        <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-32">
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
                    Encuentra el colegio ideal para tus hijos
                  </h1>
                  <p className="max-w-[600px] text-lg text-slate-800 md:text-xl leading-relaxed font-medium">
                    Compara matrículas, opiniones y calidad educativa en un solo lugar.
                    Toma la mejor decisión para su futuro con datos reales.
                  </p>
                </div>

                {/* Buscador - Autocompletado */}
                <SearchAutocomplete />

                <div className="flex items-center gap-4 text-sm text-slate-700 font-semibold">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Datos Verificados</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>100% Gratuito</span>
                  </div>
                </div>
              </div>

              {/* Imagen Hero */}
              <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="/hero-main.png"
                    alt="Estudiantes felices en un campus moderno"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  {/* Degradado de superposición */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent mix-blend-multiply" />
                </div>
              </div>
            </div>
          </div>

          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-blue-50 blur-[100px]" />
          <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/4 rounded-full bg-indigo-50 blur-[100px]" />
        </section>

        {/* Sección de Características */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900">
                Todo lo que necesitas para decidir
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-700 md:text-lg font-medium">
                Olvídate de visitar 20 páginas web diferentes. Centralizamos la información oficial y opiniones de padres.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-slate-50">
                <div className="p-3 rounded-full bg-blue-100 text-blue-700">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Búsqueda por Mapa</h3>
                <p className="text-slate-700 font-medium">
                  Visualiza colegios cercanos a tu hogar o trabajo. Filtra por zona de manera intuitiva.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-slate-50">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-700">
                  <School className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Comparador Detallado</h3>
                <p className="text-slate-700 font-medium">
                  Enfrenta costos, ratios de alumnos y servicios lado a lado para ver cuál te conviene más.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-slate-50">
                <div className="p-3 rounded-full bg-amber-100 text-amber-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Opiniones Reales</h3>
                <p className="text-slate-700 font-medium">
                  Lee experiencias verificadas de otros padres sobre el ambiente y la exigencia académica.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección CTA (Captación de leads) */}
        <section className="w-full bg-slate-900 py-20 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  ¿No encuentras lo que buscas?
                </h2>
                <p className="mx-auto max-w-[600px] text-slate-400 md:text-xl">
                  Estamos agregando nuevos colegios cada semana. Déjanos tu correo y te avisaremos cuando actualicemos tu distrito.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    placeholder="tu@email.com"
                    type="email"
                  />
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-500 text-white">
                    Suscribirse
                  </Button>
                </form>
                <p className="text-xs text-slate-500">
                  No enviamos spam. Solo información útil.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
