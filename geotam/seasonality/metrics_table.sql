WITH seasonality AS (SELECT UNNEST(ARRAY [
    'Population',
    'Students',
    'Workers',
    'Tourists'])                                                                            AS Metric,
                            UNNEST(ARRAY [
                                CASE WHEN pop IS NULL THEN '-' ELSE pop::text END,
                                CASE WHEN student IS NULL THEN '-' ELSE student::text END,
                                CASE WHEN worker IS NULL THEN '-' ELSE worker::text END,
                                CASE WHEN tourist IS NULL THEN '-' ELSE tourist::text END]) AS count,
                            UNNEST(ARRAY [
                                CASE WHEN popscr IS NULL THEN '-' ELSE popscr::text END,
                                CASE WHEN studentscr IS NULL THEN '-' ELSE studentscr::text END,
                                CASE WHEN workerscr IS NULL THEN '-' ELSE workerscr::text END,
                                CASE WHEN touristscr IS NULL THEN '-' ELSE touristscr::text END
                                ])                                                          AS score
                     FROM geodata.uk_glx_geodata_seamless_combined_seasonality
                     WHERE id = %{id})
SELECT seasonality.Metric,
       seasonality.count,
       seasonality.score
FROM seasonality;