package com.llanoGas.microservicio.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.llanoGas.microservicio.Entity.Empresa;

@Entity
@Table(name="uni_unidad")
public class Uni_unidad {

	
	@Id
	@Column(name = "uni_ideregistro", unique = true, nullable = false)
	Integer	 uni_ideregistro;
	  
	@Column(name = "uni_codigo1")
	String    suscripcion ;
	
	/**
	  @Column(name = "emp_ideregistro", nullable=false)
	   private	Integer emp_ideregistro;
	   @ManyToOne(optional=false)
	   @JoinColumn(name = "empresa_sevemp", insertable=false, updatable=false)
	   	private Empresa empresa;
	   
	   */
	   
	/**
	public Integer getEmp_ideregistro() {
		return emp_ideregistro;
	}

	public void setEmp_ideregistro(Integer emp_ideregistro) {
		this.emp_ideregistro = emp_ideregistro;
	}

	public Empresa getEmpresa() {
		return empresa;
	}

	public void setEmpresa(Empresa empresa) {
		this.empresa = empresa;
	} */

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
	  
}
