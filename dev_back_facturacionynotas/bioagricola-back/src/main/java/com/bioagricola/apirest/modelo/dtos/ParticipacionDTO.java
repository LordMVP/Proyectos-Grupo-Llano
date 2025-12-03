package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;

public class ParticipacionDTO implements Serializable {
    private Long uniConcepto;
    private BigDecimal valorParticipacion;
    private Long idFact;
    private Integer idTercero;

    public Long getUniConcepto() {
        return uniConcepto;
    }

    public void setUniConcepto(Long uniConcepto) {
        this.uniConcepto = uniConcepto;
    }


    public Long getIdFact() {
        return idFact;
    }

    public void setIdFact(Long idFact) {
        this.idFact = idFact;
    }

    public BigDecimal getValorParticipacion() {
        return valorParticipacion;
    }

    public void setValorParticipacion(BigDecimal valorParticipacion) {
        this.valorParticipacion = valorParticipacion;
    }

    public Integer getIdTercero() {
        return idTercero;
    }

    public void setIdTercero(Integer idTercero) {
        this.idTercero = idTercero;
    }
}
