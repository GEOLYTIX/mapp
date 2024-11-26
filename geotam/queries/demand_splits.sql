WITH agg AS (SELECT *
             FROM public.geotam_points
             WHERE id = %{id})


SELECT ARRAY_AGG(
               JSON_BUILD_OBJECT(
                       'data', ARRAY [
                   grocery_perc,
                   food_to_go_perc,
                   clothes_perc,
                   paper_shop_perc,
                   diy_perc,
                   electrical_perc,
                   furniture_perc,
                   games_perc,
                   homeware_perc,
                   music_perc,
                   toys_perc,
                   other_perc
                   ],
                       'backgroundColor', ARRAY [
                           '#a6cee3',
                           '#1f78b4',
                           '#B2DF8A',
                           '#33a02c',
                           '#FB9A99',
                           '#e31a1c',
                           '#FDBF6F',
                           '#ff7f00',
                           '#CAB2D6',
                           '#6a3d9a',
                           '#FFFF99',
                           '#b15928' ]
               )
       )     AS datasets,
       ARRAY [
           ' Grocery ',
           ' Food To Go ',
           ' Clothes ',
           ' Paper Shop ',
           ' DIY ',
           ' Electrical ',
           ' Furniture ',
           ' Games ',
           ' Homeware ',
           ' Music ',
           ' Toys ',
           ' Other '

           ] AS labels

FROM agg