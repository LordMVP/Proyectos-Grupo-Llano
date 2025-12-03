package com.bioagricola.homologaciones.dto;

public class ContContactoterceroRequest
{
	private Integer cont_ideregistro;
	private Integer ter_ideregistro;
	private Integer uni_ideregistro;
	private String cont_valor;
	private String uni_nombre1;
	private String uni_codigo1;
	
	public ContContactoterceroRequest() {
		super();
	}

	public Integer getCont_ideregistro() {
		return cont_ideregistro;
	}

	public void setCont_ideregistro(Integer cont_ideregistro) {
		this.cont_ideregistro = cont_ideregistro;
	}

	public Integer getTer_ideregistro() {
		return ter_ideregistro;
	}

	public void setTer_ideregistro(Integer ter_ideregistro) {
		this.ter_ideregistro = ter_ideregistro;
	}

	public Integer getUni_ideregistro() {
		return uni_ideregistro;
	}

	public void setUni_ideregistro(Integer uni_ideregistro) {
		this.uni_ideregistro = uni_ideregistro;
	}

	public String getCont_valor() {
		return cont_valor;
	}

	public void setCont_valor(String cont_valor) {
		this.cont_valor = cont_valor;
	}

	public String getUni_nombre1() {
		return uni_nombre1;
	}

	public void setUni_nombre1(String uni_nombre1) {
		this.uni_nombre1 = uni_nombre1;
	}

	public String getUni_codigo1() {
		return uni_codigo1;
	}

	public void setUni_codigo1(String uni_codigo1) {
		this.uni_codigo1 = uni_codigo1;
	}

}
