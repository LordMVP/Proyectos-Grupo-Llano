package com.bioagricola.apirest.aprovechamiento.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class DetailCollectionUserThirdPartyDto
 */
@Getter
@Setter
public class DetailCollectionUserThirdPartyDto { // Detalle Recaudo Aprovechador Tercero
    private String thirdPartyId;
    private String thirdPartyName;
    private String benefitPeriod;
    private String liquidationPeriod;
    private BigDecimal paidCC;
    private BigDecimal paidTA;
    private BigDecimal valueChangeTA;
    private BigDecimal valuesChangePaid;
    private BigDecimal adjustPaidCC;
    private BigDecimal adjustPaidTA;
    private BigDecimal dinc;
    private BigDecimal valueCollectedFinanced;
    private BigDecimal interestAndCommonValue;
    private BigDecimal interestValue;
    private BigDecimal commonValue;
    private Integer measured;
    private BigDecimal totalPaid;
    private Map<String, BigDecimal> totalCollectionYear;
    private Map<String, BigDecimal> totalBoxedWallet;
    private Map<String, BigDecimal> totalCollectionMonth;
    private Map<String, BigDecimal> totalCollectionAll;

}
