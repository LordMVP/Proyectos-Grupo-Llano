package com.bioagricola.apirest.aprovechamiento.payload;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
public class SupportThirdPartyPaymentsForm {
    private Integer supportId;
    private Date turnDate;
    private Integer actId;
    private String observations;
    private String idThirdParty;
    private Date dateCommittee;
}
