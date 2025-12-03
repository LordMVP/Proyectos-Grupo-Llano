package com.llanoGas.microservicio.Entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="doc_documento")
public class Doc_documento implements Serializable{
	
@Id
@Column(name = "uni_documento", unique = true, nullable = false)
private Integer	uni_documento;
private Integer    est_documento;
private String    doc_nombre;
private String    doc_abreviatura ;
private String    doc_financiable;
private String    doc_tipo;
private String    doc_contabiliza;
private String    doc_consigna;
private String    doc_presupuesto;
private String    doc_recaudo;
private Integer    usu_ideregistro;
private String    doc_devolucion;
private String    doc_anticipo;
private String    doc_registro;
private String    doc_nitcontabil;
private Integer    doc_maximpresion;
private Integer    doc_pagpriori;
private String    doc_aplicafes;
private String    doc_aplicafelec;

private static final long serialVersionUID = 1L;

public Integer getUni_documento() {
	return uni_documento;
}

public void setUni_documento(Integer uni_documento) {
	this.uni_documento = uni_documento;
}

public Integer getEst_documento() {
	return est_documento;
}

public void setEst_documento(Integer est_documento) {
	this.est_documento = est_documento;
}

public String getDoc_nombre() {
	return doc_nombre;
}

public void setDoc_nombre(String doc_nombre) {
	this.doc_nombre = doc_nombre;
}

public String getDoc_abreviatura() {
	return doc_abreviatura;
}

public void setDoc_abreviatura(String doc_abreviatura) {
	this.doc_abreviatura = doc_abreviatura;
}

public String getDoc_financiable() {
	return doc_financiable;
}

public void setDoc_financiable(String doc_financiable) {
	this.doc_financiable = doc_financiable;
}

public String getDoc_tipo() {
	return doc_tipo;
}

public void setDoc_tipo(String doc_tipo) {
	this.doc_tipo = doc_tipo;
}

public String getDoc_contabiliza() {
	return doc_contabiliza;
}

public void setDoc_contabiliza(String doc_contabiliza) {
	this.doc_contabiliza = doc_contabiliza;
}

public String getDoc_consigna() {
	return doc_consigna;
}

public void setDoc_consigna(String doc_consigna) {
	this.doc_consigna = doc_consigna;
}

public String getDoc_presupuesto() {
	return doc_presupuesto;
}

public void setDoc_presupuesto(String doc_presupuesto) {
	this.doc_presupuesto = doc_presupuesto;
}

public String getDoc_recaudo() {
	return doc_recaudo;
}

public void setDoc_recaudo(String doc_recaudo) {
	this.doc_recaudo = doc_recaudo;
}

public Integer getUsu_ideregistro() {
	return usu_ideregistro;
}

public void setUsu_ideregistro(Integer usu_ideregistro) {
	this.usu_ideregistro = usu_ideregistro;
}

public String getDoc_devolucion() {
	return doc_devolucion;
}

public void setDoc_devolucion(String doc_devolucion) {
	this.doc_devolucion = doc_devolucion;
}

public String getDoc_anticipo() {
	return doc_anticipo;
}

public void setDoc_anticipo(String doc_anticipo) {
	this.doc_anticipo = doc_anticipo;
}

public String getDoc_registro() {
	return doc_registro;
}

public void setDoc_registro(String doc_registro) {
	this.doc_registro = doc_registro;
}

public String getDoc_nitcontabil() {
	return doc_nitcontabil;
}

public void setDoc_nitcontabil(String doc_nitcontabil) {
	this.doc_nitcontabil = doc_nitcontabil;
}

public Integer getDoc_maximpresion() {
	return doc_maximpresion;
}

public void setDoc_maximpresion(Integer doc_maximpresion) {
	this.doc_maximpresion = doc_maximpresion;
}

public Integer getDoc_pagpriori() {
	return doc_pagpriori;
}

public void setDoc_pagpriori(Integer doc_pagpriori) {
	this.doc_pagpriori = doc_pagpriori;
}

public String getDoc_aplicafes() {
	return doc_aplicafes;
}

public void setDoc_aplicafes(String doc_aplicafes) {
	this.doc_aplicafes = doc_aplicafes;
}

public String getDoc_aplicafelec() {
	return doc_aplicafelec;
}

public void setDoc_aplicafelec(String doc_aplicafelec) {
	this.doc_aplicafelec = doc_aplicafelec;
}

public static long getSerialversionuid() {
	return serialVersionUID;
}


}
