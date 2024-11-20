WITH x AS (
    SELECT
        round((abhrp::numeric / NULLIF((abhrp + c1hrp + c2hrp + dehrp)::numeric, 0)) * 100, 0) as abhrp,
        round((c1hrp::numeric / NULLIF((abhrp + c1hrp + c2hrp + dehrp)::numeric, 0)) * 100, 0) as c1hrp,
        round((c2hrp::numeric / NULLIF((abhrp + c1hrp + c2hrp + dehrp)::numeric, 0)) * 100, 0) as c2hrp,
        round((dehrp::numeric / NULLIF((abhrp + c1hrp + c2hrp + dehrp)::numeric, 0)) * 100, 0) as dehrp
    FROM ${table}
    WHERE id = %{id}
)

SELECT
    ARRAY[json_build_object('data', ARRAY[abhrp, c1hrp, c2hrp, dehrp])] AS datasets
FROM x;