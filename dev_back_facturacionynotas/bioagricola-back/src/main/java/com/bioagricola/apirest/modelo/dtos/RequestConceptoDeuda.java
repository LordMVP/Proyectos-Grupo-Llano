package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;

public class RequestConceptoDeuda {

	private Integer idConcepto; 
	private BigDecimal valorAdiciona;

	
	public RequestConceptoDeuda() {
		super();
	}

	
	public Integer getIdConcepto() {
		return idConcepto;
	}


	public void setIdConcepto(Integer idConcepto) {
		this.idConcepto = idConcepto;
	}


	public BigDecimal getValorAdiciona() {
		return valorAdiciona;
	}


	public void setValorAdiciona(BigDecimal valorAdiciona) {
		this.valorAdiciona = valorAdiciona;
	}


	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((idConcepto == null) ? 0 : idConcepto.hashCode());
		result = prime * result + ((valorAdiciona == null) ? 0 : valorAdiciona.hashCode());
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
		RequestConceptoDeuda other = (RequestConceptoDeuda) obj;
		if (idConcepto == null) {
			if (other.idConcepto != null)
				return false;
		} else if (!idConcepto.equals(other.idConcepto))
			return false;
		if (valorAdiciona == null) {
			if (other.valorAdiciona != null)
				return false;
		} else if (!valorAdiciona.equals(other.valorAdiciona))
			return false;
		return true;
	}

}
