package com.bioagricola.apirest.modelo.dtos;

public class RrbaRutarecoleccionbarridoDTO {

	private Integer rrbaIderegistro;
	private Long dsusIderegistr;
	private Integer rureIderegistro;
	private Long rutIdemacroruta;
	private Long rutIderegistro;
	private String rutrecbarSwtact;
	private Long usuIderegistro;

	public RrbaRutarecoleccionbarridoDTO() {
		super();
	}

	public Integer getRrbaIderegistro() {
		return rrbaIderegistro;
	}

	public void setRrbaIderegistro(Integer rrbaIderegistro) {
		this.rrbaIderegistro = rrbaIderegistro;
	}

	public Long getDsusIderegistr() {
		return dsusIderegistr;
	}

	public void setDsusIderegistr(Long dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	public Integer getRureIderegistro() {
		return rureIderegistro;
	}

	public void setRureIderegistro(Integer rureIderegistro) {
		this.rureIderegistro = rureIderegistro;
	}

	public Long getRutIdemacroruta() {
		return rutIdemacroruta;
	}

	public void setRutIdemacroruta(Long rutIdemacroruta) {
		this.rutIdemacroruta = rutIdemacroruta;
	}

	public Long getRutIderegistro() {
		return rutIderegistro;
	}

	public void setRutIderegistro(Long rutIderegistro) {
		this.rutIderegistro = rutIderegistro;
	}

	public String getRutrecbarSwtact() {
		return rutrecbarSwtact;
	}

	public void setRutrecbarSwtact(String rutrecbarSwtact) {
		this.rutrecbarSwtact = rutrecbarSwtact;
	}

	public Long getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Long usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((dsusIderegistr == null) ? 0 : dsusIderegistr.hashCode());
		result = prime * result + ((rrbaIderegistro == null) ? 0 : rrbaIderegistro.hashCode());
		result = prime * result + ((rureIderegistro == null) ? 0 : rureIderegistro.hashCode());
		result = prime * result + ((rutIdemacroruta == null) ? 0 : rutIdemacroruta.hashCode());
		result = prime * result + ((rutIderegistro == null) ? 0 : rutIderegistro.hashCode());
		result = prime * result + ((rutrecbarSwtact == null) ? 0 : rutrecbarSwtact.hashCode());
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
		RrbaRutarecoleccionbarridoDTO other = (RrbaRutarecoleccionbarridoDTO) obj;
		if (dsusIderegistr == null) {
			if (other.dsusIderegistr != null)
				return false;
		} else if (!dsusIderegistr.equals(other.dsusIderegistr))
			return false;
		if (rrbaIderegistro == null) {
			if (other.rrbaIderegistro != null)
				return false;
		} else if (!rrbaIderegistro.equals(other.rrbaIderegistro))
			return false;
		if (rureIderegistro == null) {
			if (other.rureIderegistro != null)
				return false;
		} else if (!rureIderegistro.equals(other.rureIderegistro))
			return false;
		if (rutIdemacroruta == null) {
			if (other.rutIdemacroruta != null)
				return false;
		} else if (!rutIdemacroruta.equals(other.rutIdemacroruta))
			return false;
		if (rutIderegistro == null) {
			if (other.rutIderegistro != null)
				return false;
		} else if (!rutIderegistro.equals(other.rutIderegistro))
			return false;
		if (rutrecbarSwtact == null) {
			if (other.rutrecbarSwtact != null)
				return false;
		} else if (!rutrecbarSwtact.equals(other.rutrecbarSwtact))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
