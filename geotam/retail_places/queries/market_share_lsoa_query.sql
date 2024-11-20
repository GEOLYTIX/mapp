SELECT lsoa_id AS id, market_share, market_share_label
FROM geodata.uk_glx_geodata_retail_place_catchment_view
WHERE rpid = %{id}
ORDER BY market_share DESC
LIMIT 20;