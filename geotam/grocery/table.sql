SELECT 
id as id, 
store_name, 
retailer, 
fascia, 
size_sqft 
FROM ${table} 
WHERE true ${viewport} ${filter};