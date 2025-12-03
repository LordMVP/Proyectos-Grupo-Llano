package com.llanoGas.microservicio.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="mpbc_medpagcuebanco")
public class Mpbc_medpagcuebanco {
	
	@Id
private	 Integer mpbc_ideregistr;
private	 Integer   uni_medpago;



@Column(name = "bcu_ideregistro", unique = true, nullable = false)
private	 Integer   bcu_ideregistro ;
@ManyToOne(optional = false)
@JoinColumn(name = "bcu_ideregistro", insertable = false, updatable = false)
private Bcu_bcocuenta bcu_bcocuenta;
public Integer getMpbc_ideregistr() {
	return mpbc_ideregistr;
}
public void setMpbc_ideregistr(Integer mpbc_ideregistr) {
	this.mpbc_ideregistr = mpbc_ideregistr;
}
public Integer getUni_medpago() {
	return uni_medpago;
}
public void setUni_medpago(Integer uni_medpago) {
	this.uni_medpago = uni_medpago;
}
public Integer getBcu_ideregistro() {
	return bcu_ideregistro;
}
public void setBcu_ideregistro(Integer bcu_ideregistro) {
	this.bcu_ideregistro = bcu_ideregistro;
}
public Bcu_bcocuenta getBcu_bcocuenta() {
	return bcu_bcocuenta;
}
public void setBcu_bcocuenta(Bcu_bcocuenta bcu_bcocuenta) {
	this.bcu_bcocuenta = bcu_bcocuenta;
}



}
