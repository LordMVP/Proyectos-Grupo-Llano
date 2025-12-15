package com.bioagricola.apirest.aprovechamiento.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExportSevenCheckForm {
    private String thirdPartyIds;
    private Integer periodStart;
    private Integer periodEnd;
    private Integer cutId;
    private Boolean exportSeven;
}
