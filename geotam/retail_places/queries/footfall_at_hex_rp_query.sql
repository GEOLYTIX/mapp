select
    f.h3res as id,
    f.glx_ff,
    f.glx_ff_rp,
    unique_dev_0,
    unique_dev_1,
    unique_dev_2,
    unique_dev_3,
    unique_dev_4,
    unique_dev_5,
    unique_dev_6,
    unique_dev_7,
    unique_dev_8,
    unique_dev_9,
    unique_dev_10,
    unique_dev_11,
    unique_dev_12,
    unique_dev_13,
    unique_dev_14,
    unique_dev_15,
    unique_dev_16,
    unique_dev_17,
    unique_dev_18,
    unique_dev_19,
    unique_dev_20,
    unique_dev_21,
    unique_dev_22,
    unique_dev_23,
    unique_dev_weekday,
    unique_dev_weekend
from geodata.uk_glx_mobility_retail_place_2022_huq_jenks f
where rp_id=%{id};