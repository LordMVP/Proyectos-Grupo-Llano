package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class SoportePagos
 */
@Entity
@Table(name = "sop_soportepagos", schema = "aseo")
public class SoportePagos {
    @Id
    @SequenceGenerator(name = "sq_sop_ideregistro", sequenceName = "sq_sop_ideregistro", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sq_sop_ideregistro")
    @Column(name = "sop_ideregistro")
    private Integer sopIderegistro;

    @Column(name = "sop_fecha")
    private Date sopFecha;

    @Column(name = "sop_id_oficio")
    private Integer sopIdOficio;

    @Column(name = "sop_oficio_pago")
    private String sopOficioPago;

    @Column(name = "sop_nombre_acta")
    private String sopActa;

    @Column(name = "sop_fecha_giro")
    private Date sopFechaGiro;

    @Column(name = "per_ideregistro")
    private Integer perIdeRegistro;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "sop_fecharegistro")
    private Date sopFechaRegistro;

    @Column(name = "sop_observacion")
    private String sopObservacion;

    @Column(name = "con_idconsolidacion")
    private Integer conIdconsolidacion;

    public Integer getSopIderegistro() {
        return sopIderegistro;
    }

    public void setSopIderegistro(Integer ideSoportepagos) {
        this.sopIderegistro = ideSoportepagos;
    }

    public Date getSopFecha() {
        return sopFecha;
    }

    public void setSopFecha(Date sopFecha) {
        this.sopFecha = sopFecha;
    }

    public Integer getSopIdOficio() {
        return sopIdOficio;
    }

    public void setSopIdOficio(Integer sopIdOficio) {
        this.sopIdOficio = sopIdOficio;
    }

    public String getSopOficioPago() {
        return sopOficioPago;
    }

    public void setSopOficioPago(String sopOficioPago) {
        this.sopOficioPago = sopOficioPago;
    }

    public String getSopActa() {
        return sopActa;
    }

    public void setSopActa(String sopActa) {
        this.sopActa = sopActa;
    }

    public Date getSopFechaGiro() {
        return sopFechaGiro;
    }

    public void setSopFechaGiro(Date sopFechaGiro) {
        this.sopFechaGiro = sopFechaGiro;
    }

    public Integer getPerIdeRegistro() {
        return perIdeRegistro;
    }

    public void setPerIdeRegistro(Integer perIdeRegistro) {
        this.perIdeRegistro = perIdeRegistro;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public Date getSopFechaRegistro() {
        return sopFechaRegistro;
    }

    public void setSopFechaRegistro(Date sopFechaRegistro) {
        this.sopFechaRegistro = sopFechaRegistro;
    }

    public String getSopObservacion() {
        return sopObservacion;
    }

    public void setSopObservacion(String sopObservacion) {
        this.sopObservacion = sopObservacion;
    }

    public Integer getConIdconsolidacion() {
        return conIdconsolidacion;
    }

    public void setConIdconsolidacion(Integer terIderegistro) {
        this.conIdconsolidacion = terIderegistro;
    }
}
