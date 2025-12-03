package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the cosu_consuscrip database table.
 * 
 */
@Entity
@Table(name = "cosu_consuscrip")
@NamedQuery(name = "CosuConsuscrip.findAll", query = "SELECT c FROM CosuConsuscrip c")
public class CosuConsuscrip implements Serializable {
	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_COSU_CONSUSCRIP_PK = "cosuIderegistr";
	public static final String ENTIDAD_COSU_CONSUSCRIP_COSU_CANTIDAD = "cosuCantidad";
	public static final String ENTIDAD_COSU_CONSUSCRIP_COSU_ESTADO = "cicDiainicia";
	public static final String ENTIDAD_COSU_CONSUSCRIP_COSU_FECFINAL = "cicDiafinaliza";
	public static final String ENTIDAD_COSU_CONSUSCRIP_COSU_FECINICIO = "cicEstado";
	public static final String ENTIDAD_COSU_CONSUSCRIP_COSU_VLRTOTAL = "cicPeriodos";
	public static final String ENTIDAD_COSU_CONSUSCRIP_COSU_VLRUNITARI = "cicAnoactual";
	public static final String ENTIDAD_COSU_CONSUSCRIP_UNI_CONCEPTO = "usuIderegistro";
	public static final String ENTIDAD_COSU_CONSUSCRIP_UNI_LIQUIDACION = "usuIderegistro";
	public static final String ENTIDAD_COSU_CONSUSCRIP_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_COSU_CONSUSCRIP_DSUS_IDEREGISTR = "dsusIderegistr";
	public static final String ENTIDAD_COSU_CONSUSCRIP_EMP_IDEREGISTRO = "empIderegistro";
	private static final String[] ATRIBUTOS_ENTIDAD_COSU_CONSUSCRIP = { ENTIDAD_COSU_CONSUSCRIP_PK,
			ENTIDAD_COSU_CONSUSCRIP_COSU_CANTIDAD, ENTIDAD_COSU_CONSUSCRIP_COSU_ESTADO,
			ENTIDAD_COSU_CONSUSCRIP_COSU_FECFINAL, ENTIDAD_COSU_CONSUSCRIP_COSU_FECINICIO,
			ENTIDAD_COSU_CONSUSCRIP_COSU_VLRTOTAL, ENTIDAD_COSU_CONSUSCRIP_COSU_VLRUNITARI,
			ENTIDAD_COSU_CONSUSCRIP_UNI_CONCEPTO, ENTIDAD_COSU_CONSUSCRIP_UNI_LIQUIDACION,
			ENTIDAD_COSU_CONSUSCRIP_USU_IDEREGISTRO, ENTIDAD_COSU_CONSUSCRIP_DSUS_IDEREGISTR,
			ENTIDAD_COSU_CONSUSCRIP_EMP_IDEREGISTRO };

