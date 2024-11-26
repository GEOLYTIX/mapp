WITH catchment AS (SELECT geom
                   FROM scratch
                   WHERE id = %{id}),
-- Select all the points within the catchment
     points AS (SELECT *
                FROM catchment c
                         LEFT JOIN geotam_points p
                                   ON st_intersects(p.geom_p_4326, c.geom))
SELECT COUNT(*)                                            AS number_of_points,
       ${days_selected}                                    AS days_selected,
       '${month_selected_pretty}'                                 AS month_selected,
       SUM(${month_selected}_daily_dmd * ${days_selected}) AS total_impact
FROM points