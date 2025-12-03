package com.llanoGas.microservicio.Entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "prc_parecaudocomision",schema = "aseo")
public class Prc_parecaudocomision implements Serializable {
	@Id

    @GeneratedValue(strategy =GenerationType.IDENTITY)

	private Integer prc_ideregistro;

	
	private Integer prc_valor;
	private String prc_estado;
	private Integer usu_ideregistro;

	


	

	private Timestamp prc_fecha;

	private Timestamp prc_vigencia_desde;
	
	private Timestamp prc_vigencia_hasta;

	private static final long serialVersionUID = 1L;
	
	@OneToMany(mappedBy="prc_parecaudocomision" )
	 private List<Irc_imprecaudocomision> impuesto;
	 
	    
	
	@Column(name = "uni_tipocosto", nullable = false)
	private Integer uni_tipocosto;
    @ManyToOne(optional = false)
	@JoinColumn(name = "uni_tipocosto", insertable = false, updatable = false)
	private Unidad_TipoCosto uni_tipocosto_object;


    @Column(name = "bcu_ideregistro", nullable = false)
    private Integer bcu_ideregistro ;
    @ManyToOne(optional = false)
	@JoinColumn(name = "bcu_ideregistro", insertable = false, updatable = false)
	private Bcu_bcocuenta bcu_ideregistro_object;
	
    
    
	@Column(name = "uni_medpago", nullable = false)
	private Integer uni_medpago;
    @ManyToOne(optional = false)
	@JoinColumn(name = "uni_medpago", insertable = false, updatable = false)
	private Unidad_medpago medpagoObject;


    @Column(name = "ter_ideregistro", nullable = false)
	private Integer ter_ideregistro;
    @ManyToOne(optional = false)
	@JoinColumn(name = "ter_ideregistro", insertable = false, updatable = false)
	private Ter_tercero terceroObject;



	public Bcu_bcocuenta getBcu_ideregistro_object() {
		return bcu_ideregistro_object;
	}

	public void setBcu_ideregistro_object(Bcu_bcocuenta bcu_ideregistro_object) {
		this.bcu_ideregistro_object = bcu_ideregistro_object;
	}

	public Unidad_medpago getMedpagoObject() {
		return medpagoObject;
	}

	public void setMedpagoObject(Unidad_medpago medpagoObject) {
		this.medpagoObject = medpagoObject;
	}

	public Integer getUni_tipocosto() {
		return uni_tipocosto;
	}

	

	public Integer getPrc_ideregistro() {
		return prc_ideregistro;
	}

	public void setPrc_ideregistro(Integer prc_ideregistro) {
		this.prc_ideregistro = prc_ideregistro;
	}



	

	public Integer getBcu_ideregistro() {
		return bcu_ideregistro;
	}

	public void setBcu_ideregistro(Integer bcu_ideregistro) {
		this.bcu_ideregistro = bcu_ideregistro;
	}



	public Integer getPrc_valor() {
		return prc_valor;
	}

	public void setPrc_valor(Integer prc_valor) {
		this.prc_valor = prc_valor;
	}

	public String getPrc_estado() {
		return prc_estado;
	}

	public void setPrc_estado(String prc_estado) {
		this.prc_estado = prc_estado;
	}

	public Integer getUsu_ideregistro() {
		return usu_ideregistro;
	}

	public void setUsu_ideregistro(Integer usu_ideregistro) {
		this.usu_ideregistro = usu_ideregistro;
	}

	

	public Timestamp getPrc_vigencia_desde() {
		return prc_vigencia_desde;
	}

	public void setPrc_vigencia_desde(Timestamp prc_vigencia_desde) {
		this.prc_vigencia_desde = prc_vigencia_desde;
	}

	public Timestamp getPrc_vigencia_hasta() {
		return prc_vigencia_hasta;
	}

	public void setPrc_vigencia_hasta(Timestamp prc_vigencia_hasta) {
		this.prc_vigencia_hasta = prc_vigencia_hasta;
	}


	public Integer getTer_ideregistro() {
		return ter_ideregistro;
	}

	public void setTer_ideregistro(Integer ter_ideregistro) {
		this.ter_ideregistro = ter_ideregistro;
	}

	public Timestamp getPrc_fecha() {
		return prc_fecha;
	}

	public void setPrc_fecha(Timestamp time) {
		this.prc_fecha = time;
	}
	public Integer getUni_medpago() {
		return uni_medpago;
	}

	public void setUni_medpago(Integer uni_medpago) {
		this.uni_medpago = uni_medpago;
	}

	

	public void setUni_tipocosto(Integer uni_tipocosto) {
		this.uni_tipocosto = uni_tipocosto;
	}

	public Unidad_TipoCosto getUni_tipocosto_object() {
		return uni_tipocosto_object;
	}

	public void setUni_tipocosto_object(Unidad_TipoCosto uni_tipocosto_object) {
		this.uni_tipocosto_object = uni_tipocosto_object;
	}

	

	public Ter_tercero getTerceroObject() {
		return terceroObject;
	}

	public void setTerceroObject(Ter_tercero terceroObject) {
		this.terceroObject = terceroObject;
	}

	public List<Irc_imprecaudocomision> getImpuesto() {
		return impuesto;
	}

	public void setImpuesto(List<Irc_imprecaudocomision> impuesto) {
		this.impuesto = impuesto;
	}

	
}
