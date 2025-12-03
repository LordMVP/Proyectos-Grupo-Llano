package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "coli_conliquida_apro", schema="aseo")
@NamedQuery(name = "ColiConliquidaApro.findAll", query = "SELECT p FROM ColiConliquidaApro p")
public class ColiConliquidaApro implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_PK="coliAprovIderegistro";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_TER_IDEREGISTRO="terIderegistro";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_UNI_CONCEPTO="uniConcepto";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_UNI_LIQUIDACION="uniLiquidacion";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_USU_IDEREGISTRO="usuIderegistro";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_PORCENTAJE="uniPorcentaje";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_UNI_DOCUMENTO="uniDocumento";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_UNI_TIPDOCMENT="uniTipdocument";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_COLI_ESTADO="coliEstado";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_PROYECTO_LLACOM="proyectoLlacom";
	public static final String ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_FECHA_CREACION="fechaCreacion";

	
	private static final String [] ATRIBUTOS_ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO = {
			ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_PK, ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_TER_IDEREGISTRO, ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_UNI_CONCEPTO,
			ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_UNI_LIQUIDACION, ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_USU_IDEREGISTRO,
			ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_PORCENTAJE, ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_UNI_DOCUMENTO,
			ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_UNI_TIPDOCMENT, ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_COLI_ESTADO, 
			ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_PROYECTO_LLACOM, ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO_FECHA_CREACION
	};

	
	@Id
	@SequenceGenerator(name = "coli_aprov_ideregistro", sequenceName = "coli_aprov_ideregistro", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "coli_aprov_ideregistro")
	@Column(name = "coli_aprov_ideregistro")
	private Integer coliAprovIderegistro;
	
	@Column(name = "ter_ideregistro")
	private Integer terIderegistro;
	
	@Column(name = "uni_concepto")
	private Integer uniConcepto;
	
	@Column(name = "uni_liquidacion")
	private Integer uniLiquidacion;
	
	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name = "uni_porcentaje")
	private BigDecimal uniPorcentaje;
	
	@Column(name = "uni_documento")
	private Integer uniDocumento;
	
	@Column(name = "uni_tipdocument")
	private Integer uniTipdocument;
	
	@Column(name = "coli_estado")
	private String coliEstado;
	
	@Column(name = "proyecto_llacom")
	private String proyectoLlacom;
	
	@Column(name= "fecha_creacion")
	private Date fechaCreacion;
	
	public ColiConliquidaApro() {
		//constructor por defecto
	}

	public Integer getColiAprovIderegistro() {
		return coliAprovIderegistro;
	}

	public void setColiAprovIderegistro(Integer coliAprovIderegistro) {
		this.coliAprovIderegistro = coliAprovIderegistro;
	}

	public Integer getTerIderegistro() {
		return terIderegistro;
	}

	public void setTerIderegistro(Integer terIderegistro) {
		this.terIderegistro = terIderegistro;
	}

	public Integer getUniConcepto() {
		return uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public Integer getUniLiquidacion() {
		return uniLiquidacion;
	}

	public void setUniLiquidacion(Integer uniLiquidacion) {
		this.uniLiquidacion = uniLiquidacion;
	}

	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public BigDecimal getUniPorcentaje() {
		return uniPorcentaje;
	}

	public void setUniPorcentaje(BigDecimal uniPorcentaje) {
		this.uniPorcentaje = uniPorcentaje;
	}

	public Integer getUniDocumento() {
		return uniDocumento;
	}

	public void setUniDocumento(Integer uniDocumento) {
		this.uniDocumento = uniDocumento;
	}

	public Integer getUniTipdocument() {
		return uniTipdocument;
	}

	public void setUniTipdocument(Integer uniTipdocument) {
		this.uniTipdocument = uniTipdocument;
	}

	public String getColiEstado() {
		return coliEstado;
	}

	public void setColiEstado(String coliEstado) {
		this.coliEstado = coliEstado;
	}
	
	public String getProyectoLlacom() {
		return proyectoLlacom;
	}

	public void setProyectoLlacom(String proyectoLlacom) {
		this.proyectoLlacom = proyectoLlacom;
	}

	public Date getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(Date fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadTerTercero() {
		return ATRIBUTOS_ENTIDAD_COLI_CONLIQUIDA_APROVECHAMIENTO;
	}
	
	
	

}
