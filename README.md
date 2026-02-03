# Comparacolegios v1.0 - Plan Maestro

Este es el repositorio oficial del proyecto **Comparacolegios**. Una plataforma diseñada para ayudar a padres a encontrar y comparar colegios de manera eficiente, centrada en datos y con costo de infraestructura cero inicial.

## Stack Tecnológico (Costo $0)

- **Frontend & Hosting**: Next.js (App Router) desplegado en Vercel. SEO optimizado.
- **Base de Datos & Auth**: Supabase (PostgreSQL). Auth integrado.
- **Mapas**: Leaflet.js con OpenStreetMap.
- **Imágenes**: Cloudinary (Capa gratuita).
- **Estilos**: Tailwind CSS con diseño moderno "Premium".

## Arquitectura de Datos

El núcleo del sistema reside en PostgreSQL (Supabase). Usaremos terminología en español para las entidades de dominio.

### Esquema de Tablas
1. **colegios**: Información base.
   - `id`, `nombre`, `mensualidad`, `tipo` (Privado/Público), `direccion`, `coordenadas`.
2. **distritos**: Zonas geográficas.
   - `id`, `nombre`, `zona` (Norte, Sur, etc.).
3. **resenas**: Opiniones de usuarios.
   - `id`, `rating` (1-5), `comentario`, `usuario_id`, `colegio_id`.
4. **usuarios**: Perfiles de padres.
   - Extendiendo la tabla `auth.users` de Supabase.
5. **favoritos**: Relación N:M entre usuarios y colegios.

## Hoja de Ruta y Estado del Proyecto

### Fase 1: Cimentación (Semana 1)
- [ ] **Configuración Inicial**: Setup de Next.js con TypeScript y Tailwind.
- [ ] **Base de Datos**: Modelado en Supabase y scripts SQL iniciales.
- [ ] **Landing Page**: Página de inicio para captación de leads.

### Fase 2: El Cerebro (Semana 2)
- [ ] **Ingesta de Datos**: Scripts para poblar la tabla de `colegios`.
- [ ] **Conexión Frontend-Backend**: Filtros de búsqueda conectados a SQL.

### Fase 3: Visualización (Semana 3)
- [ ] **Mapa Interactivo**: Integración de Leaflet.js con marcadores dinámicos.
- [ ] **Comparador**: Tabla dinámica para comparar hasta 4 colegios.

### Fase 4: Lanzamiento Beta (Semana 4)
- [ ] **Validación**: Beta en un distrito piloto (ej. Los Olivos).
- [ ] **Optimización**: Índices SQL y SEO técnico.

## Guía de Desarrollo

1. **Idioma**:
   - Variables de dominio y Comentarios: **Español**.
   - Mensajes de commit y documentación: **Español**.
   - Código (keywords) y librerías: Inglés (estándar), pero nombrando variables de negocio en Español (ej. `const colegiosFiltrados = ...`).
2. **Estilo**:
   - Diseño "Premium", animaciones sutiles, limpio.
3. **Persistencia**:
   - Actualizar este README al completar tareas clave.

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Correr servidor de desarrollo
npm run dev
```

## Notas Adicionales
- El proyecto debe mantener una estética de alta calidad visual para generar confianza.
- La optimización SEO es prioridad alta.
