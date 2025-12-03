package com.bioagricola.apirest.modelo.manejadores.utils;

import com.bioagricola.apirest.modelo.enums.TipoOrdenamiento;

public class InformacionOrdenamiento {	
	
	public final TipoOrdenamiento tipo;
	public final String campo;
	
	public InformacionOrdenamiento(TipoOrdenamiento tipo, String campo) {
		this.tipo = tipo;
		this.campo = campo;
	}        

}
