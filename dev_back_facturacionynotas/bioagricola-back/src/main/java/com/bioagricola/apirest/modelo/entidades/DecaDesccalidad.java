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
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


/**
 * The persistent class for the deca_desccalidad database table.
 * 
 */
@Entity
@Table(name = "deca_desccalidad", schema = "aseo")
@NamedQuery(name="DecaDesccalidad.findAll", query="SELECT d FROM DecaDesccalidad d")
public class DecaDesccalidad implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "aseo.sq_deca_idregistr", sequenceName = "aseo.sq_deca_idregistr", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aseo.sq_deca_idregistr")
	@Column(name = "deca_idregistr")
	private Long decaIdregistr;

	@Column(name="desc_aplicado")
	private Boolean descAplicado;

	@Column(name="dsus_ideregistr")
	private Long dsusIderegistr;

	@Column(name="fac_ideregistro")
	private Long facIderegistro;

	@Column(name="factor_desc")
	private BigDecimal factorDesc;

	@Column(name="fecha_registro")
	private Timestamp fechaRegistro;

	@Column(name="interes_corr_aplicado")
	private BigDecimal interesCorrAplicado;

	@Column(name="interes_mor_aplicado")
	private BigDecimal interesMorAplicado;

	@Column(name="per_ideorden_aplic")
	private Integer perIdeordenAplic;

	@Column(name="per_ideregistro_activo")
	private Integer perIderegistroActivo;

	@Column(name="per_ideregistro_tarifas")
	private Integer perIderegistroTarifas;

	@Column(name="porcentaje_interes_corr")
	private BigDecimal porcentajeInteresCorr;

	@Column(name="porcentaje_interes_mor")
	private BigDecimal porcentajeInteresMor;

	@Column(name="rut_ideregistro")
	private Integer rutIderegistro;

	@Column(name="saldo_total_desc")
	private BigDecimal saldoTotalDesc;

	@Column(name="uni_concepto_facturacion")
	private Integer uniConceptoFacturacion;

	@Column(name="uni_concepto_interes_corr")
	private Integer uniConceptoInteresCorr;

	@Column(name="uni_concepto_interes_mor")
	private Integer uniConceptoInteresMor;

	@Column(name="uni_concepto_tarifas")
	private Integer uniConceptoTarifas;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;

	@Column(name="valor_toneladas")
	private BigDecimal valorToneladas;

	@Column(name="valor_total_desc")
	private BigDecimal valorTotalDesc;
        
        @Column(name="deca_aprobacion")
	private boolean decaAprobacion;

	public DecaDesccalidad() {
		//constructor por defecto
	}

	public Long getDecaIdregistr() {
		return this.decaIdregistr;
	}

	public void setDecaIdregistr(Long decaIdregistr) {
		this.decaIdregistr = decaIdregistr;
	}

	public Boolean getDescAplicado() {
		return this.descAplicado;
	}

	public void setDescAplicado(Boolean descAplicado) {
		this.descAplicado = descAplicado;
	}

	public Long getDsusIderegistr() {
		return this.dsusIderegistr;
	}

	public void setDsusIderegistr(Long dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	public Long getFacIderegistro() {
		return this.facIderegistro;
	}

	public void setFacIderegistro(Long facIderegistro) {
		this.facIderegistro = facIderegistro;
	}

	public BigDecimal getFactorDesc() {
		return this.factorDesc;
	}

	public void setFactorDesc(BigDecimal factorDesc) {
		this.factorDesc = factorDesc;
	}

	public Timestamp getFechaRegistro() {
		return this.fechaRegistro;
	}

	public void setFechaRegistro(Timestamp fechaRegistro) {
		this.fechaRegistro = fechaRegistro;
	}

	public BigDecimal getInteresCorrAplicado() {
		return this.interesCorrAplicado;
	}

	public void setInteresCorrAplicado(BigDecimal interesCorrAplicado) {
		this.interesCorrAplicado = interesCorrAplicado;
	}

	public BigDecimal getInteresMorAplicado() {
		return this.interesMorAplicado;
	}

	public void setInteresMorAplicado(BigDecimal interesMorAplicado) {
		this.interesMorAplicado = interesMorAplicado;
	}

	public Integer getPerIdeordenAplic() {
		return this.perIdeordenAplic;
	}

	public void setPerIdeordenAplic(Integer perIdeordenAplic) {
		this.perIdeordenAplic = perIdeordenAplic;
	}

	public Integer getPerIderegistroActivo() {
		return this.perIderegistroActivo;
	}

	public void setPerIderegistroActivo(Integer perIderegistroActivo) {
		this.perIderegistroActivo = perIderegistroActivo;
	}

	public Integer getPerIderegistroTarifas() {
		return this.perIderegistroTarifas;
	}

	public void setPerIderegistroTarifas(Integer perIderegistroTarifas) {
		this.perIderegistroTarifas = perIderegistroTarifas;
	}

	public BigDecimal getPorcentajeInteresCorr() {
		return this.porcentajeInteresCorr;
	}

	public void setPorcentajeInteresCorr(BigDecimal porcentajeInteresCorr) {
		this.porcentajeInteresCorr = porcentajeInteresCorr;
	}

	public BigDecimal getPorcentajeInteresMor() {
		return this.porcentajeInteresMor;
	}

	public void setPorcentajeInteresMor(BigDecimal porcentajeInteresMor) {
		this.porcentajeInteresMor = porcentajeInteresMor;
	}

	public Integer getRutIderegistro() {
		return this.rutIderegistro;
	}

	public void setRutIderegistro(Integer rutIderegistro) {
		this.rutIderegistro = rutIderegistro;
	}

	public BigDecimal getSaldoTotalDesc() {
		return this.saldoTotalDesc;
	}

	public void setSaldoTotalDesc(BigDecimal saldoTotalDesc) {
		this.saldoTotalDesc = saldoTotalDesc;
	}

	public Integer getUniConceptoFacturacion() {
		return this.uniConceptoFacturacion;
	}

	public void setUniConceptoFacturacion(Integer uniConceptoFacturacion) {
		this.uniConceptoFacturacion = uniConceptoFacturacion;
	}

	public Integer getUniConceptoInteresCorr() {
		return this.uniConceptoInteresCorr;
	}

	public void setUniConceptoInteresCorr(Integer uniConceptoInteresCorr) {
		this.uniConceptoInteresCorr = uniConceptoInteresCorr;
	}

	public Integer getUniConceptoInteresMor() {
		return this.uniConceptoInteresMor;
	}

	public void setUniConceptoInteresMor(Integer uniConceptoInteresMor) {
		this.uniConceptoInteresMor = uniConceptoInteresMor;
	}

	public Integer getUniConceptoTarifas() {
		return this.uniConceptoTarifas;
	}

	public void setUniConceptoTarifas(Integer uniConceptoTarifas) {
		this.uniConceptoTarifas = uniConceptoTarifas;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public BigDecimal getValorToneladas() {
		return this.valorToneladas;
	}

	public void setValorToneladas(BigDecimal valorToneladas) {
		this.valorToneladas = valorToneladas;
	}

	public BigDecimal getValorTotalDesc() {
		return this.valorTotalDesc;
	}

	public void setValorTotalDesc(BigDecimal valorTotalDesc) {
		this.valorTotalDesc = valorTotalDesc;
	}

        public boolean isDecaAprobacion() {
            return decaAprobacion;
        }

        public void setDecaAprobacion(boolean decaAprobacion) {
            this.decaAprobacion = decaAprobacion;
        }       

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((decaIdregistr == null) ? 0 : decaIdregistr.hashCode());
		result = prime * result + ((descAplicado == null) ? 0 : descAplicado.hashCode());
		result = prime * result + ((dsusIderegistr == null) ? 0 : dsusIderegistr.hashCode());
		result = prime * result + ((facIderegistro == null) ? 0 : facIderegistro.hashCode());
		result = prime * result + ((factorDesc == null) ? 0 : factorDesc.hashCode());
		result = prime * result + ((fechaRegistro == null) ? 0 : fechaRegistro.hashCode());
		result = prime * result + ((interesCorrAplicado == null) ? 0 : interesCorrAplicado.hashCode());
		result = prime * result + ((interesMorAplicado == null) ? 0 : interesMorAplicado.hashCode());
		result = prime * result + ((perIdeordenAplic == null) ? 0 : perIdeordenAplic.hashCode());
		result = prime * result + ((perIderegistroActivo == null) ? 0 : perIderegistroActivo.hashCode());
		result = prime * result + ((perIderegistroTarifas == null) ? 0 : perIderegistroTarifas.hashCode());
		result = prime * result + ((porcentajeInteresCorr == null) ? 0 : porcentajeInteresCorr.hashCode());
		result = prime * result + ((porcentajeInteresMor == null) ? 0 : porcentajeInteresMor.hashCode());
		result = prime * result + ((rutIderegistro == null) ? 0 : rutIderegistro.hashCode());
		result = prime * result + ((saldoTotalDesc == null) ? 0 : saldoTotalDesc.hashCode());
		result = prime * result + ((uniConceptoFacturacion == null) ? 0 : uniConceptoFacturacion.hashCode());
		result = prime * result + ((uniConceptoInteresCorr == null) ? 0 : uniConceptoInteresCorr.hashCode());
		result = prime * result + ((uniConceptoInteresMor == null) ? 0 : uniConceptoInteresMor.hashCode());
		result = prime * result + ((uniConceptoTarifas == null) ? 0 : uniConceptoTarifas.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
		result = prime * result + ((valorToneladas == null) ? 0 : valorToneladas.hashCode());
		result = prime * result + ((valorTotalDesc == null) ? 0 : valorTotalDesc.hashCode());
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
		DecaDesccalidad other = (DecaDesccalidad) obj;
		if (decaIdregistr == null) {
			if (other.decaIdregistr != null)
				return false;
		} else if (!decaIdregistr.equals(other.decaIdregistr))
			return false;
		if (descAplicado == null) {
			if (other.descAplicado != null)
				return false;
		} else if (!descAplicado.equals(other.descAplicado))
			return false;
		if (dsusIderegistr == null) {
			if (other.dsusIderegistr != null)
				return false;
		} else if (!dsusIderegistr.equals(other.dsusIderegistr))
			return false;
		if (facIderegistro == null) {
			if (other.facIderegistro != null)
				return false;
		} else if (!facIderegistro.equals(other.facIderegistro))
			return false;
		if (factorDesc == null) {
			if (other.factorDesc != null)
				return false;
		} else if (!factorDesc.equals(other.factorDesc))
			return false;
		if (fechaRegistro == null) {
			if (other.fechaRegistro != null)
				return false;
		} else if (!fechaRegistro.equals(other.fechaRegistro))
			return false;
		if (interesCorrAplicado == null) {
			if (other.interesCorrAplicado != null)
				return false;
		} else if (!interesCorrAplicado.equals(other.interesCorrAplicado))
			return false;
		if (interesMorAplicado == null) {
			if (other.interesMorAplicado != null)
				return false;
		} else if (!interesMorAplicado.equals(other.interesMorAplicado))
			return false;
		if (perIdeordenAplic == null) {
			if (other.perIdeordenAplic != null)
				return false;
		} else if (!perIdeordenAplic.equals(other.perIdeordenAplic))
			return false;
		if (perIderegistroActivo == null) {
			if (other.perIderegistroActivo != null)
				return false;
		} else if (!perIderegistroActivo.equals(other.perIderegistroActivo))
			return false;
		if (perIderegistroTarifas == null) {
			if (other.perIderegistroTarifas != null)
				return false;
		} else if (!perIderegistroTarifas.equals(other.perIderegistroTarifas))
			return false;
		if (porcentajeInteresCorr == null) {
			if (other.porcentajeInteresCorr != null)
				return false;
		} else if (!porcentajeInteresCorr.equals(other.porcentajeInteresCorr))
			return false;
		if (porcentajeInteresMor == null) {
			if (other.porcentajeInteresMor != null)
				return false;
		} else if (!porcentajeInteresMor.equals(other.porcentajeInteresMor))
			return false;
		if (rutIderegistro == null) {
			if (other.rutIderegistro != null)
				return false;
		} else if (!rutIderegistro.equals(other.rutIderegistro))
			return false;
		if (saldoTotalDesc == null) {
			if (other.saldoTotalDesc != null)
				return false;
		} else if (!saldoTotalDesc.equals(other.saldoTotalDesc))
			return false;
		if (uniConceptoFacturacion == null) {
			if (other.uniConceptoFacturacion != null)
				return false;
		} else if (!uniConceptoFacturacion.equals(other.uniConceptoFacturacion))
			return false;
		if (uniConceptoInteresCorr == null) {
			if (other.uniConceptoInteresCorr != null)
				return false;
		} else if (!uniConceptoInteresCorr.equals(other.uniConceptoInteresCorr))
			return false;
		if (uniConceptoInteresMor == null) {
			if (other.uniConceptoInteresMor != null)
				return false;
		} else if (!uniConceptoInteresMor.equals(other.uniConceptoInteresMor))
			return false;
		if (uniConceptoTarifas == null) {
			if (other.uniConceptoTarifas != null)
				return false;
		} else if (!uniConceptoTarifas.equals(other.uniConceptoTarifas))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		if (valorToneladas == null) {
			if (other.valorToneladas != null)
				return false;
		} else if (!valorToneladas.equals(other.valorToneladas))
			return false;
		if (valorTotalDesc == null) {
			if (other.valorTotalDesc != null)
				return false;
		} else if (!valorTotalDesc.equals(other.valorTotalDesc))
			return false;
		return true;
	}

}