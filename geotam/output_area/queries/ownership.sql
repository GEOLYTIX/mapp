WITH x AS (
    SELECT
        round((dwelling_ownhome / NULLIF((dwelling_ownhome + dwelling_socialrented + dwelling_privaterented + dwelling_rentfree), 0)) * 100, 0) as dwelling_ownhome,
        round((dwelling_socialrented / NULLIF((dwelling_ownhome + dwelling_socialrented + dwelling_privaterented + dwelling_rentfree), 0)) * 100, 0) as dwelling_socialrented,
        round((dwelling_privaterented / NULLIF((dwelling_ownhome + dwelling_socialrented + dwelling_privaterented + dwelling_rentfree), 0)) * 100, 0) as dwelling_privaterented,
        round((dwelling_rentfree / NULLIF((dwelling_ownhome + dwelling_socialrented + dwelling_privaterented + dwelling_rentfree), 0)) * 100, 0) as dwelling_rentfree
    FROM ${table}
    WHERE id = %{id}
)

SELECT
    ARRAY[json_build_object('data', ARRAY[dwelling_ownhome, dwelling_socialrented, dwelling_privaterented, dwelling_rentfree])] AS datasets,
    ARRAY['Own Home', 'Social Rented', 'Private Rented', 'Rent Free'] AS labels
FROM x;
