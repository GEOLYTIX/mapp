SELECT
id, 
rp_name, 
rp_type, 
comp_strgh, 
est_brands 
FROM geodata.uk_glx_geodata_retail_place_updated 
WHERE true ${viewport} ${filter} limit 99;