package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


/**
 * The persistent class for the dfac_detnovedad database table.
 * 
 */
@Entity
@Table(name="dfac_detnovedad")
@NamedQuery(name="DfacDetnovedad.findAll", query="SELECT d FROM DfacDetnovedad d")
public class DfacDetnovedad implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "sq_dnov_ideregistr", sequenceName = "sq_dnov_ideregistr", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sq_dnov_ideregistr")
	@Column(name="dfac_ideregistr")
	private Long dfacIderegistr;

	@Column(name="damo_ideregistr")
	private Long damoIderegistr;

	@Column(name="dfac_cantidad")
	private BigDecimal dfacCantidad;

	@Column(name="dfac_diferencia")
	private Long dfacDiferencia;

	@Column(name="dfac_estado")
	private String dfacEstado;

	@Column(name="dfac_ideorigen")
	private Long dfacIdeorigen;

	@Column(name="dfac_idepadre")
	private Long dfacIdepadre;

	@Column(name="dfac_sdoreal")
	private BigDecimal dfacSdoreal;

	@Column(name="dfac_version")
	private Integer dfacVersion;

	@Column(name="dfac_vlrreal")
	private BigDecimal dfacVlrreal;

	@Column(name="dfac_vlrtotal")
	private BigDecimal dfacVlrtotal;

	@Column(name="dfac_vlrunitari")
	private BigDecimal dfacVlrunitari;

	@Column(name="dfin_ideregistr")
	private Long dfinIderegistr;

	@Column(name="fac_ideregistro")
	private Long facIderegistro;

	@Column(name="mvmc_ideregistr")
	private Long mvmcIderegistr;

	@Column(name="sco_ideregistro")
	private Long scoIderegistro;

	@Column(name="uni_concepto")
	private Integer uniConcepto;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;
	
	@Column(name="tipo_nota")
	private Integer tipoNota;
	

	public DfacDetnovedad() {
		// constructor por default
	}

	public Integer getTipoNota() {
		return tipoNota;
	}

	public void setTipoNota(Integer tipoNota) {
		this.tipoNota = tipoNota;
	}

	public Long getDfacIderegistr() {
		return this.dfacIderegistr;
	}

	public void setDfacIderegistr(Long dfacIderegistr) {
		this.dfacIderegistr = dfacIderegistr;
	}

	public Long getDamoIderegistr() {
		return this.damoIderegistr;
	}

	public void setDamoIderegistr(Long damoIderegistr) {
		this.damoIderegistr = damoIderegistr;
	}

	public BigDecimal getDfacCantidad() {
		return this.dfacCantidad;
	}

	public void setDfacCantidad(BigDecimal dfacCantidad) {
		this.dfacCantidad = dfacCantidad;
	}

	public Long getDfacDiferencia() {
		return this.dfacDiferencia;
	}

	public void setDfacDiferencia(Long dfacDiferencia) {
		this.dfacDiferencia = dfacDiferencia;
	}

	public String getDfacEstado() {
		return this.dfacEstado;
	}

	public void setDfacEstado(String dfacEstado) {
		this.dfacEstado = dfacEstado;
	}

	public Long getDfacIdeorigen() {
		return this.dfacIdeorigen;
	}

	public void setDfacIdeorigen(Long dfacIdeorigen) {
		this.dfacIdeorigen = dfacIdeorigen;
	}

	public Long getDfacIdepadre() {
		return this.dfacIdepadre;
	}

	public void setDfacIdepadre(Long dfacIdepadre) {
		this.dfacIdepadre = dfacIdepadre;
	}

	public BigDecimal getDfacSdoreal() {
		return this.dfacSdoreal;
	}

	public void setDfacSdoreal(BigDecimal dfacSdoreal) {
		this.dfacSdoreal = dfacSdoreal;
	}

	public Integer getDfacVersion() {
		return this.dfacVersion;
	}

	public void setDfacVersion(Integer dfacVersion) {
		this.dfacVersion = dfacVersion;
	}

	public BigDecimal getDfacVlrreal() {
		return this.dfacVlrreal;
	}

	public void setDfacVlrreal(BigDecimal dfacVlrreal) {
		this.dfacVlrreal = dfacVlrreal;
	}

	public BigDecimal getDfacVlrtotal() {
		return this.dfacVlrtotal;
	}

	public void setDfacVlrtotal(BigDecimal dfacVlrtotal) {
		this.dfacVlrtotal = dfacVlrtotal;
	}

	public BigDecimal getDfacVlrunitari() {
		return this.dfacVlrunitari;
	}

	public void setDfacVlrunitari(BigDecimal dfacVlrunitari) {
		this.dfacVlrunitari = dfacVlrunitari;
	}

	public Long getDfinIderegistr() {
		return this.dfinIderegistr;
	}

	public void setDfinIderegistr(Long dfinIderegistr) {
		this.dfinIderegistr = dfinIderegistr;
	}

	public Long getFacIderegistro() {
		return this.facIderegistro;
	}

	public void setFacIderegistro(Long facIderegistro) {
		this.facIderegistro = facIderegistro;
	}

	public Long getMvmcIderegistr() {
		return this.mvmcIderegistr;
	}

	public void setMvmcIderegistr(Long mvmcIderegistr) {
		this.mvmcIderegistr = mvmcIderegistr;
	}

	public Long getScoIderegistro() {
		return this.scoIderegistro;
	}

	public void setScoIderegistro(Long scoIderegistro) {
		this.scoIderegistro = scoIderegistro;
	}

	public Integer getUniConcepto() {
		return this.uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}
	
	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((damoIderegistr == null) ? 0 : damoIderegistr.hashCode());
		result = prime * result + ((dfacCantidad == null) ? 0 : dfacCantidad.hashCode());
		result = prime * result + ((dfacDiferencia == null) ? 0 : dfacDiferencia.hashCode());
		result = prime * result + ((dfacEstado == null) ? 0 : dfacEstado.hashCode());
		result = prime * result + ((dfacIdeorigen == null) ? 0 : dfacIdeorigen.hashCode());
		result = prime * result + ((dfacIdepadre == null) ? 0 : dfacIdepadre.hashCode());
		result = prime * result + ((dfacIderegistr == null) ? 0 : dfacIderegistr.hashCode());
		result = prime * result + ((dfacSdoreal == null) ? 0 : dfacSdoreal.hashCode());
		result = prime * result + ((dfacVersion == null) ? 0 : dfacVersion.hashCode());
		result = prime * result + ((dfacVlrreal == null) ? 0 : dfacVlrreal.hashCode());
		result = prime * result + ((dfacVlrtotal == null) ? 0 : dfacVlrtotal.hashCode());
		result = prime * result + ((dfacVlrunitari == null) ? 0 : dfacVlrunitari.hashCode());
		result = prime * result + ((dfinIderegistr == null) ? 0 : dfinIderegistr.hashCode());
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((facIderegistro == null) ? 0 : facIderegistro.hashCode());
		result = prime * result + ((mvmcIderegistr == null) ? 0 : mvmcIderegistr.hashCode());
		result = prime * result + ((scoIderegistro == null) ? 0 : scoIderegistro.hashCode());
		result = prime * result + ((tipoNota == null) ? 0 : tipoNota.hashCode());
		result = prime * result + ((uniConcepto == null) ? 0 : uniConcepto.hashCode());
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
		DfacDetnovedad other = (DfacDetnovedad) obj;
		if (damoIderegistr == null) {
			if (other.damoIderegistr != null)
				return false;
		} else if (!damoIderegistr.equals(other.damoIderegistr))
			return false;
		if (dfacCantidad == null) {
			if (other.dfacCantidad != null)
				return false;
		} else if (!dfacCantidad.equals(other.dfacCantidad))
			return false;
		if (dfacDiferencia == null) {
			if (other.dfacDiferencia != null)
				return false;
		} else if (!dfacDiferencia.equals(other.dfacDiferencia))
			return false;
		if (dfacEstado == null) {
			if (other.dfacEstado != null)
				return false;
		} else if (!dfacEstado.equals(other.dfacEstado))
			return false;
		if (dfacIdeorigen == null) {
			if (other.dfacIdeorigen != null)
				return false;
		} else if (!dfacIdeorigen.equals(other.dfacIdeorigen))
			return false;
		if (dfacIdepadre == null) {
			if (other.dfacIdepadre != null)
				return false;
		} else if (!dfacIdepadre.equals(other.dfacIdepadre))
			return false;
		if (dfacIderegistr == null) {
			if (other.dfacIderegistr != null)
				return false;
		} else if (!dfacIderegistr.equals(other.dfacIderegistr))
			return false;
		if (dfacSdoreal == null) {
			if (other.dfacSdoreal != null)
				return false;
		} else if (!dfacSdoreal.equals(other.dfacSdoreal))
			return false;
		if (dfacVersion == null) {
			if (other.dfacVersion != null)
				return false;
		} else if (!dfacVersion.equals(other.dfacVersion))
			return false;
		if (dfacVlrreal == null) {
			if (other.dfacVlrreal != null)
				return false;
		} else if (!dfacVlrreal.equals(other.dfacVlrreal))
			return false;
		if (dfacVlrtotal == null) {
			if (other.dfacVlrtotal != null)
				return false;
		} else if (!dfacVlrtotal.equals(other.dfacVlrtotal))
			return false;
		if (dfacVlrunitari == null) {
			if (other.dfacVlrunitari != null)
				return false;
		} else if (!dfacVlrunitari.equals(other.dfacVlrunitari))
			return false;
		if (dfinIderegistr == null) {
			if (other.dfinIderegistr != null)
				return false;
		} else if (!dfinIderegistr.equals(other.dfinIderegistr))
			return false;
		if (empIderegistro == null) {
			if (other.empIderegistro != null)
				return false;
		} else if (!empIderegistro.equals(other.empIderegistro))
			return false;
		if (facIderegistro == null) {
			if (other.facIderegistro != null)
				return false;
		} else if (!facIderegistro.equals(other.facIderegistro))
			return false;
		if (mvmcIderegistr == null) {
			if (other.mvmcIderegistr != null)
				return false;
		} else if (!mvmcIderegistr.equals(other.mvmcIderegistr))
			return false;
		if (scoIderegistro == null) {
			if (other.scoIderegistro != null)
				return false;
		} else if (!scoIderegistro.equals(other.scoIderegistro))
			return false;
		if (tipoNota == null) {
			if (other.tipoNota != null)
				return false;
		} else if (!tipoNota.equals(other.tipoNota))
			return false;
		if (uniConcepto == null) {
			if (other.uniConcepto != null)
				return false;
		} else if (!uniConcepto.equals(other.uniConcepto))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}