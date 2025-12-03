package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;
import java.util.Date;

public class AforoExtraOrdinarioDTO {

	private Integer dsusIderegistr;
	private Integer perIderegistro;
	private BigDecimal valorTafnaExtraOrdinario;
	private BigDecimal mnafTafna;
	private Date hmafFecharegistro;

	public AforoExtraOrdinarioDTO() {
		super();
	}

	public Integer getDsusIderegistr() {
		return dsusIderegistr;
	}

	public void setDsusIderegistr(Integer dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	public Integer getPerIderegistro() {
		return perIderegistro;
	}

	public void setPerIderegistro(Integer perIderegistro) {
		this.perIderegistro = perIderegistro;
	}

	public BigDecimal getValorTafnaExtraOrdinario() {
		return valorTafnaExtraOrdinario;
	}

	public void setValorTafnaExtraOrdinario(BigDecimal valorTafnaExtraOrdinario) {
		this.valorTafnaExtraOrdinario = valorTafnaExtraOrdinario;
	}

	public BigDecimal getMnafTafna() {
		return mnafTafna;
	}

	public void setMnafTafna(BigDecimal mnafTafna) {
		this.mnafTafna = mnafTafna;
	}

	public Date getHmafFecharegistro() {
		return hmafFecharegistro;
	}

	public void setHmafFecharegistro(Date hmafFecharegistro) {
		this.hmafFecharegistro = hmafFecharegistro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((valorTafnaExtraOrdinario == null) ? 0 : valorTafnaExtraOrdinario.hashCode());
		result = prime * result + ((dsusIderegistr == null) ? 0 : dsusIderegistr.hashCode());
		result = prime * result + ((hmafFecharegistro == null) ? 0 : hmafFecharegistro.hashCode());
		result = prime * result + ((mnafTafna == null) ? 0 : mnafTafna.hashCode());
		result = prime * result + ((perIderegistro == null) ? 0 : perIderegistro.hashCode());
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
		AforoExtraOrdinarioDTO other = (AforoExtraOrdinarioDTO) obj;
		if (valorTafnaExtraOrdinario == null) {
			if (other.valorTafnaExtraOrdinario != null)
				return false;
		} else if (!valorTafnaExtraOrdinario.equals(other.valorTafnaExtraOrdinario))
			return false;
		if (dsusIderegistr == null) {
			if (other.dsusIderegistr != null)
				return false;
		} else if (!dsusIderegistr.equals(other.dsusIderegistr))
			return false;
		if (hmafFecharegistro == null) {
			if (other.hmafFecharegistro != null)
				return false;
		} else if (!hmafFecharegistro.equals(other.hmafFecharegistro))
			return false;
		if (mnafTafna == null) {
			if (other.mnafTafna != null)
				return false;
		} else if (!mnafTafna.equals(other.mnafTafna))
			return false;
		if (perIderegistro == null) {
			if (other.perIderegistro != null)
				return false;
		} else if (!perIderegistro.equals(other.perIderegistro))
			return false;
		return true;
	}

}
