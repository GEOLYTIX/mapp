WITH
DATA_24MONTHS AS (
    SELECT
    r.gor,
    r.type,
    jsonb_array_elements(r.json_array)-> 'yoy' as yoy,
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

REGION_DATA_24MONTHS AS (
    SELECT
    jsonb_array_elements(a.json_array::jsonb)-> 'yoy' as yoy,
    jsonb_array_elements(a.json_array::jsonb)-> 'month' AS month
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

REGION_YOY_24MONTHS AS (
     SELECT
    jsonb_array_elements(a.json_array::jsonb)-> 'yoy' as yoy,
    jsonb_array_elements(a.json_array::jsonb)-> 'month' AS month
    FROM (SELECT type FROM geodata.uk_glx_geodata_retail_place_footfall_tracker_mapp WHERE rpid=%{id}) x
    LEFT JOIN geodata.uk_glx_geodata_retail_place_footfall_tracker_aggregate a
    ON a.agg_value = x.type
    ORDER BY jsonb_array_elements(a.json_array::jsonb)-> 'month' DESC
    LIMIT 24
),

REGION_YOY AS (
    SELECT *
    FROM REGION_YOY_24MONTHS
    ORDER BY month ASC
),

RP_GRAPH AS (
    SELECT
    json_build_object(
      'data',
      array_agg(DATA.yoy::NUMERIC*100),
      'month',
      array_agg(DATA.month),
      'label',
      'Location YOY Change %',
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
),

REGION_GRAPH AS (
    SELECT
    json_build_object(
      'data',
      array_agg(REGION_DATA.yoy::NUMERIC*100),
      'month',
      array_agg(REGION_DATA.month),
      'label',
      'Region Aggregate YOY Change %',
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
    ) dataset
  FROM REGION_DATA
),

REGION_YOY_GRAPH AS (
  SELECT
    json_build_object(
      'data',
      array_agg(REGION_YOY.yoy::NUMERIC*100),
      'month',
      array_agg(REGION_YOY.month),
      'label',
      'RP Type Aggregate YOY Change %',
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
    ) dataset
  FROM REGION_YOY
)

SELECT
  ARRAY[
   RP_GRAPH.dataset,
   REGION_GRAPH.dataset,
   REGION_YOY_GRAPH.dataset
  ] AS datasets,
  RP_GRAPH.labels AS labels
FROM
  RP_GRAPH,
  REGION_GRAPH,
  REGION_YOY_GRAPH;
