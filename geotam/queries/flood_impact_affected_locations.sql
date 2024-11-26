WITH catchment AS (SELECT geom
                   FROM scratch
                   WHERE id = %{id})
-- Select all the points within the catchment
            SELECT id, ST_AsText(geom_p_4326) as geom_p_4326
                FROM catchment c
                         LEFT JOIN geotam_points p
                                   ON st_intersects(p.geom_p_4326, c.geom)