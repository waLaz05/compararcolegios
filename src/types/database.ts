export type District = {
    id: number;
    nombre: string;
    zona: string;
    coordenadas_centro?: string; // Point se suele serializar como string o tuple
};

export type School = {
    id: number;
    nombre: string;
    slug: string;
    coordenadas: string; // Formato POINT de Postgres (x,y) o similar
    direccion: string | null;
    distrito_id: number;
    tipo: 'Privado' | 'Público' | 'Concertado';
    mensualidad_min: number;
    mensualidad_max: number;
    matricula: number;
    cuota_ingreso: number;
    rating_promedio: number;
    fotos: string[];
    telefono?: string;
    email?: string;
    web?: string;
    google_maps_url?: string;
    distritos?: District; // Relación con distritos
};
