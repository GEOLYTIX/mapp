select
	heads.retailer,
	coalesce(vals.total,0) as total,
	coalesce(vals.convenience,0) as convenience,
	coalesce(vals.small_supermarket,0) as small_supermarket,
	coalesce(vals.medium_supermarket,0) as medium_supermarket,
	coalesce(vals.large_supermarket,0) as large_supermarket
from
(select retailer
from 
geodata.uk_glx_open_retail_points r
group by retailer
) heads
left join 
(select 
	retailer, 
	count(*) as total,
	sum(case when size_band = '< 3,013 ft2 (280m2)' then 1 else 0 end) as convenience,
	sum(case when size_band = '3,013 < 15,069 ft2 (280 < 1,400 m2)' then 1 else 0 end) as small_supermarket,
	sum(case when size_band = '15,069 < 30,138 ft2 (1,400 < 2,800 m2)' then 1 else 0 end) as medium_supermarket,
	sum(case when size_band = '30,138 ft2 > (2,800 m2)' then 1 else 0 end) as large_supermarket
from geodata.uk_glx_open_retail_points r
inner join ${table} g
on st_intersects(r.geom_p_3857, g.geom_3857)
where g.${id_field} =%{id}
group by retailer
) vals
on vals.retailer = heads.retailer
order by heads.retailer; 