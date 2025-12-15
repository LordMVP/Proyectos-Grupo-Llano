package com.bioagricola.apirest.modelo.dtos;


import com.fasterxml.jackson.annotation.JsonProperty;

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.sql.Timestamp;

/**
 * DAO que contiene la información de la entidad DhvtcDetallehomvartarconceptosDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 *
 * @author GeneradorCRUD
 */

@XmlRootElement
public class DhvtcDetallehomvartarconceptosDTO implements Serializable{

    private Long dhvtcIderegistr;

    private Long hvtconIderegistr;

    private Integer conRangoinicio;

    private Integer conRangofin;

    private Long uniConceptoVartar;

    private Integer dhvtcValorDefault;

    private Integer dhvtcValorreferencia;

    private String dhvtcEstado;

    private Integer usuIderegistro;

    private Timestamp dhvtcFecharegistro;

    // protected region atributos adicionales on begin
    // Escriba en esta sección sus modificaciones

    // protected region atributos adicionales end

    public DhvtcDetallehomvartarconceptosDTO() {
    }

    public Long getDhvtcIderegistr() {
        return dhvtcIderegistr;
    }

    public void setDhvtcIderegistr(Long dhvtcIderegistr) {
        this.dhvtcIderegistr = dhvtcIderegistr;
    }

    public Long getHvtconIderegistr() {
        return hvtconIderegistr;
    }

    public void setHvtconIderegistr(Long hvtconIderegistr) {
        this.hvtconIderegistr = hvtconIderegistr;
    }

    public Integer getConRangoinicio() {
        return conRangoinicio;
    }

    public void setConRangoinicio(Integer conRangoinicio) {
        this.conRangoinicio = conRangoinicio;
    }

    public Integer getConRangofin() {
        return conRangofin;
    }

    public void setConRangofin(Integer conRangofin) {
        this.conRangofin = conRangofin;
    }

    public Long getUniConceptoVartar() {
        return uniConceptoVartar;
    }

    public void setUniConceptoVartar(Long uniConceptoVartar) {
        this.uniConceptoVartar = uniConceptoVartar;
    }

    public Integer getDhvtcValorDefault() {
        return dhvtcValorDefault;
    }

    public void setDhvtcValorDefault(Integer dhvtcValorDefault) {
        this.dhvtcValorDefault = dhvtcValorDefault;
    }

    public Integer getDhvtcValorreferencia() {
        return dhvtcValorreferencia;
    }

    public void setDhvtcValorreferencia(Integer dhvtcValorreferencia) {
        this.dhvtcValorreferencia = dhvtcValorreferencia;
    }

    public String getDhvtcEstado() {
        return dhvtcEstado;
    }

    public void setDhvtcEstado(String dhvtcEstado) {
        this.dhvtcEstado = dhvtcEstado;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public Timestamp getDhvtcFecharegistro() {
        return dhvtcFecharegistro;
    }

    public void setDhvtcFecharegistro(Timestamp dhvtcFecharegistro) {
        this.dhvtcFecharegistro = dhvtcFecharegistro;
    }

    // protected region metodos adicionales on begin
    // Escriba en esta sección sus modificaciones

    // protected region metodos adicionales end
}
