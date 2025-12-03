package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;


/**
 * The persistent class for the servicios database table.
 * 
 */
@Entity
@Table(name="servicios")
@NamedQuery(name="Servicios.findAll", query="SELECT s FROM Servicios s")
public class Servicios implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="servicio_llacom")
	private String servicioLlacom;

	@Column(name="emp_ideregistro")
	private Integer empIderegistro;

	@Column(name="servicio_adjuntoreial")
	private Boolean servicioAdjuntoreial;

	@Column(name="servicio_cod")
	private String servicioCod;

	@Column(name="servicio_coddepemp")
	private String servicioCoddepemp;

	@Column(name="servicio_codemp")
	private String servicioCodemp;

	@Column(name="servicio_codpro")
	private String servicioCodpro;

	@Column(name="servicio_etaant")
	private String servicioEtaant;

	@Column(name="servicio_etasig")
	private String servicioEtasig;

	@Column(name="servicio_fecgra")
	private Timestamp servicioFecgra;

	@Column(name="servicio_genaut")
	private Boolean servicioGenaut;

	@Column(name="servicio_itedep")
	private String servicioItedep;

	@Column(name="servicio_niv")
	private BigDecimal servicioNiv;

	@Column(name="servicio_nom")
	private String servicioNom;

	@Column(name="servicio_nomarc")
	private String servicioNomarc;

	@Column(name="servicio_ordser")
	private BigDecimal servicioOrdser;

	@Column(name="servicio_porimp")
	private BigDecimal servicioPorimp;

	@Column(name="servicio_porval")
	private BigDecimal servicioPorval;

	@Column(name="servicio_swtact")
	private Boolean servicioSwtact;

	@Column(name="servicio_swtord")
	private Boolean servicioSwtord;

	@Column(name="servicio_swtpro")
	private Boolean servicioSwtpro;

	@Column(name="servicio_swtsal")
	private Boolean servicioSwtsal;

	@Column(name="servicio_usugra")
	private String servicioUsugra;

	@Column(name="servicio_valuni")
	private BigDecimal servicioValuni;

	@Column(name="servicio_vlrvencon")
	private BigDecimal servicioVlrvencon;

	public Servicios() {
	}

	public String getServicioLlacom() {
		return this.servicioLlacom;
	}

	public void setServicioLlacom(String servicioLlacom) {
		this.servicioLlacom = servicioLlacom;
	}

	public Integer getEmpIderegistro() {
		return this.empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Boolean getServicioAdjuntoreial() {
		return this.servicioAdjuntoreial;
	}

	public void setServicioAdjuntoreial(Boolean servicioAdjuntoreial) {
		this.servicioAdjuntoreial = servicioAdjuntoreial;
	}

	public String getServicioCod() {
		return this.servicioCod;
	}

	public void setServicioCod(String servicioCod) {
		this.servicioCod = servicioCod;
	}

	public String getServicioCoddepemp() {
		return this.servicioCoddepemp;
	}

	public void setServicioCoddepemp(String servicioCoddepemp) {
		this.servicioCoddepemp = servicioCoddepemp;
	}

	public String getServicioCodemp() {
		return this.servicioCodemp;
	}

	public void setServicioCodemp(String servicioCodemp) {
		this.servicioCodemp = servicioCodemp;
	}

	public String getServicioCodpro() {
		return this.servicioCodpro;
	}

	public void setServicioCodpro(String servicioCodpro) {
		this.servicioCodpro = servicioCodpro;
	}

	public String getServicioEtaant() {
		return this.servicioEtaant;
	}

	public void setServicioEtaant(String servicioEtaant) {
		this.servicioEtaant = servicioEtaant;
	}

	public String getServicioEtasig() {
		return this.servicioEtasig;
	}

	public void setServicioEtasig(String servicioEtasig) {
		this.servicioEtasig = servicioEtasig;
	}

	public Timestamp getServicioFecgra() {
		return this.servicioFecgra;
	}

	public void setServicioFecgra(Timestamp servicioFecgra) {
		this.servicioFecgra = servicioFecgra;
	}

	public Boolean getServicioGenaut() {
		return this.servicioGenaut;
	}

	public void setServicioGenaut(Boolean servicioGenaut) {
		this.servicioGenaut = servicioGenaut;
	}

	public String getServicioItedep() {
		return this.servicioItedep;
	}

	public void setServicioItedep(String servicioItedep) {
		this.servicioItedep = servicioItedep;
	}

	public BigDecimal getServicioNiv() {
		return this.servicioNiv;
	}

	public void setServicioNiv(BigDecimal servicioNiv) {
		this.servicioNiv = servicioNiv;
	}

	public String getServicioNom() {
		return this.servicioNom;
	}

	public void setServicioNom(String servicioNom) {
		this.servicioNom = servicioNom;
	}

	public String getServicioNomarc() {
		return this.servicioNomarc;
	}

	public void setServicioNomarc(String servicioNomarc) {
		this.servicioNomarc = servicioNomarc;
	}

	public BigDecimal getServicioOrdser() {
		return this.servicioOrdser;
	}

	public void setServicioOrdser(BigDecimal servicioOrdser) {
		this.servicioOrdser = servicioOrdser;
	}

	public BigDecimal getServicioPorimp() {
		return this.servicioPorimp;
	}

	public void setServicioPorimp(BigDecimal servicioPorimp) {
		this.servicioPorimp = servicioPorimp;
	}

	public BigDecimal getServicioPorval() {
		return this.servicioPorval;
	}

	public void setServicioPorval(BigDecimal servicioPorval) {
		this.servicioPorval = servicioPorval;
	}

	public Boolean getServicioSwtact() {
		return this.servicioSwtact;
	}

	public void setServicioSwtact(Boolean servicioSwtact) {
		this.servicioSwtact = servicioSwtact;
	}

	public Boolean getServicioSwtord() {
		return this.servicioSwtord;
	}

	public void setServicioSwtord(Boolean servicioSwtord) {
		this.servicioSwtord = servicioSwtord;
	}

	public Boolean getServicioSwtpro() {
		return this.servicioSwtpro;
	}

	public void setServicioSwtpro(Boolean servicioSwtpro) {
		this.servicioSwtpro = servicioSwtpro;
	}

	public Boolean getServicioSwtsal() {
		return this.servicioSwtsal;
	}

	public void setServicioSwtsal(Boolean servicioSwtsal) {
		this.servicioSwtsal = servicioSwtsal;
	}

	public String getServicioUsugra() {
		return this.servicioUsugra;
	}

	public void setServicioUsugra(String servicioUsugra) {
		this.servicioUsugra = servicioUsugra;
	}

	public BigDecimal getServicioValuni() {
		return this.servicioValuni;
	}

	public void setServicioValuni(BigDecimal servicioValuni) {
		this.servicioValuni = servicioValuni;
	}

	public BigDecimal getServicioVlrvencon() {
		return this.servicioVlrvencon;
	}

	public void setServicioVlrvencon(BigDecimal servicioVlrvencon) {
		this.servicioVlrvencon = servicioVlrvencon;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((servicioAdjuntoreial == null) ? 0 : servicioAdjuntoreial.hashCode());
		result = prime * result + ((servicioCod == null) ? 0 : servicioCod.hashCode());
		result = prime * result + ((servicioCoddepemp == null) ? 0 : servicioCoddepemp.hashCode());
		result = prime * result + ((servicioCodemp == null) ? 0 : servicioCodemp.hashCode());
		result = prime * result + ((servicioCodpro == null) ? 0 : servicioCodpro.hashCode());
		result = prime * result + ((servicioEtaant == null) ? 0 : servicioEtaant.hashCode());
		result = prime * result + ((servicioEtasig == null) ? 0 : servicioEtasig.hashCode());
		result = prime * result + ((servicioFecgra == null) ? 0 : servicioFecgra.hashCode());
		result = prime * result + ((servicioGenaut == null) ? 0 : servicioGenaut.hashCode());
		result = prime * result + ((servicioItedep == null) ? 0 : servicioItedep.hashCode());
		result = prime * result + ((servicioLlacom == null) ? 0 : servicioLlacom.hashCode());
		result = prime * result + ((servicioNiv == null) ? 0 : servicioNiv.hashCode());
		result = prime * result + ((servicioNom == null) ? 0 : servicioNom.hashCode());
		result = prime * result + ((servicioNomarc == null) ? 0 : servicioNomarc.hashCode());
		result = prime * result + ((servicioOrdser == null) ? 0 : servicioOrdser.hashCode());
		result = prime * result + ((servicioPorimp == null) ? 0 : servicioPorimp.hashCode());
		result = prime * result + ((servicioPorval == null) ? 0 : servicioPorval.hashCode());
		result = prime * result + ((servicioSwtact == null) ? 0 : servicioSwtact.hashCode());
		result = prime * result + ((servicioSwtord == null) ? 0 : servicioSwtord.hashCode());
		result = prime * result + ((servicioSwtpro == null) ? 0 : servicioSwtpro.hashCode());
		result = prime * result + ((servicioSwtsal == null) ? 0 : servicioSwtsal.hashCode());
		result = prime * result + ((servicioUsugra == null) ? 0 : servicioUsugra.hashCode());
		result = prime * result + ((servicioValuni == null) ? 0 : servicioValuni.hashCode());
		result = prime * result + ((servicioVlrvencon == null) ? 0 : servicioVlrvencon.hashCode());
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
		Servicios other = (Servicios) obj;
		if (empIderegistro == null) {
			if (other.empIderegistro != null)
				return false;
		} else if (!empIderegistro.equals(other.empIderegistro))
			return false;
		if (servicioAdjuntoreial == null) {
			if (other.servicioAdjuntoreial != null)
				return false;
		} else if (!servicioAdjuntoreial.equals(other.servicioAdjuntoreial))
			return false;
		if (servicioCod == null) {
			if (other.servicioCod != null)
				return false;
		} else if (!servicioCod.equals(other.servicioCod))
			return false;
		if (servicioCoddepemp == null) {
			if (other.servicioCoddepemp != null)
				return false;
		} else if (!servicioCoddepemp.equals(other.servicioCoddepemp))
			return false;
		if (servicioCodemp == null) {
			if (other.servicioCodemp != null)
				return false;
		} else if (!servicioCodemp.equals(other.servicioCodemp))
			return false;
		if (servicioCodpro == null) {
			if (other.servicioCodpro != null)
				return false;
		} else if (!servicioCodpro.equals(other.servicioCodpro))
			return false;
		if (servicioEtaant == null) {
			if (other.servicioEtaant != null)
				return false;
		} else if (!servicioEtaant.equals(other.servicioEtaant))
			return false;
		if (servicioEtasig == null) {
			if (other.servicioEtasig != null)
				return false;
		} else if (!servicioEtasig.equals(other.servicioEtasig))
			return false;
		if (servicioFecgra == null) {
			if (other.servicioFecgra != null)
				return false;
		} else if (!servicioFecgra.equals(other.servicioFecgra))
			return false;
		if (servicioGenaut == null) {
			if (other.servicioGenaut != null)
				return false;
		} else if (!servicioGenaut.equals(other.servicioGenaut))
			return false;
		if (servicioItedep == null) {
			if (other.servicioItedep != null)
				return false;
		} else if (!servicioItedep.equals(other.servicioItedep))
			return false;
		if (servicioLlacom == null) {
			if (other.servicioLlacom != null)
				return false;
		} else if (!servicioLlacom.equals(other.servicioLlacom))
			return false;
		if (servicioNiv == null) {
			if (other.servicioNiv != null)
				return false;
		} else if (!servicioNiv.equals(other.servicioNiv))
			return false;
		if (servicioNom == null) {
			if (other.servicioNom != null)
				return false;
		} else if (!servicioNom.equals(other.servicioNom))
			return false;
		if (servicioNomarc == null) {
			if (other.servicioNomarc != null)
				return false;
		} else if (!servicioNomarc.equals(other.servicioNomarc))
			return false;
		if (servicioOrdser == null) {
			if (other.servicioOrdser != null)
				return false;
		} else if (!servicioOrdser.equals(other.servicioOrdser))
			return false;
		if (servicioPorimp == null) {
			if (other.servicioPorimp != null)
				return false;
		} else if (!servicioPorimp.equals(other.servicioPorimp))
			return false;
		if (servicioPorval == null) {
			if (other.servicioPorval != null)
				return false;
		} else if (!servicioPorval.equals(other.servicioPorval))
			return false;
		if (servicioSwtact == null) {
			if (other.servicioSwtact != null)
				return false;
		} else if (!servicioSwtact.equals(other.servicioSwtact))
			return false;
		if (servicioSwtord == null) {
			if (other.servicioSwtord != null)
				return false;
		} else if (!servicioSwtord.equals(other.servicioSwtord))
			return false;
		if (servicioSwtpro == null) {
			if (other.servicioSwtpro != null)
				return false;
		} else if (!servicioSwtpro.equals(other.servicioSwtpro))
			return false;
		if (servicioSwtsal == null) {
			if (other.servicioSwtsal != null)
				return false;
		} else if (!servicioSwtsal.equals(other.servicioSwtsal))
			return false;
		if (servicioUsugra == null) {
			if (other.servicioUsugra != null)
				return false;
		} else if (!servicioUsugra.equals(other.servicioUsugra))
			return false;
		if (servicioValuni == null) {
			if (other.servicioValuni != null)
				return false;
		} else if (!servicioValuni.equals(other.servicioValuni))
			return false;
		if (servicioVlrvencon == null) {
			if (other.servicioVlrvencon != null)
				return false;
		} else if (!servicioVlrvencon.equals(other.servicioVlrvencon))
			return false;
		return true;
	}
	
	

}