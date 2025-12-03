package com.llanoGas.microservicio.Entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="red_rangedacart", schema = "aseo")
public class Red_rangedacart {
	
@Id
@GeneratedValue(strategy =GenerationType.IDENTITY)
  private Integer  red_ideregistro ;
  private Integer  rango_desde ;
  private  Integer  rango_hasta ;
  private Integer  comision;
  private Integer  usu_ideregistro;
  private Timestamp red_fecha;
  
  
  
  @Column(name = "pcrc_ideregistro", nullable = false)
	private Integer pcrc_ideregistro;
	@ManyToOne
	@JoinColumn(name = "pcrc_ideregistro", insertable = false, updatable = false)
	 
	 private Pcrc_parcomrecart pcrc_parecaudocomision;
  
  
public Timestamp getRed_fecha() {
		return red_fecha;
	}
	public void setRed_fecha(Timestamp red_fecha) {
		this.red_fecha = red_fecha;
	}
public Integer getPcrc_ideregistro() {
		return pcrc_ideregistro;
	}
	public void setPcrc_ideregistro(Integer pcrc_ideregistro) {
		this.pcrc_ideregistro = pcrc_ideregistro;
	}
public Integer getRed_ideregistro() {
	return red_ideregistro;
}
public void setRed_ideregistro(Integer red_ideregistro) {
	this.red_ideregistro = red_ideregistro;
}
public Integer getRango_desde() {
	return rango_desde;
}
public void setRango_desde(Integer rango_desde) {
	this.rango_desde = rango_desde;
}
public Integer getRango_hasta() {
	return rango_hasta;
}
public void setRango_hasta(Integer rango_hasta) {
	this.rango_hasta = rango_hasta;
}
public Integer getComision() {
	return comision;
}
public void setComision(Integer comision) {
	this.comision = comision;
}
public Integer getUsu_ideregistro() {
	return usu_ideregistro;
}
public void setUsu_ideregistro(Integer usu_ideregistro) {
	this.usu_ideregistro = usu_ideregistro;
}
  
  
  

}
