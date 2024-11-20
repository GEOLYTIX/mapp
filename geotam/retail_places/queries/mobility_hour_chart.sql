select
	ARRAY [
		
		  json_build_object(
		  'label', regionname,
		  'indexAxis', 'x',
      'type', 'bar',
      'borderColor', '#939FAA',
      'backgroundColor', '#939FAA',
      'fill', true,
		  'data', array(select 100 * unnest(region_hours_avg))
		  ),
		
		json_build_object(
		  'label', rp_name,
		  'indexAxis', 'x',
      'type', 'bar',
      'borderColor', '#7398C4',
      'backgroundColor', '#7398C4',
      'fill', true,
		  'data', array(select 100 * unnest(rp_hours_avg))
		  )

		  ] as Datasets,
		 
	ARRAY [
		   '00:00',
		   '01:00',
		   '02:00',
		   '03:00',
		   '04:00',
		   '05:00',
		   '06:00',
		   '07:00',
		   '08:00',
		   '09:00',
		   '10:00',
		   '11:00',
		   '12:00',
		   '13:00',
		   '14:00',
		   '15:00',
		   '16:00',
		   '17:00',
		   '18:00',
		   '19:00',
		   '20:00',
		   '21:00',
		   '22:00',
		   '23:00'
	] as labels
FROM geodata.uk_glx_mobility_retail_place_2022_huq_perc
WHERE rp_id = %{id}