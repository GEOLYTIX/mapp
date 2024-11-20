WITH DATA AS (
SELECT
    jsonb_array_elements(json_array) -> 'month' AS month,
    jsonb_array_elements(json_array)-> 'visitors' AS visitors,
    jsonb_array_elements(json_array)-> 'yoy' AS yoy
    FROM geodata.uk_glx_geodata_retail_place_footfall_tracker_mapp
    WHERE rpid = %{id}
)

SELECT
    to_char(visitors::integer, 'FM999,999,999,999') as visitors,
    round(yoy::numeric * 100,1) || '%' as visitors_yoy_change
FROM DATA
ORDER BY month DESC
LIMIT 1;