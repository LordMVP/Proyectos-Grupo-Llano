package com.llanoGas.microservicio.Entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tido_tipdocumen")
public class Tido_tipdocumen implements Serializable{
	
	@Id
	@Column(name = "uni_tipdocument", unique = true, nullable = false)
	private Integer uni_tipdocument;
	private Integer est_tipdocument;
	private String tido_nombre;
	private String tido_abreviatur;
	private String tido_metregistr;
	private String tido_gensuspend;
	private Integer usu_ideregistro;
	private String tido_nitcontabil;
	private Integer tido_maxcuofinancia;
	private Integer tido_maxcuounifica;
	private Integer tido_maxcuoreestruc;
	private Integer tido_maxcuoabonok;
	private String tido_finvencido;
	private Integer tido_pagpriori;
    
    private static final long serialVersionUID = 1L;

	public Integer getUni_tipdocument() {
		return uni_tipdocument;
	}

	public void setUni_tipdocument(Integer uni_tipdocument) {
		this.uni_tipdocument = uni_tipdocument;
	}

	public Integer getEst_tipdocument() {
		return est_tipdocument;
	}

	public void setEst_tipdocument(Integer est_tipdocument) {
		this.est_tipdocument = est_tipdocument;
	}

	public String getTido_nombre() {
		return tido_nombre;
	}

	public void setTido_nombre(String tido_nombre) {
		this.tido_nombre = tido_nombre;
	}

	public String getTido_abreviatur() {
		return tido_abreviatur;
	}

	public void setTido_abreviatur(String tido_abreviatur) {
		this.tido_abreviatur = tido_abreviatur;
	}

	public String getTido_metregistr() {
		return tido_metregistr;
	}

	public void setTido_metregistr(String tido_metregistr) {
		this.tido_metregistr = tido_metregistr;
	}

	public String getTido_gensuspend() {
		return tido_gensuspend;
	}

	public void setTido_gensuspend(String tido_gensuspend) {
		this.tido_gensuspend = tido_gensuspend;
	}

	public Integer getUsu_ideregistro() {
		return usu_ideregistro;
	}

	public void setUsu_ideregistro(Integer usu_ideregistro) {
		this.usu_ideregistro = usu_ideregistro;
	}

	public String getTido_nitcontabil() {
		return tido_nitcontabil;
	}

	public void setTido_nitcontabil(String tido_nitcontabil) {
		this.tido_nitcontabil = tido_nitcontabil;
	}

	public Integer getTido_maxcuofinancia() {
		return tido_maxcuofinancia;
	}

	public void setTido_maxcuofinancia(Integer tido_maxcuofinancia) {
		this.tido_maxcuofinancia = tido_maxcuofinancia;
	}

	public Integer getTido_maxcuounifica() {
		return tido_maxcuounifica;
	}

	public void setTido_maxcuounifica(Integer tido_maxcuounifica) {
		this.tido_maxcuounifica = tido_maxcuounifica;
	}

	public Integer getTido_maxcuoreestruc() {
		return tido_maxcuoreestruc;
	}

	public void setTido_maxcuoreestruc(Integer tido_maxcuoreestruc) {
		this.tido_maxcuoreestruc = tido_maxcuoreestruc;
	}

	public Integer getTido_maxcuoabonok() {
		return tido_maxcuoabonok;
	}

	public void setTido_maxcuoabonok(Integer tido_maxcuoabonok) {
		this.tido_maxcuoabonok = tido_maxcuoabonok;
	}

	public String getTido_finvencido() {
		return tido_finvencido;
	}

	public void setTido_finvencido(String tido_finvencido) {
		this.tido_finvencido = tido_finvencido;
	}

	public Integer getTido_pagpriori() {
		return tido_pagpriori;
	}

	public void setTido_pagpriori(Integer tido_pagpriori) {
		this.tido_pagpriori = tido_pagpriori;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
    
    

}
