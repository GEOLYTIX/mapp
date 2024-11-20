SELECT
    ARRAY[json_build_object(
        'data', array_agg(value::int),
        'backgroundColor', '#A21309',
        'type', 'line',
        'fill', false
    )] AS datasets,
    array_agg(SUBSTRING(key, '\d+')) AS labels
FROM ${table}, jsonb_each_text(population_projection)
WHERE id = %{id};