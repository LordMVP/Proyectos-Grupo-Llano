package com.llanoGas.microservicio.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="mpte_medpagtercer")
public class Mpte_medpagtercer {
	
@Id
private Integer	 mpte_ideregistr;
private Integer	    ter_ideregistro;




@Column(name = "uni_medpago", nullable = false)
private Integer uni_medpago;

public Integer getMpte_ideregistr() {
	return mpte_ideregistr;
}
public void setMpte_ideregistr(Integer mpte_ideregistr) {
	this.mpte_ideregistr = mpte_ideregistr;
}
public Integer getTer_ideregistro() {
	return ter_ideregistro;
}
public void setTer_ideregistro(Integer ter_ideregistro) {
	this.ter_ideregistro = ter_ideregistro;
}
public Integer getUni_medpago() {
	return uni_medpago;
}
public void setUni_medpago(Integer uni_medpago) {
	this.uni_medpago = uni_medpago;
}





}
