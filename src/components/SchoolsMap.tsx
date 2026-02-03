'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { School } from '@/types/database'
import L from 'leaflet'
import { useEffect } from 'react'

// Ajuste para los iconos de marcadores en Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

// Componente para actualizar el centro del mapa cuando cambian los colegios
function MapController({ schools }: { schools: School[] }) {
    const map = useMap();

    useEffect(() => {
        if (schools.length > 0) {
            const bounds = L.latLngBounds(schools.map(s => {
                try {
                    if (!s.coordenadas) return null;
                    const coordStr = typeof s.coordenadas === 'string' ? s.coordenadas : JSON.stringify(s.coordenadas);
                    const clean = coordStr.replace(/[()]/g, '');
                    const parts = clean.split(',');
                    if (parts.length === 2) {
                        const lat = parseFloat(parts[0]);
                        const lng = parseFloat(parts[1]);
                        if (!isNaN(lat) && !isNaN(lng)) return [lat, lng] as [number, number];
                    }
                } catch (e) {
                    console.error("Coordinate parse error", e);
                }
                return null;
            }).filter(Boolean) as L.LatLngExpression[]);

            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [schools, map]);

    return null;
}

interface SchoolsMapProps {
    schools: School[];
}

export default function SchoolsMap({ schools }: SchoolsMapProps) {
    // Default center (Lima)
    const defaultCenter: [number, number] = [-12.0464, -77.0428];
    const { CircleMarker, Popup: LeafletPopup } = require('react-leaflet');

    return (
        <MapContainer
            center={defaultCenter}
            zoom={11}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController schools={schools} />

            {schools.map((school) => {
                let position: [number, number] | null = null;
                try {
                    if (!school.coordenadas) return null;
                    const coordStr = typeof school.coordenadas === 'string' ? school.coordenadas : JSON.stringify(school.coordenadas);
                    const clean = coordStr.replace(/[()]/g, '');
                    const parts = clean.split(',');
                    if (parts.length === 2) {
                        const lat = parseFloat(parts[0]);
                        const lng = parseFloat(parts[1]);
                        if (!isNaN(lat) && !isNaN(lng)) position = [lat, lng];
                    }
                } catch { }

                if (!position) return null;

                return (
                    <CircleMarker
                        key={school.id}
                        center={position}
                        pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.8 }}
                        radius={8}
                    >
                        <LeafletPopup>
                            <div className="text-sm font-bold text-slate-900 border-b pb-1 mb-1">
                                {school.nombre}
                            </div>
                            <div className="text-xs text-slate-600 mb-1">
                                {school.tipo} • {school.distritos?.nombre} // Safely access optional
                            </div>
                            <div className="text-xs font-bold text-blue-600">
                                S/ {school.mensualidad_min}
                            </div>
                        </LeafletPopup>
                    </CircleMarker>
                )
            })}
        </MapContainer>
    )
}