	@Id
	@SequenceGenerator(name = "sq_cosu_ideregistr", sequenceName = "sq_cosu_ideregistr", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sq_cosu_ideregistr")
	@Column(name = "cosu_ideregistr")
	private Integer cosuIderegistr;

	@Column(name = "cosu_cantidad")
	private BigDecimal cosuCantidad;

	@Column(name = "cosu_estado")
	private String cosuEstado;

	@Column(name = "cosu_fecfinal")
	private Timestamp cosuFecfinal;

	@Column(name = "cosu_fecinicio")
	private Timestamp cosuFecinicio;

	@Column(name = "cosu_vlrtotal")
	private BigDecimal cosuVlrtotal;

	@Column(name = "cosu_vlrunitari")
	private BigDecimal cosuVlrunitari;

	@Column(name = "uni_concepto")
	private Integer uniConcepto;

	@Column(name = "uni_liquidacion")
	private Integer uniLiquidacion;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	@PodamExclude
	@Column(name = "dsus_ideregistr")
	private Long dsusIderegistr;

	@PodamExclude
	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;

	// bi-directional many-to-one association to DsusDetsuscrip
	@ManyToOne
	@JoinColumns({ @JoinColumn(name = "dsus_ideregistr", referencedColumnName = "dsus_ideregistr", insertable = false, updatable = false),
			@JoinColumn(name = "emp_ideregistro", referencedColumnName = "emp_ideregistro", insertable = false, updatable = false) })
	@PodamExclude
	private DsusDetsuscrip dsusDetsuscrip;

	public CosuConsuscrip() {
		//constructor por defecto
	}

	public Integer getCosuIderegistr() {
		return this.cosuIderegistr;
	}

	public void setCosuIderegistr(Integer cosuIderegistr) {
		this.cosuIderegistr = cosuIderegistr;
	}

	public BigDecimal getCosuCantidad() {
		return this.cosuCantidad;
	}

	public void setCosuCantidad(BigDecimal cosuCantidad) {
		this.cosuCantidad = cosuCantidad;
	}

	public String getCosuEstado() {
		return this.cosuEstado;
	}

	public void setCosuEstado(String cosuEstado) {
		this.cosuEstado = cosuEstado;
	}

	public Timestamp getCosuFecfinal() {
		return this.cosuFecfinal;
	}

	public void setCosuFecfinal(Timestamp cosuFecfinal) {
		this.cosuFecfinal = cosuFecfinal;
	}

	public Timestamp getCosuFecinicio() {
		return this.cosuFecinicio;
	}

	public void setCosuFecinicio(Timestamp cosuFecinicio) {
		this.cosuFecinicio = cosuFecinicio;
	}

	public BigDecimal getCosuVlrtotal() {
		return this.cosuVlrtotal;
	}

	public void setCosuVlrtotal(BigDecimal cosuVlrtotal) {
		this.cosuVlrtotal = cosuVlrtotal;
	}

	public BigDecimal getCosuVlrunitari() {
		return this.cosuVlrunitari;
	}

	public void setCosuVlrunitari(BigDecimal cosuVlrunitari) {
		this.cosuVlrunitari = cosuVlrunitari;
	}

	public Integer getUniConcepto() {
		return this.uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public Integer getUniLiquidacion() {
		return this.uniLiquidacion;
	}

	public void setUniLiquidacion(Integer uniLiquidacion) {
		this.uniLiquidacion = uniLiquidacion;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public DsusDetsuscrip getDsusDetsuscrip() {
		return this.dsusDetsuscrip;
	}

	public void setDsusDetsuscrip(DsusDetsuscrip dsusDetsuscrip) {
		this.dsusDetsuscrip = dsusDetsuscrip;
	}

	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Long getDsusIderegistr() {
		return dsusIderegistr;
	}

	public void setDsusIderegistr(Long dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_COSU_CONSUSCRIP) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadCosuConsuscrip() {
		return ATRIBUTOS_ENTIDAD_COSU_CONSUSCRIP;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cosuCantidad == null) ? 0 : cosuCantidad.hashCode());
		result = prime * result + ((cosuEstado == null) ? 0 : cosuEstado.hashCode());
		result = prime * result + ((cosuFecfinal == null) ? 0 : cosuFecfinal.hashCode());
		result = prime * result + ((cosuFecinicio == null) ? 0 : cosuFecinicio.hashCode());
		result = prime * result + ((cosuIderegistr == null) ? 0 : cosuIderegistr.hashCode());
		result = prime * result + ((cosuVlrtotal == null) ? 0 : cosuVlrtotal.hashCode());
		result = prime * result + ((cosuVlrunitari == null) ? 0 : cosuVlrunitari.hashCode());
		result = prime * result + ((dsusIderegistr == null) ? 0 : dsusIderegistr.hashCode());
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((uniConcepto == null) ? 0 : uniConcepto.hashCode());
		result = prime * result + ((uniLiquidacion == null) ? 0 : uniLiquidacion.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CosuConsuscrip other = (CosuConsuscrip) obj;
		if (cosuCantidad == null) {
			if (other.cosuCantidad != null)
				return false;
		} else if (!cosuCantidad.equals(other.cosuCantidad))
			return false;
		if (cosuEstado == null) {
			if (other.cosuEstado != null)
				return false;
		} else if (!cosuEstado.equals(other.cosuEstado))
			return false;
		if (cosuFecfinal == null) {
			if (other.cosuFecfinal != null)
				return false;
		} else if (!cosuFecfinal.equals(other.cosuFecfinal))
			return false;
		if (cosuFecinicio == null) {
			if (other.cosuFecinicio != null)
				return false;
		} else if (!cosuFecinicio.equals(other.cosuFecinicio))
			return false;
		if (cosuIderegistr == null) {
			if (other.cosuIderegistr != null)
				return false;
		} else if (!cosuIderegistr.equals(other.cosuIderegistr))
			return false;
		if (cosuVlrtotal == null) {
			if (other.cosuVlrtotal != null)
				return false;
		} else if (!cosuVlrtotal.equals(other.cosuVlrtotal))
			return false;
		if (cosuVlrunitari == null) {
			if (other.cosuVlrunitari != null)
				return false;
		} else if (!cosuVlrunitari.equals(other.cosuVlrunitari))
			return false;
		if (dsusIderegistr == null) {
			if (other.dsusIderegistr != null)
				return false;
		} else if (!dsusIderegistr.equals(other.dsusIderegistr))
			return false;
		if (empIderegistro == null) {
			if (other.empIderegistro != null)
				return false;
		} else if (!empIderegistro.equals(other.empIderegistro))
			return false;
		if (uniConcepto == null) {
			if (other.uniConcepto != null)
				return false;
		} else if (!uniConcepto.equals(other.uniConcepto))
			return false;
		if (uniLiquidacion == null) {
			if (other.uniLiquidacion != null)
				return false;
		} else if (!uniLiquidacion.equals(other.uniLiquidacion))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}