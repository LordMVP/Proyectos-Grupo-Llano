package com.bioagricola.apirest.modelo.entidades;

import com.bioagricola.apirest.modelo.dtos.ImportacionNegEMSADTO;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name = "impnegdet_importacion_negativos_detalle", schema = "aseo",
uniqueConstraints = {@UniqueConstraint(name = "impnegdet_importacion_negativos_detalle_un", columnNames = {"impnegdet_codigo_emsa", "impnegdet_fecha_registro_emsa", "impnegdet_valor_cargado"})})
public class ImportacionNegDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "impnegdet_idregistro", nullable = false)
    private Long id;

    @Column(name = "impnegdet_idsuscripcion")
    private String idSuscripcion;

    @Column(name = "impnegdet_codigo_suscripcion")
    private String codigoSuscripcion;

    @Column(name = "impnegdet_estado_suscripcion")
    private String estadoSuscripcion;

    @Column(name = "impnegdet_estado_cargue")
    private String estadoCargue;

    @Column(name = "impnegdet_nombre")
    private String name;

    @Column(name = "impnegdet_empresa_alterna_actual")
    private String empresaActual;

    @Column(name = "impnegdet_fecha_registro_emsa")
    private Date fechaRegistroEmsa;

    @Column(name = "impnegdet_fecha_importacion")
    private Date fechaImportacion;

    @Column(name = "impnegdet_fecha_aplicacion_nota")
    private Date fechaAplicacionNota;

    @Column(name = "impnegdet_concepto")
    private String concept;

    @Column(name = "impnegdet_extracto")
    private String extract;

    @Column(name = "impnegdet_valor_cargado", nullable = false)
    private Double valorCargado;

    @Column(name = "impnegdet_codigo_emsa", nullable = false)
    private String codigoEmsa;

    @Column(name = "impneg_idregistro")
    private Long idParent;

    @Column(name = "impnegdet_factura_suscripcion")
    private String facturaSuscripcion;

    @Column(name = "impnegdet_per_liquid_factura")
    private String periodoLiquidacion;

    @Column(name = "impnegdet_ciclo_liquid_suscripcion")
    private String cicloLiquidacion;

    @Column(name = "impnegdet_sus_idregistro")
    private Long susIdRegistro;

    @Transient
    private ImportacionNegEMSADTO emsadto;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public ImportacionNegEMSADTO getEmsadto() {
        return emsadto;
    }

    public void setEmsadto(ImportacionNegEMSADTO emsadto) {
        this.emsadto = emsadto;
    }

    public String getFacturaSuscripcion() {
        return facturaSuscripcion;
    }

    public void setFacturaSuscripcion(String facturaSuscripcion) {
        this.facturaSuscripcion = facturaSuscripcion;
    }

    public String getPeriodoLiquidacion() {
        return periodoLiquidacion;
    }

    public void setPeriodoLiquidacion(String periodoLiquidacion) {
        this.periodoLiquidacion = periodoLiquidacion;
    }

    public String getCicloLiquidacion() {
        return cicloLiquidacion;
    }

    public void setCicloLiquidacion(String cicloLiquidacion) {
        this.cicloLiquidacion = cicloLiquidacion;
    }

    public Long getSusIdRegistro() {
        return susIdRegistro;
    }

    public void setSusIdRegistro(Long susIdRegistro) {
        this.susIdRegistro = susIdRegistro;
    }
}
