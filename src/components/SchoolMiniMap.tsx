'use client'

import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import L from 'leaflet'

interface SchoolMiniMapProps {
    coords: [number, number];
}

// Controller to handle resize and centering
function MiniMapController({ coords }: { coords: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        // Ajuste para el renderizado en contenedores dinámicos o ocultos
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(map.getContainer());

        map.setView(coords, 14);

        return () => {
            resizeObserver.disconnect();
        }
    }, [map, coords]);

    return null;
}

export default function SchoolMiniMap({ coords }: SchoolMiniMapProps) {
    return (
        <MapContainer
            center={coords}
            zoom={14}
            scrollWheelZoom={false}
            dragging={false}
            zoomControl={false}
            attributionControl={false}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MiniMapController coords={coords} />
            <CircleMarker
                center={coords}
                pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.8 }}
                radius={6}
            />
        </MapContainer>
    )
}
