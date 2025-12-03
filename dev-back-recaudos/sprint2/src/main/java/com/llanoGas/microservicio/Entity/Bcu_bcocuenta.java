package com.llanoGas.microservicio.Entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "bcu_bcocuenta")
public class Bcu_bcocuenta {
	@Id
	private	 Integer bcu_ideregistro ;
	
private	 String   bcu_numcuenta ;

public Integer getBcu_ideregistro() {
	return bcu_ideregistro;
}

public void setBcu_ideregistro(Integer bcu_ideregistro) {
	this.bcu_ideregistro = bcu_ideregistro;
}

public String getBcu_numcuenta() {
	return bcu_numcuenta;
}

public void setBcu_numcuenta(String bcu_numcuenta) {
	this.bcu_numcuenta = bcu_numcuenta;
}



}
