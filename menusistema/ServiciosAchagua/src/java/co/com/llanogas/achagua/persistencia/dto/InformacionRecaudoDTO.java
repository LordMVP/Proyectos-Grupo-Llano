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
public class InformacionRecaudoDTO {

    private long idMedioPago;
    private long idClasePago;
    private long idSuscripcion;
    private long idFormaPago;
    private String entidadRecaudadora;
    private String numeroNota;
    private String numeroConsignacion;
    private String numeroCuentaEmpresa;
    private double valorConsignado;
    private String fechaPago;
    private long idTipoDocumento;
    private long idRecaudoEntidad;

    public InformacionRecaudoDTO() {
    }

    public InformacionRecaudoDTO(long idRecaudoEntidad) {
        this.idRecaudoEntidad = idRecaudoEntidad;
    }

    public InformacionRecaudoDTO(long idMedioPago, long idClasePago, long idSuscripcion, long idFormaPago, String entidadRecaudadora, String numeroNota, String numeroConsignacion, String numeroCuentaEmpresa, double valorConsignado, String fechaPago, long idTipoDocumento, long idRecaudoEntidad) {
        this.idMedioPago = idMedioPago;
        this.idClasePago = idClasePago;
        this.idSuscripcion = idSuscripcion;
        this.idFormaPago = idFormaPago;
        this.entidadRecaudadora = entidadRecaudadora;
        this.numeroNota = numeroNota;
        this.numeroConsignacion = numeroConsignacion;
        this.numeroCuentaEmpresa = numeroCuentaEmpresa;
        this.valorConsignado = valorConsignado;
        this.fechaPago = fechaPago;
        this.idTipoDocumento = idTipoDocumento;
        this.idRecaudoEntidad = idRecaudoEntidad;
    }

    public long getIdMedioPago() {
        return idMedioPago;
    }

    public void setIdMedioPago(long idMedioPago) {
        this.idMedioPago = idMedioPago;
    }

    public long getIdClasePago() {
        return idClasePago;
    }

    public void setIdClasePago(long idClasePago) {
        this.idClasePago = idClasePago;
    }

    public long getIdSuscripcion() {
        return idSuscripcion;
    }

    public void setIdSuscripcion(long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    public long getIdFormaPago() {
        return idFormaPago;
    }

    public void setIdFormaPago(long idFormaPago) {
        this.idFormaPago = idFormaPago;
    }

    public String getEntidadRecaudadora() {
        return entidadRecaudadora;
    }

    public void setEntidadRecaudadora(String entidadRecaudadora) {
        this.entidadRecaudadora = entidadRecaudadora;
    }

    public String getNumeroNota() {
        return numeroNota;
    }

    public void setNumeroNota(String numeroNota) {
        this.numeroNota = numeroNota;
    }

    public String getNumeroConsignacion() {
        return numeroConsignacion;
    }

    public void setNumeroConsignacion(String numeroConsignacion) {
        this.numeroConsignacion = numeroConsignacion;
    }

    public String getNumeroCuentaEmpresa() {
        return numeroCuentaEmpresa;
    }

    public void setNumeroCuentaEmpresa(String numeroCuentaEmpresa) {
        this.numeroCuentaEmpresa = numeroCuentaEmpresa;
    }

    public double getValorConsignado() {
        return valorConsignado;
    }

    public void setValorConsignado(double valorConsignado) {
        this.valorConsignado = valorConsignado;
    }

    public String getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(String fechaPago) {
        this.fechaPago = fechaPago;
    }

    public long getIdTipoDocumento() {
        return idTipoDocumento;
    }

    public void setIdTipoDocumento(long idTipoDocumento) {
        this.idTipoDocumento = idTipoDocumento;
    }

    public long getIdRecaudoEntidad() {
        return idRecaudoEntidad;
    }

    public void setIdRecaudoEntidad(long idRecaudoEntidad) {
        this.idRecaudoEntidad = idRecaudoEntidad;
    }

}
