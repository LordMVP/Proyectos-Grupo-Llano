package com.bioagricola.apirest.modelo.manejadores.utils;

public class Json {

    private String valor;
    private String tipo ;
    private Integer idconcepto;
    private Boolean acc;
 
    public Json (String valor, String tipo,Integer idconcepto, Boolean acc ) {
        this.setValor(valor);
        this.setTipo(tipo);
        this.setIdconcepto(idconcepto);        
        this.setAcc(acc);
    }

    public Boolean getAcc() {
        return acc;
    }

    public void setAcc(Boolean acc) {
        this.acc = acc;
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
