/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.llanogas.achagua.persistencia.dto;

/**
 *
 * @author hrey
 */
public class InformacionAdicionalDTO {

    private long idInformacionAdicional;
    private String informacion;
    private String estado;
    private String descripcion;
    private FormaPagoRecaudoDTO formaPago;
    private long idFormaPago;
    private int grupoInformacion;
    private long idTipo;
    private long idDetalleTipo;
    private String tipoNombre;

    public long getIdInformacionAdicional() {
        return idInformacionAdicional;
    }

    public void setIdInformacionAdicional(long idInformacionAdicional) {
        this.idInformacionAdicional = idInformacionAdicional;
    }

    public String getInformacion() {
        return informacion;
    }

    public void setInformacion(String informacion) {
        this.informacion = informacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public FormaPagoRecaudoDTO getFormaPago() {
        return formaPago;
    }

    public void setFormaPago(FormaPagoRecaudoDTO formaPago) {
        this.formaPago = formaPago;
    }

    public long getIdFormaPago() {
        return idFormaPago;
    }

    public void setIdFormaPago(long idFormaPago) {
        this.idFormaPago = idFormaPago;
    }

    public int getGrupoInformacion() {
        return grupoInformacion;
    }

    public void setGrupoInformacion(int grupoInformacion) {
        this.grupoInformacion = grupoInformacion;
    }

    public long getIdTipo() {
        return idTipo;
    }

    public void setIdTipo(long idTipo) {
        this.idTipo = idTipo;
    }

    public long getIdDetalleTipo() {
        return idDetalleTipo;
    }

    public void setIdDetalleTipo(long idDetalleTipo) {
        this.idDetalleTipo = idDetalleTipo;
    }

    public String getTipoNombre() {
        return tipoNombre;
    }

    public void setTipoNombre(String tipoNombre) {
        this.tipoNombre = tipoNombre;
    }

}
