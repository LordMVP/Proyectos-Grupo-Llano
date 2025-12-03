package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_facturacionynotas
 * @class ParLabParametrosLabels
 */
@Entity
@Table(name = "parlabparametroslabels", schema = "aseo")
public class ParLabParametrosLabels implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "parlab_ideregistro")
    private Long parLabIdeRegistro;

    @Column(name = "parlab_descripcion")
    private String parLabDescripcion;

    @Column(name = "parlab_label")
    private String parLabLabel;

    @Column(name = "parlab_operacion")
    private String parLabOperacion;

    @Column(name = "emp_ideregistro")
    private Integer empIdeRegistro;

    @Column(name = "usu_ideregistro")
    private Long usuIdeRegistro;

    @Column(name = "parlab_fechaedicion")
    private Date parLabFechaEdicion;

    @Column(name = "parlab_atributovalor")
    private String parLabAtributoValor;

    @Column(name = "parlab_estado")
    private String parLabEstado;

    @Column(name = "parlab_compuesto")
    private boolean parLabCompuesto;

    @Column(name = "est_ideregistro")
    private Long estIdeRegistro;

    public Long getParLabIdeRegistro() {
        return parLabIdeRegistro;
    }

    public void setParLabIdeRegistro(Long parLabIdeRegistro) {
        this.parLabIdeRegistro = parLabIdeRegistro;
    }

    public String getParLabDescripcion() {
        return parLabDescripcion;
    }

    public void setParLabDescripcion(String parLabDescripcion) {
        this.parLabDescripcion = parLabDescripcion;
    }

    public String getParLabLabel() {
        return parLabLabel;
    }

    public void setParLabLabel(String parLabLabel) {
        this.parLabLabel = parLabLabel;
    }

    public String getParLabOperacion() {
        return parLabOperacion;
    }

    public void setParLabOperacion(String parLabOperacion) {
        this.parLabOperacion = parLabOperacion;
    }

    public Integer getEmpIdeRegistro() {
        return empIdeRegistro;
    }

    public void setEmpIdeRegistro(Integer empIdeRegistro) {
        this.empIdeRegistro = empIdeRegistro;
    }

    public Long getUsuIdeRegistro() {
        return usuIdeRegistro;
    }

    public void setUsuIdeRegistro(Long usuIdeRegistro) {
        this.usuIdeRegistro = usuIdeRegistro;
    }

    public Date getParLabFechaEdicion() {
        return parLabFechaEdicion;
    }

    public void setParLabFechaEdicion(Date parLabFechaEdicion) {
        this.parLabFechaEdicion = parLabFechaEdicion;
    }

    public String getParLabAtributoValor() {
        return parLabAtributoValor;
    }

    public void setParLabAtributoValor(String parLabAtributoValor) {
        this.parLabAtributoValor = parLabAtributoValor;
    }

    public String getParLabEstado() {
        return parLabEstado;
    }

    public void setParLabEstado(String parLabEstado) {
        this.parLabEstado = parLabEstado;
    }

    public boolean isParLabCompuesto() {
        return parLabCompuesto;
    }

    public void setParLabCompuesto(boolean parLabCompuesto) {
        this.parLabCompuesto = parLabCompuesto;
    }

    public Long getEstIdeRegistro() {
        return estIdeRegistro;
    }

    public void setEstIdeRegistro(Long estIdeRegistro) {
        this.estIdeRegistro = estIdeRegistro;
    }
}
