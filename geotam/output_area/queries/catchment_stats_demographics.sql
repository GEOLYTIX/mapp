select
  measure,
  category,
  rtrim(to_char(numbers, 'FM999G999G999G999G990.999'), '.') as catchment,
  national_numbers as UK,
  case when national_numbers is null then null else round(numbers / national_numbers * 100) end as Index,
  case when national_numbers is null then 0 else case when round(numbers / national_numbers * 100)< 100 then 100 - round(numbers / national_numbers * 100) else 0 end end underindex,
  case when national_numbers is null then 0 else case when round(numbers / national_numbers * 100)> 100 then round(numbers / national_numbers * 100)-100 else 0 end end overindex
from
    (select
        UNNEST(
            ARRAY [
            'Population Current (' || (select population_current_desc from geodata.uk_glx_geodata_oa_metrics_new limit 1) || ')', -- provides current year to label
            'Population 2023',
            'Population 2024',
            'Population 2025',
            'Population 2026',
            'Population 2027',
            'Households Current (' || (select population_current_desc from geodata.uk_glx_geodata_oa_metrics_new limit 1) || ')', -- provides current year to label
            'Workers',
            'White %',
            'Car Ownership %',
            'Students %',
            'House %',
            'Flats %',
            'Own Home %',
            'Social Rented %',
            'Private Rented %',
            'Social Grade AB %',
            'Social Grade C1 %',
            'Social Grade C2 %',
            'Social Grade DE %',
            'OAC - Rural Residents',
            'OAC - Cosmopolitans',
            'OAC - Ethnicity Central',
            'OAC - Multicultural Metropolitans',
            'OAC - Urbanites',
            'OAC - Suburbanites',
            'OAC - Constrained City Dwellers',
            'OAC - Hard-Pressed Living',
            'Age <18 %',
            'Age 18 -24 %',
            'Age 25 - 44 %',
            'Age 45 - 59 %',
            'Age 60+ %'
            ]
        ) AS measure,
            UNNEST(
            ARRAY [
            'Population Change',
            'Population Change',
            'Population Change',
            'Population Change',
            'Population Change',
            'Population Change',
            'Population Change',
            'Summary',
            'Summary',
            'Summary',
            'Summary',
            'Home Ownership',
            'Home Ownership',
            'Home Ownership',
            'Home Ownership',
            'Home Ownership',
            'Social Grade',
            'Social Grade',
            'Social Grade',
            'Social Grade',
            'OAC Supergroups',
            'OAC Supergroups',
            'OAC Supergroups',
            'OAC Supergroups',
            'OAC Supergroups',
            'OAC Supergroups',
            'OAC Supergroups',
            'OAC Supergroups',
            'Age Profile',
            'Age Profile',
            'Age Profile',
            'Age Profile',
            'Age Profile'
            ]
        ) AS category,
	    UNNEST(numbers) as numbers,
	    UNNEST(national_numbers) as national_numbers
    from
        (select
        ARRAY [
            pop_current,
            pop_2023,
            pop_2024,
            pop_2025,
            pop_2026,
            pop_2027,
            hhd_current,
            coalesce(workers,0),
            round(white*100,1),
            round(car_ownership*100,1),
            round(students*100,1),
            round(housetype_houses*100,1),
            round(housetype_flats*100,1),
            round(dwelling_ownhome*100,1),
            round(dwelling_socialrented*100,1),
            round(dwelling_privaterented*100,1),
            round(abhrp*100,1),
            round(c1hrp*100,1),
            round(c2hrp*100,1),
            round(dehrp*100,1),
            round(oac_supergroup_1*100,1),
            round(oac_supergroup_2*100,1),
            round(oac_supergroup_3*100,1),
            round(oac_supergroup_4*100,1),
            round(oac_supergroup_5*100,1),
            round(oac_supergroup_6*100,1),
            round(oac_supergroup_7*100,1),
            round(oac_supergroup_8*100,1),
            round(age_under_18*100,1),
            round(age_18to24*100,1),
            round(age_25to44*100,1),
            round(age_45to59*100,1),
            round(age_60plus*100,1)
        ] as numbers
        from
            (SELECT
                    coalesce(sum(population_current),0) as pop_current,
                    sum((population_projection -> 'pop_2023')::numeric)         AS pop_2023,
                    sum((population_projection -> 'pop_2024')::numeric)         AS pop_2024,
                    sum((population_projection -> 'pop_2025')::numeric)         AS pop_2025,
                    sum((population_projection -> 'pop_2026')::numeric)         AS pop_2026,
                    sum((population_projection -> 'pop_2027')::numeric)         AS pop_2027,
                    coalesce(sum(hhd_current),0) as hhd_current,
                    coalesce(sum(white) / sum(m.population_current :: numeric),0) as white,
                    coalesce(sum(carownership_perc :: numeric * hhd_current) / sum(m.hhd_current :: numeric),0) as car_ownership,
                    coalesce(sum(students)/ sum(m.population_current :: numeric),0) as students,
                    coalesce(sum(housetype_houses)/ sum((housetype_houses + housetype_flats + housetype_other):: numeric),0) as housetype_houses,
                    coalesce(sum(housetype_flats) / sum((housetype_houses + housetype_flats + housetype_other):: numeric),0) as housetype_flats,
                    coalesce(sum(dwelling_ownhome) / sum( (dwelling_ownhome + dwelling_socialrented + dwelling_privaterented):: numeric),0) as dwelling_ownhome,
                    coalesce(sum(dwelling_socialrented) / sum( (dwelling_ownhome + dwelling_socialrented + dwelling_privaterented):: numeric),0)as dwelling_socialrented,
                    coalesce(sum(dwelling_privaterented) / sum( (dwelling_ownhome + dwelling_socialrented + dwelling_privaterented ):: numeric),0) as dwelling_privaterented,
                    coalesce(sum(abhrp) / sum((abhrp + c1hrp + c2hrp + dehrp):: numeric ),0) as abhrp,
                    coalesce(sum(c1hrp) / sum( (abhrp + c1hrp + c2hrp + dehrp):: numeric),0) as c1hrp,
                    coalesce(sum(c2hrp) / sum((abhrp + c1hrp + c2hrp + dehrp):: numeric),0) as c2hrp,
                    coalesce( sum(dehrp) / sum((abhrp + c1hrp + c2hrp + dehrp):: numeric),0)as dehrp,
                    coalesce( sum(case when oac_supergroup = 1 then hhd_current else 0 end) / sum(m.hhd_current :: numeric),0 ) as oac_supergroup_1,
                    coalesce( sum(case when oac_supergroup = 2 then hhd_current else 0 end) / sum(m.hhd_current :: numeric),0 ) as oac_supergroup_2,
                    coalesce( sum(case when oac_supergroup = 3 then hhd_current else 0 end) / sum(m.hhd_current :: numeric),0 ) as oac_supergroup_3,
                    coalesce( sum(case when oac_supergroup = 4 then hhd_current else 0 end) / sum(m.hhd_current :: numeric),0 ) as oac_supergroup_4,
                    coalesce( sum(case when oac_supergroup = 5 then hhd_current else 0 end) / sum(m.hhd_current :: numeric),0 ) as oac_supergroup_5,
                    coalesce( sum(case when oac_supergroup = 6 then hhd_current else 0 end) / sum(m.hhd_current :: numeric),0 ) as oac_supergroup_6,
                    coalesce( sum(case when oac_supergroup = 7 then hhd_current else 0 end) / sum(m.hhd_current :: numeric),0 ) as oac_supergroup_7,
                    coalesce( sum(case when oac_supergroup = 8 then hhd_current else 0 end) / sum(m.hhd_current :: numeric),0 ) as oac_supergroup_8,
                    round(sum(age0to17)::numeric / sum(population_current)::numeric, 3) AS age_under_18,
                    round((sum(age18to19)::numeric + sum(age20to24)::numeric) / sum(population_current)::numeric, 3) AS age_18to24,
                    round((sum(age25to29)::numeric + sum(age30to44)::numeric) / sum(population_current)::numeric, 3) AS age_25to44,
                    round(sum(age45to59)::numeric / sum(population_current)::numeric, 3)                           AS age_45to59,
                    round((sum(age60to74)::numeric + sum(age75plus)::numeric) / sum(population_current)::numeric, 3) AS age_60plus
                from geodata.uk_glx_geodata_oa_metrics_2021 m
                    join ${table} s on  st_intersects(s.geom_3857, m.geom_p_3857)
                where
                    s.${id_field} = %{id}) o
            cross join (
                select
                    sum(workers) as workers
                from geodata.uk_glx_geodata_workers_postcode w
                    join ${table} s on  st_intersects(s.geom_3857, w.geom_p_3857)
                where
                    s.${id_field} = %{id}
            ) w
         )site
        ,
        ( SELECT
                    ARRAY [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    round(
                    ethnicity_white /(population_current :: numeric)* 100,
                    1
                    ),
                    round(car_ownership /(population_current :: numeric)*100, 1),
                          round(
                    students /(population_current :: numeric)* 100,
                    1
                    ),
                    round(
                    houses /(
                        (houses + flats + housetype_other):: numeric
                    )* 100,
                    1
                    ),
                    round(
                    flats /(
                        (houses + flats + housetype_other):: numeric
                    )* 100,
                    1
                    ),
                    round(
                    ownhome /(
                        (
                        ownhome + social_rented + private_rented
                        ):: numeric
                    )* 100,
                    1
                    ),
                    round(
                    social_rented /(
                        (
                        ownhome + social_rented + private_rented
                        ):: numeric
                    )* 100,
                    1
                    ),
                    round(
                    private_rented /(
                        (
                        ownhome + social_rented + private_rented
                        ):: numeric
                    )* 100,
                    1
                    ),
                    round(
                    social_grade_ab_uk /(
                        (
                        social_grade_ab_uk + social_grade_c1_uk + social_grade_c2_uk + social_grade_de_uk
                        ):: numeric
                    )* 100,
                    1
                    ),
                    round(
                    social_grade_c1_uk /(
                        (
                        social_grade_ab_uk + social_grade_c1_uk + social_grade_c2_uk + social_grade_de_uk
                        ):: numeric
                    )* 100,
                    1
                    ),
                    round(
                    social_grade_c2_uk /(
                        (
                        social_grade_ab_uk + social_grade_c1_uk + social_grade_c2_uk + social_grade_de_uk
                        ):: numeric
                    )* 100,
                    1
                    ),
                    round(
                    social_grade_de_uk /(
                        (
                        social_grade_ab_uk + social_grade_c1_uk + social_grade_c2_uk + social_grade_de_uk
                        ):: numeric
                    )* 100,
                    1
                    ),
                        round(oac_supergroup_1_perc:: numeric*100,1),
                        round(oac_supergroup_2_perc:: numeric*100,1),
                        round(oac_supergroup_3_perc:: numeric*100,1),
                        round(oac_supergroup_4_perc:: numeric*100,1),
                        round(oac_supergroup_5_perc:: numeric*100,1),
                        round(oac_supergroup_6_perc:: numeric*100,1),
                        round(oac_supergroup_7_perc:: numeric*100,1),
                        round(oac_supergroup_8_perc:: numeric*100,1),
                    round(
                    age_under_18_uk /(population_current :: numeric)* 100,
                    1
                    ),
                    round(
                    age_18to24_uk /(population_current :: numeric)* 100,
                    1
                    ),
                    round(
                    (age_25to29_uk + age_30to44_uk)/(population_current :: numeric)* 100,
                    1
                    ),
                    round(
                    age_45to59_uk /(population_current :: numeric)* 100,
                    1
                    ),
                    round(
                    age_60plus_uk /(population_current :: numeric)* 100,
                    1
                    )
                    ] as national_numbers
                FROM
                    geodata.uk_glx_geodata_demog_national_totals_new t
             ) national_numbers
        )calc