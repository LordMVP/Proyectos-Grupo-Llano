package com.bioagricola.apirest.aprovechamiento.payload;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class BalanceReportForm
 */

@Getter
@Setter
public class AprDetailBalanceReportForm {
    private Long idTercero;
    private int period;

    private String cutDate;
    
    public AprDetailBalanceReportForm (){}

    public AprDetailBalanceReportForm(Long idTercero, int period) {
        this.idTercero = idTercero;
        this.period = period;
    }

}
