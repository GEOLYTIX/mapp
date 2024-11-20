SELECT 
  ARRAY [
    json_build_object(
      'data', ARRAY [
        ROUND(comp_pct::numeric, 2),
        ROUND(conv_pct::numeric, 2),
        ROUND(fbl_pct::numeric, 2),
        ROUND(serv_pct::numeric, 2)
      ],
      'backgroundColor', ARRAY [
        '#FFA630',
        '#C6DEA6',
        '#7EBDC3',
        '#7A6263'
      ],
      'borderColor', ARRAY [
        '#FFA630',
        '#C6DEA6',
        '#7EBDC3',
        '#7A6263'
      ]
    )
  ] AS datasets,
  ARRAY [
    'Comparison',
    'Convenience',
    'F/B/L',
    'Services'
  ] AS labels
 FROM geodata.uk_glx_geodata_retail_place_updated
 WHERE id = %{id};