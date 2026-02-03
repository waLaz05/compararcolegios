'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Loader2, School } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchAutocompleteProps {
    placeholder?: string
    className?: string
    initialValue?: string
    onSearch?: (value: string) => void
}

interface Suggestion {
    id: string
    nombre: string
    distritos: {
        nombre: string
    } | null
}

export function SearchAutocomplete({
    placeholder = "Buscar colegios...",
    className,
    initialValue = "",
    onSearch
}: SearchAutocompleteProps) {
    const router = useRouter()
    const [query, setQuery] = React.useState(initialValue)
    const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
    const [isOpen, setIsOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    // Debounce para la búsqueda (evitar llamadas excesivas)
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length >= 1) {
                fetchSuggestions(query)
            } else {
                setSuggestions([])
                setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Cerrar al hacer clic fuera del componente
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    async function fetchSuggestions(searchTerm: string) {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('colegios')
                .select(`
          id,
          nombre,
          distritos ( nombre )
        `)
                .ilike('nombre', `%${searchTerm}%`)
                .limit(5)

            if (error) throw error

            setSuggestions(data as any[] || [])
            setIsOpen(true)
        } catch (error) {
            console.error('Error fetching suggestions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsOpen(false)
        if (onSearch) {
            onSearch(query)
        } else {
            if (query.trim()) {
                router.push(`/buscar?q=${encodeURIComponent(query)}`)
            } else {
                router.push('/buscar')
            }
        }
    }

    const handleSelect = (suggestion: Suggestion) => {
        setQuery(suggestion.nombre)
        setIsOpen(false)
        router.push(`/buscar?q=${encodeURIComponent(suggestion.nombre)}`)
    }

    return (
        <div ref={wrapperRef} className={cn("relative w-full max-w-sm", className)}>
            <form onSubmit={handleSubmit} className="relative flex items-center w-full rounded-lg border border-slate-300 bg-white p-2 shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                <div className="relative flex-1 flex items-center">
                    <Search className="ml-2 h-5 w-5 text-slate-500 flex-shrink-0" />
                    <Input
                        type="text"
                        placeholder={placeholder}
                        className="border-0 focus-visible:ring-0 text-base text-slate-900 placeholder:text-slate-500 font-medium h-9 pl-2"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            if (suggestions.length > 0) setIsOpen(true)
                        }}
                    />
                </div>
                <Button type="submit" className="font-bold ml-2">Buscar</Button>
            </form>

            {/* Desplegable de sugerencias */}
            {isOpen && (suggestions.length > 0 || isLoading) && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {isLoading && suggestions.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Buscando...
                        </div>
                    ) : (
                        <ul className="py-1">
                            {suggestions.map((school) => (
                                <li key={school.id}>
                                    <button
                                        onClick={() => handleSelect(school)}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                                    >
                                        <div className="mt-1 p-1.5 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors">
                                            <School className="h-4 w-4 text-slate-500 group-hover:text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{school.nombre}</p>
                                            <p className="text-xs text-slate-500">
                                                {school.distritos?.nombre || 'Distrito desconocido'}
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
