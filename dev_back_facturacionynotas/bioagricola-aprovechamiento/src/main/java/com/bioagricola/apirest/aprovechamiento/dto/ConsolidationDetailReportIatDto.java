package com.bioagricola.apirest.aprovechamiento.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
public class ConsolidationDetailReportIatDto {

    private Date liquidationPeriod;
    private String liquidationPeriodString;
    private String typeUse;
    private String stratumOrUse;
    private Integer numberUsers;

    private Integer numberUsersDehabit;
    private Double valueIncentiveUse;
    private Double valueIncentiveDehabit;
    private Double tons;
    private Double billedCurrentIat;
    private Double billedDehabitIat;
    private Double adjustmentChangeSemester;
    private Double totalBilled;

}
