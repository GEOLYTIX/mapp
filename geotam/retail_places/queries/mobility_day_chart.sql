select
	ARRAY [
		
		  json_build_object(
		  'label', regionname,
		  'indexAxis', 'x',
      'type', 'bar',
      'borderColor', '#939FAA',
      'backgroundColor', '#939FAA',
		  'data', array(select 100 * unnest(region_weekday_avg))
		  ),
		
		json_build_object(
		  'label', rp_name,
		  'indexAxis', 'x',
      'type', 'bar',
      'borderColor', '#7398C4',
      'backgroundColor', '#7398C4',
		  'data', array(select 100 * unnest(rp_weekday_avg))
		  )

		  ] as Datasets,
		 
	ARRAY [
		   'Sunday',
		   'Monday',
		   'Tuesday',
		   'Wednesday',
		   'Thursday',
		   'Friday',
		   'Saturday'
	] as labels
FROM geodata.uk_glx_mobility_retail_place_2022_huq_perc
WHERE rp_id = %{id}
