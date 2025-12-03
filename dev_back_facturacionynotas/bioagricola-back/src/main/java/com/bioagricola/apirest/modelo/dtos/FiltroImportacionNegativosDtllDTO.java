package com.bioagricola.apirest.modelo.dtos;

import com.bioagricola.apirest.modelo.jsonserializer.JsonDateDeserializer;
import com.bioagricola.apirest.modelo.jsonserializer.JsonDateSerializer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.Date;

public class FiltroImportacionNegativosDtllDTO {
    private String idSuscripcion;
    private String codigoSuscripcion;
    private String estadoSuscripcion;
    private String estadoCargue;
    private String nombre;
    private String empresaActual;
    @JsonDeserialize(using = JsonDateDeserializer.class)
    @JsonSerialize(using = JsonDateSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fechaRegistroEmsa;
    @JsonDeserialize(using = JsonDateDeserializer.class)
    @JsonSerialize(using = JsonDateSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fechaImportacion;
    @JsonDeserialize(using = JsonDateDeserializer.class)
    @JsonSerialize(using = JsonDateSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fechaAplicacionNota;
    private String concept;
    private String extract;
    private Double valorCargado;
    private String codigoEmsa;

    public String getIdSuscripcion() {
        return idSuscripcion;
    }

    public void setIdSuscripcion(String idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    public String getCodigoSuscripcion() {
        return codigoSuscripcion;
    }

    public void setCodigoSuscripcion(String codigoSuscripcion) {
        this.codigoSuscripcion = codigoSuscripcion;
    }

    public String getEstadoSuscripcion() {
        return estadoSuscripcion;
    }

    public void setEstadoSuscripcion(String estadoSuscripcion) {
        this.estadoSuscripcion = estadoSuscripcion;
    }

    public String getEstadoCargue() {
        return estadoCargue;
    }

    public void setEstadoCargue(String estadoCargue) {
        this.estadoCargue = estadoCargue;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmpresaActual() {
        return empresaActual;
    }

    public void setEmpresaActual(String empresaActual) {
        this.empresaActual = empresaActual;
    }

    public Date getFechaRegistroEmsa() {
        return fechaRegistroEmsa;
    }

    public void setFechaRegistroEmsa(Date fechaRegistroEmsa) {
        this.fechaRegistroEmsa = fechaRegistroEmsa;
    }

    public Date getFechaImportacion() {
        return fechaImportacion;
    }

    public void setFechaImportacion(Date fechaImportacion) {
        this.fechaImportacion = fechaImportacion;
    }

    public Date getFechaAplicacionNota() {
        return fechaAplicacionNota;
    }

    public void setFechaAplicacionNota(Date fechaAplicacionNota) {
        this.fechaAplicacionNota = fechaAplicacionNota;
    }

    public String getConcept() {
        return concept;
    }

    public void setConcept(String concept) {
        this.concept = concept;
    }

    public String getExtract() {
        return extract;
    }

    public void setExtract(String extract) {
        this.extract = extract;
    }

    public Double getValorCargado() {
        return valorCargado;
    }

    public void setValorCargado(Double valorCargado) {
        this.valorCargado = valorCargado;
    }

    public String getCodigoEmsa() {
        return codigoEmsa;
    }

    public void setCodigoEmsa(String codigoEmsa) {
        this.codigoEmsa = codigoEmsa;
    }
}
