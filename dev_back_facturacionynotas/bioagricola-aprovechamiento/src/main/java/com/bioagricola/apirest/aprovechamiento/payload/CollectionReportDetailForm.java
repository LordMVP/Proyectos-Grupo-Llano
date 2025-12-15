package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.List;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class CollectionReportForm
 */
public class CollectionReportDetailForm {
    private List<PeriodoFacturacionPrestacionForm> periodos;
    private String period;
    private Long terId;

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

    public Long getTerId() {
        return terId;
    }

    public void setTerId(Long terId) {
        this.terId = terId;
    }
}
