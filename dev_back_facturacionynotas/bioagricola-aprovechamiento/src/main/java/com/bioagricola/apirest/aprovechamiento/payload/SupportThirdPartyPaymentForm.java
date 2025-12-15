package com.bioagricola.apirest.aprovechamiento.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SupportThirdPartyPaymentForm {
    private Integer maprcIderegistr; //idConsolidation
    private String idThirdParty; //idThirdParty
    private Integer perFacturacion; //billingPeriod
    private String observations; //observations
    private Date sopFechaGiro; //datePayment
    private String sopIdActa; //idDocument
    private Date sopFechaComite;
}
