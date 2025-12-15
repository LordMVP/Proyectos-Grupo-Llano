package com.bioagricola.apirest.aprovechamiento.payload;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class CollectionDetailUse
 */
@Getter
@Setter
public class CollectionDetailUse {
    private String idThirdParty;
    private List<SettlementPeriodForm> settlementPeriod;
    private String idPeriod;
}
