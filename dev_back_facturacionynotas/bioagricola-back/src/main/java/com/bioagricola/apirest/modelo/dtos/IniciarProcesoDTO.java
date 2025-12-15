package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Date;

public class IniciarProcesoDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private Integer idProceso;
    private Integer idPeriodo;
    private Integer anoCiclo;
    private Integer idCiclo;
    private Date fechaCorteFacturacion;
    private Date fechaLimiteProcesamiento;
    private Integer programa;
    private String tipoAprovechamiento;
    
    private Integer idEmpresa;
    private Integer idUsuario;
    
    public Integer getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(Integer idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    public Date getFechaCorteFacturacion() {
		return fechaCorteFacturacion;
	}

	public void setFechaCorteFacturacion(Date fechaCorteFacturacion) {
		this.fechaCorteFacturacion = fechaCorteFacturacion;
	}

    public Date getFechaLimiteProcesamiento() {
        return fechaLimiteProcesamiento;
    }

    public void setFechaLimiteProcesamiento(Date fechaLimiteProcesamiento) {
        this.fechaLimiteProcesamiento = fechaLimiteProcesamiento;
    }

    public Integer getPrograma() {
        return programa;
    }

    public void setPrograma(Integer programa) {
        this.programa = programa;
    }

    public Integer getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(Integer idCiclo) {
        this.idCiclo = idCiclo;
    }

    public Integer getAnoCiclo() {
        return anoCiclo;
    }

    public void setAnoCiclo(Integer anoCiclo) {
        this.anoCiclo = anoCiclo;
    }

    public String getTipoAprovechamiento() {
        return tipoAprovechamiento;
    }

    public void setTipoAprovechamiento(String tipoAprovechamiento) {
        this.tipoAprovechamiento = tipoAprovechamiento;
    }

    public Integer getIdProceso() {
        return idProceso;
    }

    public void setIdProceso(Integer idProceso) {
        this.idProceso = idProceso;
    }
    
    public Integer getIdEmpresa() {
        return this.idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }
    
    public Integer getIdUsuario() {
        return this.idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
}
