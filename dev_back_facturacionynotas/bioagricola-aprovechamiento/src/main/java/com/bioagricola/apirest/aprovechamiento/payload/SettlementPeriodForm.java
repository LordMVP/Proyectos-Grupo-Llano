package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.Date;
import lombok.Data;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class PeriodoLiquidacionForm
 */
@Data
public class SettlementPeriodForm {
    Date start;
    Date end;
    
    String inicio;
    String fin;
}
