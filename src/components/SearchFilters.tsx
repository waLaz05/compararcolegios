'use client'

import * as React from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface FilterState {
    minPrice: string
    maxPrice: string
    districtId: string
    type: string
}

interface SearchFiltersProps {
    filters: FilterState
    setFilters: (filters: FilterState) => void
    onApply: () => void
    districts: { id: string; nombre: string }[]
    className?: string
    variant?: 'vertical' | 'horizontal'
}

export function SearchFilters({
    filters,
    setFilters,
    onApply,
    districts,
    className,
    variant = 'vertical',
}: SearchFiltersProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleChange = (key: keyof FilterState, value: string) => {
        setFilters({ ...filters, [key]: value })
    }

    const clearFilters = () => {
        setFilters({ minPrice: "", maxPrice: "", districtId: "", type: "" })
    }

    if (variant === 'horizontal') {
        return (
            <div className={cn("w-full flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 py-2", className)}>
                {/* District Select */}
                <select
                    className="h-10 w-full md:w-auto rounded-full border border-gray-300 bg-white px-4 py-1 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={filters.districtId}
                    onChange={(e) => handleChange("districtId", e.target.value)}
                >
                    <option value="">Todos los distritos</option>
                    {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.nombre}
                        </option>
                    ))}
                </select>

                {/* Price Inputs */}
                <div className="flex items-center justify-between md:justify-start gap-2 bg-white rounded-full border border-gray-300 px-4 py-1 h-10 w-full md:w-auto">
                    <span className="text-sm font-medium text-slate-700">S/</span>
                    <Input
                        type="number"
                        placeholder="Mín"
                        value={filters.minPrice}
                        onChange={(e) => handleChange("minPrice", e.target.value)}
                        className="h-6 w-full md:w-16 border-none p-0 text-sm focus-visible:ring-0 text-slate-900 placeholder:text-slate-500 text-center md:text-right"
                    />
                    <span className="text-slate-500">-</span>
                    <Input
                        type="number"
                        placeholder="Máx"
                        value={filters.maxPrice}
                        onChange={(e) => handleChange("maxPrice", e.target.value)}
                        className="h-6 w-full md:w-16 border-none p-0 text-sm focus-visible:ring-0 text-slate-900 placeholder:text-slate-500 text-center"
                    />
                </div>

                {/* Type Pills - Horizontal Scroll on Mobile */}
                <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200 h-10 w-full md:w-auto overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1 min-w-max">
                        <button
                            onClick={() => handleChange("type", "")}
                            className={cn(
                                "px-4 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                filters.type === ""
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-gray-200"
                            )}
                        >
                            Todos
                        </button>
                        {['Privado', 'Público', 'Concertado'].map((type) => (
                            <button
                                key={type}
                                onClick={() => handleChange("type", type)}
                                className={cn(
                                    "px-4 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                    filters.type === type
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-slate-600 hover:bg-gray-200"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {(filters.minPrice || filters.maxPrice || filters.districtId || filters.type) && (
                    <button
                        onClick={clearFilters}
                        className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium px-3"
                    >
                        Borrar filtros
                    </button>
                )}
            </div>
        )
    }

    // Vertical / Default Layout
    return (
        <div className={cn("w-full md:w-64 flex-shrink-0", className)}>
            <div className="md:hidden mb-4">
                <Button
                    variant="outline"
                    className="w-full flex items-center justify-between"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filtros
                    </span>
                    {isOpen ? <X className="h-4 w-4" /> : null}
                </Button>
            </div>

            <div className={cn("space-y-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm", isOpen ? "block" : "hidden md:block")}>
                <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center justify-between">
                        Filtros
                        {(filters.minPrice || filters.maxPrice || filters.districtId || filters.type) && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-blue-600 hover:underline font-normal"
                            >
                                Limpiar
                            </button>
                        )}
                    </h3>

                    {/* Precio */}
                    <div className="space-y-3 mb-6">
                        <label className="text-sm font-medium text-slate-700">Mensualidad (S/)</label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Mín"
                                value={filters.minPrice}
                                onChange={(e) => handleChange("minPrice", e.target.value)}
                                className="h-9 text-slate-900 placeholder:text-slate-500"
                            />
                            <span className="text-slate-500">-</span>
                            <Input
                                type="number"
                                placeholder="Máx"
                                value={filters.maxPrice}
                                onChange={(e) => handleChange("maxPrice", e.target.value)}
                                className="h-9 text-slate-900 placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {/* Distrito */}
                    <div className="space-y-3 mb-6">
                        <label className="text-sm font-medium text-slate-700">Distrito</label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-slate-900"
                            value={filters.districtId}
                            onChange={(e) => handleChange("districtId", e.target.value)}
                        >
                            <option value="">Todos los distritos</option>
                            {districts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo */}
                    <div className="space-y-3 mb-6">
                        <label className="text-sm font-medium text-slate-700">Tipo de Colegio</label>
                        <div className="space-y-2">
                            {['Privado', 'Público', 'Concertado'].map((type) => (
                                <div key={type} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id={`type-${type}`}
                                        name="schoolType"
                                        value={type}
                                        checked={filters.type === type}
                                        onChange={(e) => handleChange("type", e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                                    />
                                    <label htmlFor={`type-${type}`} className="text-sm text-slate-600 cursor-pointer select-none">
                                        {type}
                                    </label>
                                </div>
                            ))}
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="type-all"
                                    name="schoolType"
                                    value=""
                                    checked={filters.type === ""}
                                    onChange={(e) => handleChange("type", e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                                />
                                <label htmlFor="type-all" className="text-sm text-slate-600 cursor-pointer select-none">
                                    Todos
                                </label>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-center text-slate-500 mt-4">
                        Los resultados se actualizan automáticamente
                    </p>
                </div>
            </div>
        </div>
    )
}
