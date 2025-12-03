package com.llanoGas.microservicio.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="uni_unidad")
public class Unidad_TipoCosto {
	

	@Id
	@Column(name = "uni_ideregistro", unique = true, nullable = false)
	
private	Integer	 uni_tipocosto;
	

	  
	@Column(name = "uni_codigo1")
private	String    suscripcion ;
	

	
private	String uni_nombre1;
	
	  




	public Integer getUni_tipocosto() {
	return uni_tipocosto;
}

public void setUni_tipocosto(Integer uni_tipocosto) {
	this.uni_tipocosto = uni_tipocosto;
}

	public String getSuscripcion() {
		return suscripcion;
	}

	public void setSuscripcion(String suscripcion) {
		this.suscripcion = suscripcion;
	}

	public String getUni_nombre1() {
		return uni_nombre1;
	}

	public void setUni_nombre1(String uni_nombre1) {
		this.uni_nombre1 = uni_nombre1;
	}
	
	
}
