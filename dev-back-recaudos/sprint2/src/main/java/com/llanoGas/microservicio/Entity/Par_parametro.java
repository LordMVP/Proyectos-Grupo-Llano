package com.llanoGas.microservicio.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="par_parametro")
public class Par_parametro {
	
	@Id
	@Column(name = "par_ideregistro", unique = true, nullable = false)
	Integer  par_ideregistro ;
	 Integer   emp_ideregistro ;
	  String  par_parametro ;
	public Integer getPar_ideregistro() {
		return par_ideregistro;
	}
	public void setPar_ideregistro(Integer par_ideregistro) {
		this.par_ideregistro = par_ideregistro;
	}
	public Integer getEmp_ideregistro() {
		return emp_ideregistro;
	}
	public void setEmp_ideregistro(Integer emp_ideregistro) {
		this.emp_ideregistro = emp_ideregistro;
	}
	public String getPar_parametro() {
		return par_parametro;
	}
	public void setPar_parametro(String par_parametro) {
		this.par_parametro = par_parametro;
	}
	  
	  
}
