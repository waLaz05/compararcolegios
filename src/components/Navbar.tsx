import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, Menu } from 'lucide-react'

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold tracking-tight text-gray-900">Comparacolegios</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/buscar" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                        Explorar
                    </Link>
                    <Link href="/buscar" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                        Comparar
                    </Link>
                    <Link href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                        Nosotros
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="#" className="hidden md:block text-sm font-medium text-gray-600 hover:text-blue-600">
                        Iniciar Sesión
                    </Link>
                    <Button>Registrar Colegio</Button>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
