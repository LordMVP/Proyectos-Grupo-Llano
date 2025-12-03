package com.llanoGas.microservicio.Entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.llanoGas.microservicio.Entity.Cnre_cnvrecaudo;

@Entity
@Table(name="dicn_disconven")
public class Dicn_disconven implements Serializable{
	@Id
	@Column(name = "dicn_ideregistr", unique = true, nullable = false)
private	Integer dicn_ideregistr;



public Empresa getEmpresa() {
		return empresa;
	}
	public void setEmpresa(Empresa empresa) {
		this.empresa = empresa;
	}

private    Integer dicn_valor;
private    Integer usu_ideregistro;
private    Integer dicn_pagprioridad;
private    Integer dicn_proprioridad;
private    String dicn_empfactura;

    




@Column(name = "cnre_ideregistr", nullable=false)
private	Integer cnre_ideregistr;
@ManyToOne(optional=false)
@JoinColumn(name = "cnre_ideregistr", insertable=false, updatable=false)
	private Cnre_cnvrecaudo cnre_recaudo;
    












@Column(name = "uni_tipsuscripc", nullable=false)
private	Integer uni_tipsuscripc;
@ManyToOne(optional=false)
@JoinColumn(name = "uni_ideregistro", insertable=false, updatable=false)
	private Uni_unidad unidad;
    

@Column(name = "emp_ideregistro", nullable=false)
private	Integer emp_ideregistro;
@ManyToOne(optional=false)
@JoinColumn(name = "empresa_sevemp", insertable=false, updatable=false)
	private Empresa empresa;


    

 
    public Uni_unidad getUnidad() {
	return unidad;
}
public void setUnidad(Uni_unidad unidad) {
	this.unidad = unidad;
}
	public Cnre_cnvrecaudo getCnre_recaudo() {
	return cnre_recaudo;
}
public void setCnre_recaudo(Cnre_cnvrecaudo cnre_recaudo) {
	this.cnre_recaudo = cnre_recaudo;
}

	private static final long serialVersionUID = 1L;
	public Integer getDicn_ideregistr() {
		return dicn_ideregistr;
	}
	public void setDicn_ideregistr(Integer dicn_ideregistr) {
		this.dicn_ideregistr = dicn_ideregistr;
	}
	public Integer getCnre_ideregistr() {
		return cnre_ideregistr;
	}
	public void setCnre_ideregistr(Integer cnre_ideregistr) {
		this.cnre_ideregistr = cnre_ideregistr;
	}
	public Integer getEmp_ideregistro() {
		return emp_ideregistro;
	}
	public void setEmp_ideregistro(Integer emp_ideregistro) {
		this.emp_ideregistro = emp_ideregistro;
	}
	public Integer getUni_tipsuscripc() {
		return uni_tipsuscripc;
	}
	public void setUni_tipsuscripc(Integer uni_tipsuscripc) {
		this.uni_tipsuscripc = uni_tipsuscripc;
	}
	public Integer getDicn_valor() {
		return dicn_valor;
	}
	public void setDicn_valor(Integer dicn_valor) {
		this.dicn_valor = dicn_valor;
	}
	public Integer getUsu_ideregistro() {
		return usu_ideregistro;
	}
	public void setUsu_ideregistro(Integer usu_ideregistro) {
		this.usu_ideregistro = usu_ideregistro;
	}
	public Integer getDicn_pagprioridad() {
		return dicn_pagprioridad;
	}
	public void setDicn_pagprioridad(Integer dicn_pagprioridad) {
		this.dicn_pagprioridad = dicn_pagprioridad;
	}
	public Integer getDicn_proprioridad() {
		return dicn_proprioridad;
	}
	public void setDicn_proprioridad(Integer dicn_proprioridad) {
		this.dicn_proprioridad = dicn_proprioridad;
	}
	public String getDicn_empfactura() {
		return dicn_empfactura;
	}
	public void setDicn_empfactura(String dicn_empfactura) {
		this.dicn_empfactura = dicn_empfactura;
	}
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
    
    

}
