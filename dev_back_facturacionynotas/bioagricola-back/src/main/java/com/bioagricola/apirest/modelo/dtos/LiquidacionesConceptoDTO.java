package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement

public class LiquidacionesConceptoDTO implements Serializable {
	
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer uniLiquidacion;
	
	private String liqNombre;
	
	private Integer uniDocumento;
	
	private String docNombre;
	
	private Integer uniTipdocument;
	
	private String tidoNombre;

	private Integer uniConcepto;

	private String conNombre ;

	public Integer getUniLiquidacion() {
		return uniLiquidacion;
	}

	public void setUniLiquidacion(Integer uniLiquidacion) {
		this.uniLiquidacion = uniLiquidacion;
	}

	public String getLiqNombre() {
		return liqNombre;
	}

	public void setLiqNombre(String liqNombre) {
		this.liqNombre = liqNombre;
	}

	public Integer getUniDocumento() {
		return uniDocumento;
	}

	public void setUniDocumento(Integer uniDocumento) {
		this.uniDocumento = uniDocumento;
	}

	public String getDocNombre() {
		return docNombre;
	}

	public void setDocNombre(String docNombre) {
		this.docNombre = docNombre;
	}

	public Integer getUniTipdocument() {
		return uniTipdocument;
	}

	public void setUniTipdocument(Integer uniTipdocument) {
		this.uniTipdocument = uniTipdocument;
	}

	public String getTidoNombre() {
		return tidoNombre;
	}

	public void setTidoNombre(String tidoNombre) {
		this.tidoNombre = tidoNombre;
	}

	public Integer getUniConcepto() {
		return uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public String getConNombre() {
		return conNombre;
	}

	public void setConNombre(String conNombre) {
		this.conNombre = conNombre;
	}



}
