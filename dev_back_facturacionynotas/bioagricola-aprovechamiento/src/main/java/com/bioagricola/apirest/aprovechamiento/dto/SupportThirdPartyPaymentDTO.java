package com.bioagricola.apirest.aprovechamiento.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportThirdPartyPaymentDTO {
    private String supportDate;
    private Integer supportId;
    private String letterName;
    private String supportPaid;
    private String observation;
    private String supportDateCommittee;
}
