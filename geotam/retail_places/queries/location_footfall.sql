WITH
DATA_24MONTHS AS (
    SELECT
    r.gor,
    r.type,
    jsonb_array_elements(r.json_array)-> 'visitors' as visitors,
    jsonb_array_elements(r.json_array)-> 'month' AS month,
    CONCAT(TO_CHAR(((jsonb_array_elements(r.json_array)->> 'month')::DATE),'Mon'),' ',TO_CHAR(((jsonb_array_elements(r.json_array)->> 'month')::DATE),'YYYY')) AS month_label
    FROM
    geodata.uk_glx_geodata_retail_place_footfall_tracker_mapp r
    WHERE r.rpid = %{id}
    ORDER BY jsonb_array_elements(r.json_array)-> 'month' DESC
    LIMIT 24
),

DATA AS (
    SELECT * FROM DATA_24MONTHS
    ORDER BY month ASC
),

LOCATION_GRAPH AS (
    SELECT
    json_build_object(
      'data',
      array_agg(DATA.visitors),
      'month',
      array_agg(DATA.month),
      'label',
      'Location Footfall',
      'backgroundColor',
      'rgba(41,121,255, 0.1)',
      'borderColor',
      'rgba(41,121,255, 0.7)',
      'pointBackgroundColor',
      'rgba(41,121,255, 0.5)',
      'pointRadius',
      3,
      'hoverRadius',
      8,
      'tension',
      0.7
    ) dataset,
    array_agg(DATA.month_label) AS labels
  FROM DATA
)

SELECT
  ARRAY[
   LOCATION_GRAPH.dataset
  ] AS datasets,
  LOCATION_GRAPH.labels AS labels
FROM
  LOCATION_GRAPH;
