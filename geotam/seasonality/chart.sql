WITH site AS (SELECT jan_idx,
                     feb_idx,
                     mar_idx,
                     apr_idx,
                     may_idx,
                     jun_idx,
                     jul_idx,
                     aug_idx,
                     sep_idx,
                     oct_idx,
                     nov_idx,
                     dec_idx
              FROM geodata.uk_glx_geodata_seamless_combined_seasonality
              WHERE id = %{id}),

     data AS (SELECT
                  -- We get all the information and put it into an array of datasets (as can have multiple lines or bars on the same chart)
                  -- if you run this in DataGrip / PgAdmin you should always get 1 row returned
                  ARRAY [

                      -- Here we build a json object consisting of 'data'
                      -- This is the data required for the chart (this will typically be the y-axis values)
                      JSON_BUILD_OBJECT(
                              'data',

                          -- We provide this as an array of fields
                              ARRAY [
                                  jan_idx,
                                  feb_idx,
                                  mar_idx,
                                  apr_idx,
                                  may_idx,
                                  jun_idx,
                                  jul_idx,
                                  aug_idx,
                                  sep_idx,
                                  oct_idx,
                                  nov_idx,
                                  dec_idx
                                  ],
                          -- Then we provide the chart parameters as key-value pair
                          -- Label is what shows when you hover over the element
                              'label', 'Seasonality Index',
                          -- The type of the chart
                              'type', 'bar',

                          -- Here we can provide an array of colours for the bars
                              'backgroundColor',
                              '#e41a1c'
                          )] AS datasets,

                  -- Here we provide an array of labels for the chart (this will typically be the x-axis values)
                  ARRAY [
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                      'Jul',
                      'Aug',
                      'Sep',
                      'Oct',
                      'Nov',
                      'Dec'
                      ]      AS labels
              FROM site
              WHERE (
                            jan_idx IS NOT NULL AND
                            feb_idx IS NOT NULL AND
                            mar_idx IS NOT NULL AND
                            apr_idx IS NOT NULL AND
                            may_idx IS NOT NULL AND
                            jun_idx IS NOT NULL AND
                            jul_idx IS NOT NULL AND
                            aug_idx IS NOT NULL AND
                            sep_idx IS NOT NULL AND
                            oct_idx IS NOT NULL AND
                            nov_idx IS NOT NULL AND
                            dec_idx IS NOT NULL
                        ))

SELECT *
FROM DATA;