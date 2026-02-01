import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function Footer() {
    return (
        <footer className="w-full border-t border-gray-100 bg-gray-50 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-blue-600" />
                            <span className="text-xl font-bold tracking-tight text-gray-900">Comparacolegios</span>
                        </Link>
                        <p className="text-sm text-gray-500">
                            La plataforma líder para encontrar el mejor futuro educativo para tus hijos.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">Plataforma</h3>
                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600">Buscar Colegios</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600">Comparador</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600">Mapa Interactivo</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">Compañía</h3>
                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600">Sobre Nosotros</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600">Contacto</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600">Blog</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600">Privacidad</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600">Términos</Link>
                    </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 md:flex-row">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Comparacolegios. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    )
}
