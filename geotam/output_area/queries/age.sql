WITH x AS (
    SELECT
        round((age0to17 / NULLIF((age0to17 + age18to19 + age20to24 + age25to29 + age30to44 + age45to59 + age60to74 + age75plus)::NUMERIC, 0)) * 100, 0) as age0to17,
        round((age18to19 / NULLIF((age0to17 + age18to19 + age20to24 + age25to29 + age30to44 + age45to59 + age60to74 + age75plus)::NUMERIC, 0)) * 100, 0) as age18to19,
        round((age20to24 / NULLIF((age0to17 + age18to19 + age20to24 + age25to29 + age30to44 + age45to59 + age60to74 + age75plus)::NUMERIC, 0)) * 100, 0) as age20to24,
        round((age25to29 / NULLIF((age0to17 + age18to19 + age20to24 + age25to29 + age30to44 + age45to59 + age60to74 + age75plus)::NUMERIC, 0)) * 100, 0) as age25to29,
        round((age30to44 / NULLIF((age0to17 + age18to19 + age20to24 + age25to29 + age30to44 + age45to59 + age60to74 + age75plus)::NUMERIC, 0)) * 100, 0) as age30to44,
        round((age45to59 / NULLIF((age0to17 + age18to19 + age20to24 + age25to29 + age30to44 + age45to59 + age60to74 + age75plus)::NUMERIC, 0)) * 100, 0) as age45to59,
        round((age60to74 / NULLIF((age0to17 + age18to19 + age20to24 + age25to29 + age30to44 + age45to59 + age60to74 + age75plus)::NUMERIC, 0)) * 100, 0) as age60to74,
        round((age75plus / NULLIF((age0to17 + age18to19 + age20to24 + age25to29 + age30to44 + age45to59 + age60to74 + age75plus)::NUMERIC, 0)) * 100, 0) as age75plus
    FROM ${table}
    WHERE id = %{id}
)

SELECT
    ARRAY[json_build_object('data', ARRAY[age0to17, age18to19, age20to24, age25to29, age30to44, age45to59, age60to74, age75plus])] AS datasets
FROM x;
