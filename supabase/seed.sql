-- Limpiar datos existentes
TRUNCATE TABLE colegios, distritos RESTART IDENTITY CASCADE;

-- 1. Insertar Distritos
INSERT INTO distritos (nombre, zona, coordenadas_centro) VALUES
('Los Olivos', 'Norte', point(-11.9916, -77.0709)),
('San Miguel', 'Oeste', point(-12.0911, -77.0805)),
('Miraflores', 'Sur', point(-12.1111, -77.0316)),
('Santiago de Surco', 'Sur', point(-12.1453, -76.9930));

-- 2. Insertar Colegios Reales
INSERT INTO colegios (
  nombre, 
  slug, 
  distrito_id, 
  direccion, 
  tipo, 
  mensualidad_min, 
  mensualidad_max, 
  matricula, 
  cuota_ingreso, 
  rating_promedio, 
  fotos,
  coordenadas
) VALUES

-- LOS OLIVOS
(
  'Innova Schools - Los Olivos', 
  'innova-schools-los-olivos', 
  (SELECT id FROM distritos WHERE nombre = 'Los Olivos' LIMIT 1),
  'Av. Alfredo Mendiola 6068', 
  'Privado', 
  620.00, 
  700.00, 
  600.00, 
  800.00, 
  4.2, 
  ARRAY['https://www.innovaschools.edu.pe/wp-content/uploads/2019/02/Los-Olivos-1.jpg', 'https://www.innovaschools.edu.pe/wp-content/uploads/2019/02/Los-Olivos-2.jpg'],
  '(-11.9570, -77.0690)'
),
(
  'Colegio Monserrat - Los Olivos', 
  'colegio-monserrat-los-olivos', 
  (SELECT id FROM distritos WHERE nombre = 'Los Olivos' LIMIT 1),
  'Jr. Los Alisos 123', 
  'Privado', 
  550.00, 
  600.00, 
  550.00, 
  500.00, 
  4.0, 
  ARRAY['https://colegiomonserrat.edu.pe/wp-content/uploads/2021/01/BANDEROLA-FACEBOOK-01.jpg'],
  '(-11.9800, -77.0700)'
),

-- SAN MIGUEL
(
  'Colegio Claretiano', 
  'colegio-claretiano', 
  (SELECT id FROM distritos WHERE nombre = 'San Miguel' LIMIT 1),
  'Av. Parque de las Leyendas 555', 
  'Religioso', 
  1100.00, 
  1300.00, 
  1100.00, 
  1500.00, 
  4.7, 
  ARRAY['https://upload.wikimedia.org/wikipedia/commons/e/e4/Colegio_Claretiano_de_Lima.jpg', 'https://claretiano.edu.pe/wp-content/uploads/2022/01/fachada-2022.jpg'],
  '(-12.0740, -77.0891)'
),
(
  'Colegio Peruano Chino Diez de Octubre', 
  'diez-de-octubre-san-miguel', 
  (SELECT id FROM distritos WHERE nombre = 'San Miguel' LIMIT 1),
  'Av. La Marina 2500', 
  'Privado', 
  950.00, 
  1100.00, 
  950.00, 
  2000.00, 
  4.5, 
  ARRAY['https://www.colegiodiezdeoctubre.edu.pe/wp-content/uploads/2021/02/DSC04689.jpg'],
  '(-12.0790, -77.0870)'
),
(
  'Colegio América del Callao (Ref. San Miguel)', 
  'colegio-america-callao', 
  (SELECT id FROM distritos WHERE nombre = 'San Miguel' LIMIT 1), 
  'Av. Nicolás de Piérola 350', 
  'Privado', 
  1200.00, 
  1400.00, 
  1200.00, 
  3000.00, 
  4.6, 
  ARRAY['https://www.america.edu.pe/assets/img/slider/slider1.jpg'],
  '(-12.0650, -77.1260)'
),

-- MIRAFLORES
(
  'Markham College', 
  'markham-college', 
  (SELECT id FROM distritos WHERE nombre = 'Miraflores' LIMIT 1),
  'Calle Augusto Angulo 291', 
  'Internacional', 
  4500.00, 
  5800.00, 
  5000.00, 
  60000.00, 
  4.9, 
  ARRAY['https://www.markham.edu.pe/wp-content/uploads/2020/09/Early-Years-Facilities-2.jpg', 'https://www.markham.edu.pe/wp-content/uploads/2020/09/Lower-School-Facilities-1.jpg'],
  '(-12.1243, -77.0168)'
),
(
  'San Silvestre School', 
  'san-silvestre-school', 
  (SELECT id FROM distritos WHERE nombre = 'Miraflores' LIMIT 1),
  'Av. Santa Cruz 1251', 
  'Internacional', 
  4200.00, 
  5500.00, 
  4500.00, 
  55000.00, 
  4.8, 
  ARRAY['https://www.sansilvestre.edu.pe/uploads/galerias/86/galeria_86_1.jpg'],
  '(-12.1150, -77.0350)'
),

-- SURCO
(
  'Santa María Marianistas', 
  'santa-maria-marianistas', 
  (SELECT id FROM distritos WHERE nombre = 'Santiago de Surco' LIMIT 1),
  'Av. La Floresta 250', 
  'Religioso', 
  2800.00, 
  3200.00, 
  2800.00, 
  15000.00, 
  4.8, 
  ARRAY['https://www.santamaria.edu.pe/wp-content/uploads/2020/12/fachada.jpg'],
  '(-12.1050, -76.9800)' 
),
(
  'Colegio Peruano Británico', 
  'peruano-britanico', 
  (SELECT id FROM distritos WHERE nombre = 'Santiago de Surco' LIMIT 1),
  'Av. Vía Láctea 445', 
  'Internacional', 
  3800.00, 
  4500.00, 
  4000.00, 
  45000.00, 
  4.7, 
  ARRAY['https://www.britishschool.edu.pe/wp-content/uploads/2019/07/slider-home-01.jpg'],
  '(-12.0850, -76.9750)'
);
