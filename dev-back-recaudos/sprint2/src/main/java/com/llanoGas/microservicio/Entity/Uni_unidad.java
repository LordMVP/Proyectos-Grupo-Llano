package com.llanoGas.microservicio.Entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.llanoGas.microservicio.Entity.Empresa;

@Entity
@Table(name="uni_unidad")
public class Uni_unidad implements Serializable{

	
	@Id
	@Column(name = "uni_ideregistro", unique = true, nullable = false)
	
private	Integer	 uni_ideregistro;
	  
	@Column(name = "uni_codigo1")
private	String    suscripcion ;
	

	
private	String uni_nombre1;
	
	  
	   private static final long serialVersionUID = 1L;

	public Integer getUni_ideregistro() {
		return uni_ideregistro;
	}

	public void setUni_ideregistro(Integer uni_ideregistro) {
		this.uni_ideregistro = uni_ideregistro;
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
