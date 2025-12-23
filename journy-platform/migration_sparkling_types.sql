-- Phase 9: Sparkling Wine Type Integration

-- 1. Create the Master Table for Sparkling Types
CREATE TABLE IF NOT EXISTS public.wine_sparkling (
    attribute_number VARCHAR(50) PRIMARY KEY,
    name TEXT NOT NULL
);

-- 2. Seed Master Table
INSERT INTO public.wine_sparkling (attribute_number, name) VALUES
('S001', 'Champagne'),
('S002', 'Cava'),
('S003', 'Prosecco'),
('S004', 'Crémant'),
('S005', 'Sekt'),
('S006', 'Franciacorta'),
('S007', 'Traditional Method Sparkling'),
('S008', 'Charmat Method Sparkling'),
('S009', 'Pet-Nat'),
('S010', 'Frizzante')
ON CONFLICT (attribute_number) DO UPDATE SET name = EXCLUDED.name;

-- 3. Update Product Info Table
ALTER TABLE public.wine_product_info ADD COLUMN IF NOT EXISTS wine_sparkling_attribute_number VARCHAR(50);

-- 4. Constraint (Optional but good practice)
-- ALTER TABLE public.wine_product_info 
-- ADD CONSTRAINT fk_wine_sparkling 
-- FOREIGN KEY (wine_sparkling_attribute_number) 
-- REFERENCES public.wine_sparkling(attribute_number);

-- 5. Refresh the Wine Full Card View
DROP VIEW IF EXISTS public.wine_full_card;

CREATE VIEW public.wine_full_card AS
SELECT 
  w.gtin,
  w.producer_id,
  w.wine_name,
  w.brand_name,
  w.vintage,
  w.product_image_url,
  w.qr_code_url,
  w.is_published,
  w.created_at,
  w.updated_at,
  p.company_name as producer_company_name,
  p.country_code as producer_country_code,
  p.country_code as producer_country_name,
  r.geographical_area as producer_region,
  r.region_name as producer_region_name,
  p.district as producer_district,
  wpi.wine_category,
  wpi.wine_type,
  wpi.bottle_volume_ml,
  wpi.variety_gpc_code,
  wpi.wine_sparkling_attribute_number, -- Added ID
  ws.name as sparkling_type_name,       -- Added Name
  td.alcohol_content_percent,
  td.residual_sugar_gpl,
  td.total_acidity_gpl,
  td.so2_total_mgpl,
  td.energy_kcal_per_100ml,
  td.energy_kj_per_100ml,
  td.energy_carbs_of_sugar,
  td.energy_carbs,
  td.best_before_date,
  prod.harvest_method,
  prod.fermentation_vessel,
  prod.vineyard_source,
  prod.aging_vessel,
  prod.aging_duration_months,
  ferm.dosage_level,
  ferm.secondary_fermentation_time,
  ferm.lees_aging,
  ferm.riddling_method,
  ferm.disgorgement_method,
  ferm.primary_fermentation_vessel,
  s.taste_profile,
  s.texture_finish,
  s.color_intensity,
  s.color_hue,
  s.color_description,
  s.serving_temp_min_c,
  s.serving_temp_max_c,
  s.aging_potential,
  s.sweetness_level,
  s.body_level,
  s.acidity_level,
  s.tannin_level,
  pack.bottle_type,
  pack.material_code_bottle,
  pack.closure_type,
  pack.material_code_closure,
  pack.capsule_type,
  pack.material_code_capsule,
  pack.weight_finished_product_g,
  ARRAY_AGG(DISTINCT wg.grape_variety || ' ' || wg.percentage || '%') FILTER (WHERE wg.grape_variety IS NOT NULL) as grape_varieties,
  ARRAY_AGG(DISTINCT wi.ingredient_code) FILTER (WHERE wi.ingredient_code IS NOT NULL) as ingredients,
  ARRAY_AGG(DISTINCT wa.aroma_code) FILTER (WHERE wa.aroma_code IS NOT NULL) as aromas,
  ARRAY_AGG(DISTINCT wt.taste_code) FILTER (WHERE wt.taste_code IS NOT NULL) as taste_characteristics,
  ARRAY_AGG(DISTINCT wc.certificate_code) FILTER (WHERE wc.certificate_code IS NOT NULL) as certificates,
  ARRAY_AGG(DISTINCT wfp.pairing_code) FILTER (WHERE wfp.pairing_code IS NOT NULL) as food_pairings
FROM public.wine w
LEFT JOIN public.producer p ON w.producer_id = p.id
LEFT JOIN public.geo_region r ON p.geo_region_id = r.id
LEFT JOIN public.wine_product_info wpi ON w.gtin = wpi.gtin
LEFT JOIN public.wine_sparkling ws ON wpi.wine_sparkling_attribute_number = ws.attribute_number
LEFT JOIN public.wine_technical_data td ON w.gtin = td.gtin
LEFT JOIN public.wine_production prod ON w.gtin = prod.gtin
LEFT JOIN public.wine_fermentation ferm ON w.gtin = ferm.gtin
LEFT JOIN public.wine_sensory s ON w.gtin = s.gtin
LEFT JOIN public.wine_packaging pack ON w.gtin = pack.gtin
LEFT JOIN public.wine_grape wg ON w.gtin = wg.gtin
LEFT JOIN public.wine_ingredient wi ON w.gtin = wi.gtin
LEFT JOIN public.wine_aroma wa ON w.gtin = wa.gtin
LEFT JOIN public.wine_taste wt ON w.gtin = wt.gtin
LEFT JOIN public.wine_certificate wc ON w.gtin = wc.gtin
LEFT JOIN public.wine_food_pairing wfp ON w.gtin = wfp.gtin
GROUP BY 
  w.gtin, w.producer_id, w.wine_name, w.brand_name, w.vintage, w.product_image_url, w.qr_code_url, w.is_published, w.created_at, w.updated_at,
  p.company_name, p.country_code, r.geographical_area, r.region_name, p.district,
  wpi.wine_category, wpi.wine_type, wpi.bottle_volume_ml, wpi.variety_gpc_code, wpi.wine_sparkling_attribute_number, ws.name,
  td.alcohol_content_percent, td.residual_sugar_gpl, td.total_acidity_gpl, td.so2_total_mgpl,
  td.energy_kcal_per_100ml, td.energy_kj_per_100ml, td.energy_carbs_of_sugar, td.energy_carbs, td.best_before_date,
  prod.harvest_method, prod.fermentation_vessel, prod.vineyard_source, prod.aging_vessel, prod.aging_duration_months,
  ferm.dosage_level, ferm.secondary_fermentation_time, ferm.lees_aging, ferm.riddling_method, ferm.disgorgement_method, ferm.primary_fermentation_vessel,
  s.taste_profile, s.texture_finish, s.color_intensity, s.color_hue, s.color_description,
  s.serving_temp_min_c, s.serving_temp_max_c, s.aging_potential,
  s.sweetness_level, s.body_level, s.acidity_level, s.tannin_level,
  pack.bottle_type, pack.material_code_bottle, pack.closure_type, pack.material_code_closure, pack.capsule_type, pack.material_code_capsule, pack.weight_finished_product_g;
