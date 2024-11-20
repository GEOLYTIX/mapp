SELECT ARRAY [JSON_BUILD_OBJECT('data',
                                ARRAY [
                                    round(white_perc::numeric*100,0), 
                                    round(mixedeth_perc::numeric*100,0), 
                                    round(indian_perc::numeric*100,0), 
                                    round(bangladesh_perc::numeric*100,0), 
                                    round(pakistani_perc::numeric*100,0), 
                                    round(chinese_perc::numeric*100,0), 
                                    round(otherasian_perc::numeric*100,0), 
                                    round(blcarib_perc::numeric*100,0), 
                                    round(blafrican_perc::numeric*100,0), 
                                    round(blother_perc::numeric*100,0), 
                                    round(othereth_perc::numeric*100,0)
                                    ])] AS datasets
FROM ${table}
WHERE id = %{id};