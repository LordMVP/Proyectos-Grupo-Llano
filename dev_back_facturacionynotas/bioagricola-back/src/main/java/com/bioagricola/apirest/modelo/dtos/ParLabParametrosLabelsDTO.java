package com.bioagricola.apirest.modelo.dtos;

import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_facturacionynotas
 * @class ParLabParametrosLabelsDTO
 */
public class ParLabParametrosLabelsDTO {
    private Long parLabIdeRegistro;
    private String parLabDescripcion;
    private String parLabLabel;
    private String parLabOperacion;
    private Integer empIdeRegistro;
    private Long usuIdeRegistro;
    private Date parLabFechaEdicion;
    private String parLabAtributoValor;
    private String parLabEstado;

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
}
