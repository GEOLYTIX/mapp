WITH x AS (
    SELECT
        round((housetype_houses / NULLIF((housetype_houses + housetype_flats + housetype_other)::numeric, 0)) * 100, 0) as housetype_houses,
        round((housetype_flats / NULLIF((housetype_houses + housetype_flats + housetype_other)::numeric, 0)) * 100, 0) as housetype_flats,
        round((housetype_other / NULLIF((housetype_houses + housetype_flats + housetype_other)::numeric, 0)) * 100, 0) as housetype_other
    FROM ${table}
    WHERE id = %{id}
)

SELECT ARRAY[json_build_object('data', ARRAY[housetype_houses, housetype_flats, housetype_other])] AS datasets
FROM x;