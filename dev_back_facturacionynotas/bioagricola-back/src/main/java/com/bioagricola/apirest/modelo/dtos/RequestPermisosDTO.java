package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

public class RequestPermisosDTO implements Serializable {

   private Integer idEmpresaSesion;
   private Integer idPrograma;
   private Integer idusuariosesion;
   private Integer unidadedicionparametrizacionconcepto;

    public Integer getIdEmpresaSesion() {
        return idEmpresaSesion;
    }

    public void setIdEmpresaSesion(Integer idEmpresaSesion) {
        this.idEmpresaSesion = idEmpresaSesion;
    }

    public Integer getIdPrograma() {
        return idPrograma;
    }

    public void setIdPrograma(Integer idPrograma) {
        this.idPrograma = idPrograma;
    }

    public Integer getIdusuariosesion() {
        return idusuariosesion;
    }

    public void setIdusuariosesion(Integer idusuariosesion) {
        this.idusuariosesion = idusuariosesion;
    }

    public Integer getUnidadedicionparametrizacionconcepto() {
        return unidadedicionparametrizacionconcepto;
    }

    public void setUnidadedicionparametrizacionconcepto(Integer unidadedicionparametrizacionconcepto) {
        this.unidadedicionparametrizacionconcepto = unidadedicionparametrizacionconcepto;
    }
}
