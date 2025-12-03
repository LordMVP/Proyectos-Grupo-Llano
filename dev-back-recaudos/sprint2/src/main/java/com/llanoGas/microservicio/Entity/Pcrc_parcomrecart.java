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
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.llanoGas.microservicio.model.dao.IRed_rangedacart;

@Entity
@Table(name = "pcrc_parcomrecart",schema = "aseo")
public class Pcrc_parcomrecart  implements Serializable {
	

    
    @Id

    @GeneratedValue(strategy =GenerationType.IDENTITY)

	private Integer pcrc_ideregistro;
	

	private String pcrc_estado;
	private Integer usu_ideregistro;




	   @OneToMany(mappedBy="pcrc_parecaudocomision",targetEntity = Red_rangedacart.class )
	    private List<IRed_rangedacart> rangos;


    @OneToMany(mappedBy="pcrc_parecaudocomision" )
    private List<Icc_impcarteracomision> impuesto;
    
	


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


	private Timestamp pcrc_fecha;
	
     private Timestamp pcrc_vigencia_desde;
	
	private Timestamp pcrc_vigencia_hasta;

	private static final long serialVersionUID = 1L;
	
	

	public Timestamp getPcrc_vigencia_desde() {
		return pcrc_vigencia_desde;
	}

	public void setPcrc_vigencia_desde(Timestamp pcrc_vigencia_desde) {
		this.pcrc_vigencia_desde = pcrc_vigencia_desde;
	}

	public Timestamp getPcrc_vigencia_hasta() {
		return pcrc_vigencia_hasta;
	}

	public void setPcrc_vigencia_hasta(Timestamp pcrc_vigencia_hasta) {
		this.pcrc_vigencia_hasta = pcrc_vigencia_hasta;
	}

	

	

	public List<IRed_rangedacart> getRangos() {
		return rangos;
	}

	public void setRangos(List<IRed_rangedacart> rangos) {
		this.rangos = rangos;
	}

	public List<Icc_impcarteracomision> getImpuesto() {
		return impuesto;
	}

	public void setImpuesto(List<Icc_impcarteracomision> impuesto) {
		this.impuesto = impuesto;
	}

	
	public Integer getBcu_ideregistro() {
		return bcu_ideregistro;
	}

	public void setBcu_ideregistro(Integer bcu_ideregistro) {
		this.bcu_ideregistro = bcu_ideregistro;
	}

	public Bcu_bcocuenta getBcu_ideregistro_object() {
		return bcu_ideregistro_object;
	}

	public void setBcu_ideregistro_object(Bcu_bcocuenta bcu_ideregistro_object) {
		this.bcu_ideregistro_object = bcu_ideregistro_object;
	}

	public Integer getUni_medpago() {
		return uni_medpago;
	}

	public void setUni_medpago(Integer uni_medpago) {
		this.uni_medpago = uni_medpago;
	}

	public Unidad_medpago getMedpagoObject() {
		return medpagoObject;
	}

	public void setMedpagoObject(Unidad_medpago medpagoObject) {
		this.medpagoObject = medpagoObject;
	}

	public Integer getTer_ideregistro() {
		return ter_ideregistro;
	}

	public void setTer_ideregistro(Integer ter_ideregistro) {
		this.ter_ideregistro = ter_ideregistro;
	}

	public Ter_tercero getTerceroObject() {
		return terceroObject;
	}

	public void setTerceroObject(Ter_tercero terceroObject) {
		this.terceroObject = terceroObject;
	}

	public Timestamp getPcrc_fecha() {
		return pcrc_fecha;
	}

	public void setPcrc_fecha(Timestamp pcrc_fecha) {
		this.pcrc_fecha = pcrc_fecha;
	}

	
	

	public Integer getPcrc_ideregistro() {
		return pcrc_ideregistro;
	}

	public void setPcrc_ideregistro(Integer pcrc_ideregistro) {
		this.pcrc_ideregistro = pcrc_ideregistro;
	}

	


	
	public String getPcrc_estado() {
		return pcrc_estado;
	}

	public void setPcrc_estado(String pcrc_estado) {
		this.pcrc_estado = pcrc_estado;
	}

	public Integer getUsu_ideregistro() {
		return usu_ideregistro;
	}

	public void setUsu_ideregistro(Integer usu_ideregistro) {
		this.usu_ideregistro = usu_ideregistro;
	}


	

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
