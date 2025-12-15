package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class SearchCriteriaReportDto
 */

@Data
public class SearchCriteriaReportDto {
    private String use;
    private Integer quantityFcr;
    private BigDecimal penalizedValueCC;
    private BigDecimal penalizedValueTA;    
    private BigDecimal penalizedValueIAT;
    private BigDecimal penalizedValueAdjustTA;
    private BigDecimal penalizedValueAdjustCC;
    private BigDecimal penalizedValueAdjustIAT;
    private BigDecimal penalizedValueUse;
    private List<DetailCollectionPunishedUseDto> detail;

}
