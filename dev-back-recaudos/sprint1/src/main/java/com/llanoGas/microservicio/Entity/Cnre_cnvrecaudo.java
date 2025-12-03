package com.llanoGas.microservicio.Entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cnre_cnvrecaudo")
public class Cnre_cnvrecaudo implements Serializable {
	@Id
	@Column(name = "cnre_ideregistr", unique = true, nullable = false)
	Integer cnre_ideregistr ;
    String cnre_nombre ;
    String cnre_estado ;
    Integer cnre_numcontrat ;
    String cnre_tipdistrib ;
    String cnre_obliga ;
   Integer  usu_ideregistro;
   
   
   private static final long serialVersionUID = 1L;
public Integer getCnre_ideregistr() {
	return cnre_ideregistr;
}
public void setCnre_ideregistr(Integer cnre_ideregistr) {
	this.cnre_ideregistr = cnre_ideregistr;
}
public String getCnre_nombre() {
	return cnre_nombre;
}
public void setCnre_nombre(String cnre_nombre) {
	this.cnre_nombre = cnre_nombre;
}
public String getCnre_estado() {
	return cnre_estado;
}
public void setCnre_estado(String cnre_estado) {
	this.cnre_estado = cnre_estado;
}
public Integer getCnre_numcontrat() {
	return cnre_numcontrat;
}
public void setCnre_numcontrat(Integer cnre_numcontrat) {
	this.cnre_numcontrat = cnre_numcontrat;
}
public String getCnre_tipdistrib() {
	return cnre_tipdistrib;
}
public void setCnre_tipdistrib(String cnre_tipdistrib) {
	this.cnre_tipdistrib = cnre_tipdistrib;
}
public String getCnre_obliga() {
	return cnre_obliga;
}
public void setCnre_obliga(String cnre_obliga) {
	this.cnre_obliga = cnre_obliga;
}
public Integer getUsu_ideregistro() {
	return usu_ideregistro;
}
public void setUsu_ideregistro(Integer usu_ideregistro) {
	this.usu_ideregistro = usu_ideregistro;
}
   
   
   

}
