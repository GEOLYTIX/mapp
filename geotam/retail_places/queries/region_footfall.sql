WITH
REGION_DATA_24MONTHS AS (
    SELECT
    jsonb_array_elements(a.json_array::jsonb)-> 'visitors' as visitors,
    jsonb_array_elements(a.json_array::jsonb)-> 'month' AS month,
    CONCAT(TO_CHAR(((jsonb_array_elements(a.json_array::jsonb)->> 'month')::DATE),'Mon'),' ',TO_CHAR(((jsonb_array_elements(a.json_array::jsonb)->> 'month')::DATE),'YYYY')) AS month_label
    FROM (SELECT gor FROM geodata.uk_glx_geodata_retail_place_footfall_tracker_mapp WHERE rpid=%{id}) x
    LEFT JOIN geodata.uk_glx_geodata_retail_place_footfall_tracker_aggregate a
    ON a.agg_value = x.gor
    ORDER BY jsonb_array_elements(a.json_array::jsonb)-> 'month' DESC
    LIMIT 24
),

REGION_DATA AS (
    SELECT *
    FROM REGION_DATA_24MONTHS
    ORDER BY month ASC
),

REGION_GRAPH AS (
    SELECT
    json_build_object(
      'data',
      array_agg(REGION_DATA.visitors),
      'month',
      array_agg(REGION_DATA.month),
      'label',
      'Region Aggregate Footfall',
      'backgroundColor',
      'rgba(183,28,28, 0.2)',
      'borderColor',
      'rgb(183,28,28)',
      'pointBackgroundColor',
      'rgba(183,28,28, 0.5)',
      'pointStyle',
      'rect',
      'pointRadius',
      3,
      'hoverRadius',
      8,
      'tension',
      0.7
    ) dataset,
    array_agg(REGION_DATA.month_label) AS labels
  FROM REGION_DATA
)

SELECT
ARRAY [
   REGION_GRAPH.dataset
] AS datasets,
  REGION_GRAPH.labels AS labels
FROM
  REGION_GRAPH
