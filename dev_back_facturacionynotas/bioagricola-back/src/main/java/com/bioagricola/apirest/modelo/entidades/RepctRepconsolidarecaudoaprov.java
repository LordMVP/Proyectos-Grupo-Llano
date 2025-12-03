package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class RepctRepconsolidarecaudoaprov
 */
@Entity
@Table(name = "repct_repconsolidarecaudoaprov", schema = "aseo")
public class RepctRepconsolidarecaudoaprov {
    @Id
    @SequenceGenerator(name = "aseo.sq_repct_repconsolidarecaudoaprov", sequenceName = "aseo.sq_repct_repconsolidarecaudoaprov", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aseo.sq_repct_repconsolidarecaudoaprov")
    @Column(name = "repct_ide_registro")
    private Integer ideRegistro;

    @Column(name = "repct_nit")
    private String nit;

    @Column(name = "repct_aprovechador")
    private String aprovechador;

    @Column(name = "repct_valor_pago")
    private BigDecimal valorPago;

    @Column(name = "repct_cuenta_bancaria")
    private String cuentaBancaria;

    @Column(name = "repct_exportar_seven")
    private Integer exportarSeven;

    @Column(name = "repct_estado_seven")
    private String estadoSeven;

    @Column(name = "repct_oficio_pago")
    private Integer oficioPago;

    @Column(name = "con_ideconsolidacion")
    private Integer conIdeconsolidacion;

    @Column(name = "ter_ideregistro")
    private Long terIderegistro;

    @Column(name = "repct_fecha_acta")
    private Date repctFechaActa;

    @Column(name = "repct_acta")
    private String repctActa;

    @Column(name = "repct_fecha_giro")
    private Date repctFechaGiro;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "repct_fecha_registro")
    private Date repctFechaRegistro;

    @Column(name = "repct_observacion")
    private String repctObservacion;

    @Column(name = "emp_ideregistro")
    private Integer empIderegistro;

    @Column(name = "per_ideregistro")
    private Integer perIderegistro;

    public Integer getIdeRegistro() {
        return ideRegistro;
    }

    public void setIdeRegistro(Integer ideRegistro) {
        this.ideRegistro = ideRegistro;
    }

    public String getNit() {
        return nit;
    }

    public void setNit(String nit) {
        this.nit = nit;
    }

    public String getAprovechador() {
        return aprovechador;
    }

    public void setAprovechador(String aprovechador) {
        this.aprovechador = aprovechador;
    }

    public BigDecimal getValorPago() {
        return valorPago;
    }

    public void setValorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
    }

    public String getCuentaBancaria() {
        return cuentaBancaria;
    }

    public void setCuentaBancaria(String cuentaBancaria) {
        this.cuentaBancaria = cuentaBancaria;
    }

    public Integer getExportarSeven() {
        return exportarSeven;
    }

    public void setExportarSeven(Integer exportarSeven) {
        this.exportarSeven = exportarSeven;
    }

    public String getEstadoSeven() {
        return estadoSeven;
    }

    public void setEstadoSeven(String estadoSeven) {
        this.estadoSeven = estadoSeven;
    }

    public Integer getOficioPago() {
        return oficioPago;
    }

    public void setOficioPago(Integer oficioPago) {
        this.oficioPago = oficioPago;
    }

    public Integer getConIdeconsolidacion() {
        return conIdeconsolidacion;
    }

    public void setConIdeconsolidacion(Integer conIdeconsolidacion) {
        this.conIdeconsolidacion = conIdeconsolidacion;
    }

    public Long getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(Long terIderegistro) {
        this.terIderegistro = terIderegistro;
    }

    public Date getRepctFechaActa() {
        return repctFechaActa;
    }

    public void setRepctFechaActa(Date repctFechaActa) {
        this.repctFechaActa = repctFechaActa;
    }

    public String getRepctActa() {
        return repctActa;
    }

    public void setRepctActa(String repctActa) {
        this.repctActa = repctActa;
    }

    public Date getRepctFechaGiro() {
        return repctFechaGiro;
    }

    public void setRepctFechaGiro(Date repctFechaGiro) {
        this.repctFechaGiro = repctFechaGiro;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public Date getRepctFechaRegistro() {
        return repctFechaRegistro;
    }

    public void setRepctFechaRegistro(Date repctFechaRegistro) {
        this.repctFechaRegistro = repctFechaRegistro;
    }

    public String getRepctObservacion() {
        return repctObservacion;
    }

    public void setRepctObservacion(String repctObservacion) {
        this.repctObservacion = repctObservacion;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }

    public Integer getPerIderegistro() {
        return perIderegistro;
    }

    public void setPerIderegistro(Integer perIderegistro) {
        this.perIderegistro = perIderegistro;
    }
}
