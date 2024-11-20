SELECT
    ARRAY[json_build_object(
        'data', array_agg(value::int),
        'backgroundColor', '#505',
        'type', 'line',
        'fill', false
    )] AS datasets,
    array_agg(SUBSTRING(key, '\d+')) AS labels
FROM ${table}, jsonb_each_text(hhd_projection)
WHERE id = %{id};