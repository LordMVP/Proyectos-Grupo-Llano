package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

/**
 * @author jmosquera
 * @project dev_back_aprovechamiento
 * @class DetailCollectionPunishedUseDto
 */
@Data
public class DetailCollectionPunishedUseDto {
    private String invoiceId;
    private String fac_numero;
    private Date expeditionDate;
    private Date castigoDate;
    private BigDecimal value;
    private int age;
    private BigDecimal totalPercent;
    private BigDecimal percentCC;
    private BigDecimal percentTA;
    private BigDecimal percentIAT;
    private BigDecimal percentAdjustCC;
    private BigDecimal percentAdjustTA;
    private BigDecimal percentAdjustIAT;
    private BigDecimal paidCC;
    private BigDecimal paidTA;
    private BigDecimal paidIAT;
    private BigDecimal adjustPaidCC;
    private BigDecimal adjustPaidTA;
    private BigDecimal adjustPaidIAT;
}
