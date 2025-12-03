package com.bioagricola.apirest.modelo.dtos;

import java.util.Date;

public class HmafHistormaestroaforoDTO {

	private Integer hmafIderegistro;
	private Integer cicIderegistro;
	private Date hmafFechafinalizacion;
	private Date hmafFechainicio;
	private Date hmafFecharegistro;
	private String mafvFactor;
	private Integer mafvIderegistro;
	private String mhacEstado;
	private String mnafPeso;
	private String mnafTafna;
	private String mnafTrna;
	private Integer perIderegistro;
	private Integer terAforador;
	private Integer uniTipogenerador;
	private Integer usuIderegistro;
	private Integer afoIderegistro;

	public Integer getAfoIderegistro() {
		return afoIderegistro;
	}

	public void setAfoIderegistro(Integer afoIderegistro) {
		this.afoIderegistro = afoIderegistro;
	}

	public Integer getHmafIderegistro() {
		return hmafIderegistro;
	}

	public void setHmafIderegistro(Integer hmafIderegistro) {
		this.hmafIderegistro = hmafIderegistro;
	}

	public Integer getCicIderegistro() {
		return cicIderegistro;
	}

	public void setCicIderegistro(Integer cicIderegistro) {
		this.cicIderegistro = cicIderegistro;
	}

	public Date getHmafFechafinalizacion() {
		return hmafFechafinalizacion;
	}

	public void setHmafFechafinalizacion(Date hmafFechafinalizacion) {
		this.hmafFechafinalizacion = hmafFechafinalizacion;
	}

	public Date getHmafFechainicio() {
		return hmafFechainicio;
	}

	public void setHmafFechainicio(Date hmafFechainicio) {
		this.hmafFechainicio = hmafFechainicio;
	}

	public Date getHmafFecharegistro() {
		return hmafFecharegistro;
	}

	public void setHmafFecharegistro(Date hmafFecharegistro) {
		this.hmafFecharegistro = hmafFecharegistro;
	}

	public String getMafvFactor() {
		return mafvFactor;
	}

	public void setMafvFactor(String mafvFactor) {
		this.mafvFactor = mafvFactor;
	}

	public Integer getMafvIderegistro() {
		return mafvIderegistro;
	}

	public void setMafvIderegistro(Integer mafvIderegistro) {
		this.mafvIderegistro = mafvIderegistro;
	}

	public String getMhacEstado() {
		return mhacEstado;
	}

	public void setMhacEstado(String mhacEstado) {
		this.mhacEstado = mhacEstado;
	}

	public String getMnafPeso() {
		return mnafPeso;
	}

	public void setMnafPeso(String mnafPeso) {
		this.mnafPeso = mnafPeso;
	}

	public String getMnafTafna() {
		return mnafTafna;
	}

	public void setMnafTafna(String mnafTafna) {
		this.mnafTafna = mnafTafna;
	}

	public String getMnafTrna() {
		return mnafTrna;
	}

	public void setMnafTrna(String mnafTrna) {
		this.mnafTrna = mnafTrna;
	}

	public Integer getPerIderegistro() {
		return perIderegistro;
	}

	public void setPerIderegistro(Integer perIderegistro) {
		this.perIderegistro = perIderegistro;
	}

	public Integer getTerAforador() {
		return terAforador;
	}

	public void setTerAforador(Integer terAforador) {
		this.terAforador = terAforador;
	}

	public Integer getUniTipogenerador() {
		return uniTipogenerador;
	}

	public void setUniTipogenerador(Integer uniTipogenerador) {
		this.uniTipogenerador = uniTipogenerador;
	}

	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cicIderegistro == null) ? 0 : cicIderegistro.hashCode());
		result = prime * result + ((hmafIderegistro == null) ? 0 : hmafIderegistro.hashCode());
		result = prime * result + ((mafvFactor == null) ? 0 : mafvFactor.hashCode());
		result = prime * result + ((mafvIderegistro == null) ? 0 : mafvIderegistro.hashCode());
		result = prime * result + ((mhacEstado == null) ? 0 : mhacEstado.hashCode());
		result = prime * result + ((mnafPeso == null) ? 0 : mnafPeso.hashCode());
		result = prime * result + ((mnafTafna == null) ? 0 : mnafTafna.hashCode());
		result = prime * result + ((mnafTrna == null) ? 0 : mnafTrna.hashCode());
		result = prime * result + ((perIderegistro == null) ? 0 : perIderegistro.hashCode());
		result = prime * result + ((terAforador == null) ? 0 : terAforador.hashCode());
		result = prime * result + ((uniTipogenerador == null) ? 0 : uniTipogenerador.hashCode());
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
		HmafHistormaestroaforoDTO other = (HmafHistormaestroaforoDTO) obj;
		if (cicIderegistro == null) {
			if (other.cicIderegistro != null)
				return false;
		} else if (!cicIderegistro.equals(other.cicIderegistro))
			return false;
		if (hmafIderegistro == null) {
			if (other.hmafIderegistro != null)
				return false;
		} else if (!hmafIderegistro.equals(other.hmafIderegistro))
			return false;
		if (mafvFactor == null) {
			if (other.mafvFactor != null)
				return false;
		} else if (!mafvFactor.equals(other.mafvFactor))
			return false;
		if (mafvIderegistro == null) {
			if (other.mafvIderegistro != null)
				return false;
		} else if (!mafvIderegistro.equals(other.mafvIderegistro))
			return false;
		if (mhacEstado == null) {
			if (other.mhacEstado != null)
				return false;
		} else if (!mhacEstado.equals(other.mhacEstado))
			return false;
		if (mnafPeso == null) {
			if (other.mnafPeso != null)
				return false;
		} else if (!mnafPeso.equals(other.mnafPeso))
			return false;
		if (mnafTafna == null) {
			if (other.mnafTafna != null)
				return false;
		} else if (!mnafTafna.equals(other.mnafTafna))
			return false;
		if (mnafTrna == null) {
			if (other.mnafTrna != null)
				return false;
		} else if (!mnafTrna.equals(other.mnafTrna))
			return false;
		if (perIderegistro == null) {
			if (other.perIderegistro != null)
				return false;
		} else if (!perIderegistro.equals(other.perIderegistro))
			return false;
		if (terAforador == null) {
			if (other.terAforador != null)
				return false;
		} else if (!terAforador.equals(other.terAforador))
			return false;
		if (uniTipogenerador == null) {
			if (other.uniTipogenerador != null)
				return false;
		} else if (!uniTipogenerador.equals(other.uniTipogenerador))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
