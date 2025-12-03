package com.llanoGas.microservicio.Entity;

import java.sql.Timestamp;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
@Entity
@Table(name="irc_imprecaudocomision",schema = "aseo")
public class Irc_imprecaudocomision {
	@Id
	@GeneratedValue(strategy =GenerationType.IDENTITY)
	@Column(name = "irc_ideregistro", unique = true, nullable = false)
private	Integer irc_ideregistro;
private	String irc_porcentaje;
private	float irc_valor;
private	Integer usu_idregistro;
private	Integer uni_impuesto;

//timestamp(6) without time zone,

	 
	    
		
		@Column(name = "prc_ideregistro", nullable = false)
		private Integer prc_ideregistro;
		@ManyToOne
		@JoinColumn(name = "prc_ideregistro", insertable = false, updatable = false)
		 
			private Prc_parecaudocomision prc_parecaudocomision;

	
	Timestamp irc_fecha;
	
	



	public Integer getIrc_ideregistro() {
		return irc_ideregistro;
	}

	public void setIrc_ideregistro(Integer irc_ideregistro) {
		this.irc_ideregistro = irc_ideregistro;
	}

	public String getIrc_porcentaje() {
		return irc_porcentaje;
	}

	public void setIrc_porcentaje(String irc_porcentaje) {
		this.irc_porcentaje = irc_porcentaje;
	}

	public float getIrc_valor() {
		return irc_valor;
	}

	public void setIrc_valor(float irc_valor) {
		this.irc_valor = irc_valor;
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

	public Integer getPrc_ideregistro() {
		return prc_ideregistro;
	}

	public void setPrc_ideregistro(Integer prc_ideregistro) {
		this.prc_ideregistro = prc_ideregistro;
	}

	public Timestamp getIrc_fecha() {
		return irc_fecha;
	}

	public void setIrc_fecha(Timestamp irc_fecha) {
		this.irc_fecha = irc_fecha;
	}


	private static final long serialVersionUID = 1L;
}
