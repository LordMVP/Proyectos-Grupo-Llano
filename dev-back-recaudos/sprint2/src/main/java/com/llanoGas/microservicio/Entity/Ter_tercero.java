package com.llanoGas.microservicio.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
@Entity
@Table(name="ter_tercero")
public class Ter_tercero {
String	ter_documento;
String    ter_nomcompleto ;
@Id
@Column(name = "ter_ideregistro", unique = true, nullable = false)
Integer    ter_ideregistro;



public String getTer_documento() {
	return ter_documento;
}
public void setTer_documento(String ter_documento) {
	this.ter_documento = ter_documento;
}
public String getTer_nomcompleto() {
	return ter_nomcompleto;
}
public void setTer_nomcompleto(String ter_nomcompleto) {
	this.ter_nomcompleto = ter_nomcompleto;
}
public Integer getTer_ideregistro() {
	return ter_ideregistro;
}
public void setTer_ideregistro(Integer ter_ideregistro) {
	this.ter_ideregistro = ter_ideregistro;
}





}
