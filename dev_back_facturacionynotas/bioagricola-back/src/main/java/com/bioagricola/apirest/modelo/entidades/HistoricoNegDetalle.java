package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name = "histnegdet_historico_negativos_detalle", schema = "aseo")
public class HistoricoNegDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "histnegdet_idregistro", nullable = false)
    private Long id;

    @Column(name = "histnegdet_idsuscripcion")
    private String idSuscripcion;

    @Column(name = "histnegdet_codigo_suscripcion")
    private String codigoSuscripcion;

    @Column(name = "histnegdet_estado_suscripcion")
    private String estadoSuscripcion;

    @Column(name = "histnegdet_estado_cargue")
    private String estadoCargue;

    @Column(name = "histnegdet_nombre")
    private String nombre;

    @Column(name = "histnegdet_empresa_alterna_actual")
    private String empresaActual;

    @Column(name = "histnegdet_fecha_registro_emsa")
    private Date fechaRegistroEmsa;

    @Column(name = "histnegdet_fecha_importacion")
    private Date fechaImportacion;

    @Column(name = "histnegdet_fecha_aplicacion_nota")
    private Date fechaAplicacionNota;

    @Column(name = "histnegdet_concepto")
    private String concept;

    @Column(name = "histnegdet_extracto")
    private String extract;

    @Column(name = "histnegdet_valor_cargado", nullable = false)
    private Double valorCargado;

    @Column(name = "histnegdet_codigo_emsa", nullable = false)
    private String codigoEmsa;

    @Column(name = "histneg_idregistro")
    private Long idParent;

    @Column(name = "histnegdet_fecha_auditoria", nullable = false)
    private Date auditDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getIdParent() {
        return idParent;
    }

    public void setIdParent(Long idParent) {
        this.idParent = idParent;
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

    public Date getAuditDate() {
        return auditDate;
    }

    public void setAuditDate(Date auditDate) {
        this.auditDate = auditDate;
    }
}
