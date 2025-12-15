package com.bioagricola.apirest.aprovechamiento.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.BigInteger;


@Getter
@Setter
public class ThirdPartyCollectionDto { // Recaudo Aprovechador Tercero
    private String nit;
    private String use;
    private BigDecimal valuePaid;
    private String account;
    private String stateSeven;
    private Integer exportSeven;
    private Integer paidLetter;
    private BigInteger idConsolidation;
    private Long idThirdParty; // id Tercero

    private int period;

}
