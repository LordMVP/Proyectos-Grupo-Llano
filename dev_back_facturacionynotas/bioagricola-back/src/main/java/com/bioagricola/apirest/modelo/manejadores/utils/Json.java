package com.bioagricola.apirest.modelo.manejadores.utils;

public class Json {

    private String valor;
    private String tipo ;
    private Integer idconcepto;
 
    public Json (String valor, String tipo,Integer idconcepto) {
        this.setValor(valor);
        this.setTipo(tipo);
        this.setIdconcepto(idconcepto);
    }

	public String getValor() {
		return valor;
	}

	public void setValor(String valor) {
		this.valor = valor;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public Integer getIdconcepto() {
		return idconcepto;
	}

	public void setIdconcepto(Integer idconcepto) {
		this.idconcepto = idconcepto;
	}
 
    // Aquí los métodos get
    

}
