package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.List;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class CollectionReportForm
 */
public class CollectionReportForm {
    private List<PeriodoFacturacionPrestacionForm> periodos;
    private String period;
    private List<Long> terId;

    public List<PeriodoFacturacionPrestacionForm> getPeriodos() {
        return periodos;
    }

    public void setPeriodos(List<PeriodoFacturacionPrestacionForm> periodos) {
        this.periodos = periodos;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public List<Long> getTerId() {
        return terId;
    }

    public void setTerId(List<Long> terId) {
        this.terId = terId;
    }
}
