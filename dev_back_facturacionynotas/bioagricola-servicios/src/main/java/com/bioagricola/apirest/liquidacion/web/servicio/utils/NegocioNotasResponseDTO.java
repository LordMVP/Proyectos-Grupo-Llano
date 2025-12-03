package com.bioagricola.apirest.liquidacion.web.servicio.utils;

import com.bioagricola.apirest.modelo.entidades.ImportacionNegTemp;

import java.util.List;

public class NegocioNotasResponseDTO {
    private Integer code;
    private String msg;
    private List<ImportacionNegTemp> detail;

    public NegocioNotasResponseDTO() {
    }

    public NegocioNotasResponseDTO(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public NegocioNotasResponseDTO(Integer code, String msg, List<ImportacionNegTemp> detail) {
        this.code = code;
        this.msg = msg;
        this.detail = detail;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public List<ImportacionNegTemp> getDetail() {
        return detail;
    }

    public void setDetail(List<ImportacionNegTemp> detail) {
        this.detail = detail;
    }
}
