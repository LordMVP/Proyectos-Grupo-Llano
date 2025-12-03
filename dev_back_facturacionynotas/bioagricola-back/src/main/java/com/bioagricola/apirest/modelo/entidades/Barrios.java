package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;

import uk.co.jemos.podam.annotations.PodamExclude;


/**
 * The persistent class for the barrios database table.
 * 
 */
@Entity
@NamedQuery(name="Barrios.findAll", query="SELECT b FROM Barrios b")
public class Barrios implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="barrio_llacom")
	private String barrioLlacom;

	@Column(name="barrio_cod")
	private String barrioCod;

	@Column(name="barrio_codpro")
	private String barrioCodpro;

	@Column(name="barrio_factor")
	private BigDecimal barrioFactor;

	@Column(name="barrio_frerec")
	private String barrioFrerec;

	@Column(name="barrio_horrec")
	private String barrioHorrec;

	@Column(name="barrio_ideregistro")
	private Integer barrioIderegistro;

	@Column(name="barrio_nom")
	private String barrioNom;

	@Column(name="barrio_porins")
	private BigDecimal barrioPorins;

	@Column(name="barrio_sectec")
	private BigDecimal barrioSectec;

	@Column(name="barrio_swtter")
	private Boolean barrioSwtter;

	//bi-directional many-to-one association to Empresas
	@ManyToOne
	@JoinColumn(name="barrio_codemp", referencedColumnName="empresa_cod")
	@PodamExclude
	private Empresas empresa;

	public Barrios() {
		//constructor por defecto
	}

	public String getBarrioLlacom() {
		return this.barrioLlacom;
	}

	public void setBarrioLlacom(String barrioLlacom) {
		this.barrioLlacom = barrioLlacom;
	}

	public String getBarrioCod() {
		return this.barrioCod;
	}

	public void setBarrioCod(String barrioCod) {
		this.barrioCod = barrioCod;
	}

	public String getBarrioCodpro() {
		return this.barrioCodpro;
	}

	public void setBarrioCodpro(String barrioCodpro) {
		this.barrioCodpro = barrioCodpro;
	}

	public BigDecimal getBarrioFactor() {
		return this.barrioFactor;
	}

	public void setBarrioFactor(BigDecimal barrioFactor) {
		this.barrioFactor = barrioFactor;
	}

	public String getBarrioFrerec() {
		return this.barrioFrerec;
	}

	public void setBarrioFrerec(String barrioFrerec) {
		this.barrioFrerec = barrioFrerec;
	}

	public String getBarrioHorrec() {
		return this.barrioHorrec;
	}

	public void setBarrioHorrec(String barrioHorrec) {
		this.barrioHorrec = barrioHorrec;
	}

	public Integer getBarrioIderegistro() {
		return this.barrioIderegistro;
	}

	public void setBarrioIderegistro(Integer barrioIderegistro) {
		this.barrioIderegistro = barrioIderegistro;
	}

	public String getBarrioNom() {
		return this.barrioNom;
	}

	public void setBarrioNom(String barrioNom) {
		this.barrioNom = barrioNom;
	}

	public BigDecimal getBarrioPorins() {
		return this.barrioPorins;
	}

	public void setBarrioPorins(BigDecimal barrioPorins) {
		this.barrioPorins = barrioPorins;
	}

	public BigDecimal getBarrioSectec() {
		return this.barrioSectec;
	}

	public void setBarrioSectec(BigDecimal barrioSectec) {
		this.barrioSectec = barrioSectec;
	}

	public Boolean getBarrioSwtter() {
		return this.barrioSwtter;
	}

	public void setBarrioSwtter(Boolean barrioSwtter) {
		this.barrioSwtter = barrioSwtter;
	}

	public Empresas getEmpresa() {
		return this.empresa;
	}

	public void setEmpresa(Empresas empresa) {
		this.empresa = empresa;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((barrioCod == null) ? 0 : barrioCod.hashCode());
		result = prime * result + ((barrioCodpro == null) ? 0 : barrioCodpro.hashCode());
		result = prime * result + ((barrioFactor == null) ? 0 : barrioFactor.hashCode());
		result = prime * result + ((barrioFrerec == null) ? 0 : barrioFrerec.hashCode());
		result = prime * result + ((barrioHorrec == null) ? 0 : barrioHorrec.hashCode());
		result = prime * result + ((barrioIderegistro == null) ? 0 : barrioIderegistro.hashCode());
		result = prime * result + ((barrioLlacom == null) ? 0 : barrioLlacom.hashCode());
		result = prime * result + ((barrioNom == null) ? 0 : barrioNom.hashCode());
		result = prime * result + ((barrioPorins == null) ? 0 : barrioPorins.hashCode());
		result = prime * result + ((barrioSectec == null) ? 0 : barrioSectec.hashCode());
		result = prime * result + ((barrioSwtter == null) ? 0 : barrioSwtter.hashCode());
		result = prime * result + ((empresa == null) ? 0 : empresa.hashCode());
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
		Barrios other = (Barrios) obj;
		if (barrioCod == null) {
			if (other.barrioCod != null)
				return false;
		} else if (!barrioCod.equals(other.barrioCod))
			return false;
		if (barrioCodpro == null) {
			if (other.barrioCodpro != null)
				return false;
		} else if (!barrioCodpro.equals(other.barrioCodpro))
			return false;
		if (barrioFactor == null) {
			if (other.barrioFactor != null)
				return false;
		} else if (!barrioFactor.equals(other.barrioFactor))
			return false;
		if (barrioFrerec == null) {
			if (other.barrioFrerec != null)
				return false;
		} else if (!barrioFrerec.equals(other.barrioFrerec))
			return false;
		if (barrioHorrec == null) {
			if (other.barrioHorrec != null)
				return false;
		} else if (!barrioHorrec.equals(other.barrioHorrec))
			return false;
		if (barrioIderegistro == null) {
			if (other.barrioIderegistro != null)
				return false;
		} else if (!barrioIderegistro.equals(other.barrioIderegistro))
			return false;
		if (barrioLlacom == null) {
			if (other.barrioLlacom != null)
				return false;
		} else if (!barrioLlacom.equals(other.barrioLlacom))
			return false;
		if (barrioNom == null) {
			if (other.barrioNom != null)
				return false;
		} else if (!barrioNom.equals(other.barrioNom))
			return false;
		if (barrioPorins == null) {
			if (other.barrioPorins != null)
				return false;
		} else if (!barrioPorins.equals(other.barrioPorins))
			return false;
		if (barrioSectec == null) {
			if (other.barrioSectec != null)
				return false;
		} else if (!barrioSectec.equals(other.barrioSectec))
			return false;
		if (barrioSwtter == null) {
			if (other.barrioSwtter != null)
				return false;
		} else if (!barrioSwtter.equals(other.barrioSwtter))
			return false;
		if (empresa == null) {
			if (other.empresa != null)
				return false;
		} else if (!empresa.equals(other.empresa))
			return false;
		return true;
	}

}