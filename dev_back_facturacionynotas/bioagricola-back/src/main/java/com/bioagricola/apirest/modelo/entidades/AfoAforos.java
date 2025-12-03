package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="afo_aforos", schema="aseo")
public class AfoAforos implements Serializable {

    @Id
    @Column(name = "afo_ideregistro")
    private Long afoIderegistro;

    @Column(name = "uni_tipoaforo")
    private Integer uniTipoaforo;

    @Column(name = "afo_fecha")
    private Date afoFecha;

    @Column(name = "afo_fechainicio")
    private Date afoFechainicio;

    @Column(name = "afo_fechafinvegencia")
    private Date afoFechafinvegencia;

    @Column(name = "ter_aforador")
    private Long terAforador;


    public Long getAfoIderegistro() {
        return afoIderegistro;
    }

    public void setAfoIderegistro(Long afoIderegistro) {
        this.afoIderegistro = afoIderegistro;
    }

    public Integer getUniTipoaforo() {
        return uniTipoaforo;
    }

    public void setUniTipoaforo(Integer uniTipoaforo) {
        this.uniTipoaforo = uniTipoaforo;
    }

    public Date getAfoFecha() {
        return afoFecha;
    }

    public void setAfoFecha(Date afoFecha) {
        this.afoFecha = afoFecha;
    }

    public Date getAfoFechainicio() {
        return afoFechainicio;
    }

    public void setAfoFechainicio(Date afoFechainicio) {
        this.afoFechainicio = afoFechainicio;
    }

    public Date getAfoFechafinvegencia() {
        return afoFechafinvegencia;
    }

    public void setAfoFechafinvegencia(Date afoFechafinvegencia) {
        this.afoFechafinvegencia = afoFechafinvegencia;
    }

    public Long getTerAforador() {
        return terAforador;
    }

    public void setTerAforador(Long teraforador) {
        this.terAforador = teraforador;
    }
}
