package com.llanoGas.microservicio.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="empresas")
public class Empresa {

	
	String empresa_cod;
   String  empresa_nom ;
   
   
   @Id
	@Column(name = "empresa_sevemp", unique = true, nullable = false)
   Integer  empresa_sevemp ;


public String getEmpresa_cod() {
	return empresa_cod;
}


public void setEmpresa_cod(String empresa_cod) {
	this.empresa_cod = empresa_cod;
}


public String getEmpresa_nom() {
	return empresa_nom;
}


public void setEmpresa_nom(String empresa_nom) {
	this.empresa_nom = empresa_nom;
}


public Integer getEmpresa_sevemp() {
	return empresa_sevemp;
}


public void setEmpresa_sevemp(Integer empresa_sevemp) {
	this.empresa_sevemp = empresa_sevemp;
}
   
   
   
}
