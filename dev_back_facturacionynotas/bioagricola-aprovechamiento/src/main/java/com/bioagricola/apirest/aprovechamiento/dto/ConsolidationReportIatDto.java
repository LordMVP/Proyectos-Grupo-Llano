package com.bioagricola.apirest.aprovechamiento.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ConsolidationReportIatDto {

    private Date liquidationPeriod;
    private String liquidationPeriodString;
    private Double valueCC;
    private Double valueDehabit;
    private Double valueChangeSemester;

    private Double totals;

}
