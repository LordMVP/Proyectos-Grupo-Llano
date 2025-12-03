package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigInteger;
import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class TacbTerceroaprovctabancacria
 */
@Entity
@Table(name = "tacb_terceroaprovctabancacria", schema = "aseo")
public class TacbTerceroaprovctabancacria {

    @Id
    @Column(name = "tacb_ideregistro")
    private Integer tacbIderegistro;

    @Column(name = "ter_ideregistro")
    private BigInteger terIderegistro;

    @Column(name = "emp_ideregistro")
    private Integer empIderegistro;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "tacb_fecharegistro")
    private Date tacbFecharegistro;

    @Column(name = "tacb_tipocuentabancaria")
    private String tacbTipocuentabancaria;

    @Column(name = "tacb_estado")
    private String tacbEstado;

    @Column(name = "tacb_nombrecuentabancaria")
    private String tacbNombrecuentabancaria;

    @Column(name = "tacb_numerocuenta")
    private String tacbNumerocuenta;

    public Integer getTacbIderegistro() {
        return tacbIderegistro;
    }

    public void setTacbIderegistro(Integer tacbIderegistro) {
        this.tacbIderegistro = tacbIderegistro;
    }

    public BigInteger getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(BigInteger terIderegistro) {
        this.terIderegistro = terIderegistro;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public Date getTacbFecharegistro() {
        return tacbFecharegistro;
    }

    public void setTacbFecharegistro(Date tacbFecharegistro) {
        this.tacbFecharegistro = tacbFecharegistro;
    }

    public String getTacbTipocuentabancaria() {
        return tacbTipocuentabancaria;
    }

    public void setTacbTipocuentabancaria(String tacbTipocuentabancaria) {
        this.tacbTipocuentabancaria = tacbTipocuentabancaria;
    }

    public String getTacbEstado() {
        return tacbEstado;
    }

    public void setTacbEstado(String tacbEstado) {
        this.tacbEstado = tacbEstado;
    }

    public String getTacbNombrecuentabancaria() {
        return tacbNombrecuentabancaria;
    }

    public void setTacbNombrecuentabancaria(String tacbNombrecuentabancaria) {
        this.tacbNombrecuentabancaria = tacbNombrecuentabancaria;
    }

    public String getTacbNumerocuenta() {
        return tacbNumerocuenta;
    }

    public void setTacbNumerocuenta(String tacbNumerocuenta) {
        this.tacbNumerocuenta = tacbNumerocuenta;
    }
}
