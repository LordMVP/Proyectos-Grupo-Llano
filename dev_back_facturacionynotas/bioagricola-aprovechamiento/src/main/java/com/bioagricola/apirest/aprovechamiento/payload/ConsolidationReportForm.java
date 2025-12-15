package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.Date;
import java.util.List;

public class ConsolidationReportForm {
    private String periodoliqInicial;
    private String periodoliqFinal;
    private List<Long> terIderegistro;

    public String getPeriodoliqInicial() {
        return periodoliqInicial;
    }

    public void setPeriodoliqInicial(String periodoliqInicial) {
        this.periodoliqInicial = periodoliqInicial;
    }

    public String  getPeriodoliqFinal() {
        return periodoliqFinal;
    }

    public void setPeriodoliqFinal(String periodoliqFinal) {
        this.periodoliqFinal = periodoliqFinal;
    }

    public List<Long> getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(List<Long> terIderegistro) {
        this.terIderegistro = terIderegistro;
    }
}
