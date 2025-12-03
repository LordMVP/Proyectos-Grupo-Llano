package com.bioagricola.apirest.modelo.manejadores.utils;

/**
 * Representa una asignación realizada en un query de actualización.
 * 
 * @author GeneradorCRUD
 */
public class InformacionAsignacion {
	
	public final String campo;
	public final Object valor;

        /**
         * @param campo El campo a actualizar
         * @param valor El valor a asignar al campo
         */
	public InformacionAsignacion(String campo, Object valor) {
		this.campo = campo;
		this.valor = valor;
	}

}
