package com.llanoGas.microservicio.Entity;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="icc_impcarteracomision",schema = "aseo")
public class Icc_impcarteracomision {
	@Id
	@GeneratedValue(strategy =GenerationType.IDENTITY)
	@Column(name = "icc_ideregistro", unique = true, nullable = false)
private	Integer icc_ideregistro;
private	String icc_porcentaje;
private	float icc_valor;
private	Integer usu_idregistro;
private	Integer uni_impuesto;

//timestamp(6) without time zone,


	    
		
		@Column(name = "pcrc_ideregistro", nullable = false)
		private Integer pcrc_ideregistro;
		@ManyToOne
		@JoinColumn(name = "pcrc_ideregistro", insertable = false, updatable = false)
		 
			private Pcrc_parcomrecart pcrc_parecaudocomision;

	
	Timestamp icc_fecha;


	


	public Integer getIcc_ideregistro() {
		return icc_ideregistro;
	}


	public void setIcc_ideregistro(Integer icc_ideregistro) {
		this.icc_ideregistro = icc_ideregistro;
	}


	public String getIcc_porcentaje() {
		return icc_porcentaje;
	}


	public void setIcc_porcentaje(String icc_porcentaje) {
		this.icc_porcentaje = icc_porcentaje;
	}


	public float getIcc_valor() {
		return icc_valor;
	}


	public void setIcc_valor(float icc_valor) {
		this.icc_valor = icc_valor;
	}


	public Integer getUsu_idregistro() {
		return usu_idregistro;
	}


	public void setUsu_idregistro(Integer usu_idregistro) {
		this.usu_idregistro = usu_idregistro;
	}


	public Integer getUni_impuesto() {
		return uni_impuesto;
	}


	public void setUni_impuesto(Integer uni_impuesto) {
		this.uni_impuesto = uni_impuesto;
	}


	public Integer getPcrc_ideregistro() {
		return pcrc_ideregistro;
	}


	public void setPcrc_ideregistro(Integer pcrc_ideregistro) {
		this.pcrc_ideregistro = pcrc_ideregistro;
	}





	


	public Timestamp getIcc_fecha() {
		return icc_fecha;
	}


	public void setIcc_fecha(Timestamp icc_fecha) {
		this.icc_fecha = icc_fecha;
	}
	
	
	
	
	
}
