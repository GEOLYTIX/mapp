WITH
RP_FOOTFALL_24MONTHS AS (
    SELECT
    jsonb_array_elements(a.json_array::jsonb)-> 'visitors' as visitors,
    jsonb_array_elements(a.json_array::jsonb)-> 'month' AS month,
    CONCAT(TO_CHAR(((jsonb_array_elements(a.json_array::jsonb)->> 'month')::DATE),'Mon'),' ',TO_CHAR(((jsonb_array_elements(a.json_array::jsonb)->> 'month')::DATE),'YYYY')) AS month_label
    FROM (SELECT type FROM geodata.uk_glx_geodata_retail_place_footfall_tracker_mapp WHERE rpid=%{id}) x
    LEFT JOIN geodata.uk_glx_geodata_retail_place_footfall_tracker_aggregate a
    ON a.agg_value = x.type
    ORDER BY jsonb_array_elements(a.json_array::jsonb)-> 'month' DESC
    LIMIT 24
),

RP_FOOTFALL AS (
    SELECT *
    FROM RP_FOOTFALL_24MONTHS
    ORDER BY month ASC
),

RP_FOOTFALL_GRAPH AS (
  SELECT
    json_build_object(
      'data',
      array_agg(RP_FOOTFALL.visitors),
      'month',
      array_agg(RP_FOOTFALL.month),
      'label',
      'RP Type Aggregate Footfall',
      'backgroundColor',
      'rgba(67,160,71, 0.1)',
      'borderColor',
      'rgba(67,160,71, 0.7)',
      'pointBackgroundColor',
      'rgba(67,160,71, 0.7)',
      'pointStyle',
      'triangle',
      'pointRadius',
      3,
      'hoverRadius',
      8,
      'tension',
      0.7
    ) dataset,
    array_agg(RP_FOOTFALL.month_label) AS labels
  FROM RP_FOOTFALL
)

SELECT
  ARRAY[
   RP_FOOTFALL_GRAPH.dataset
  ] AS datasets,
  RP_FOOTFALL_GRAPH.labels AS labels
FROM
  RP_FOOTFALL_GRAPH;
