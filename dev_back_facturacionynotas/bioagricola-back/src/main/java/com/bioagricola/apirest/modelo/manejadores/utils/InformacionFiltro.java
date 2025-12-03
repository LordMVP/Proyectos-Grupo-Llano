package com.bioagricola.apirest.modelo.manejadores.utils;

import com.bioagricola.apirest.modelo.enums.TipoFiltro;
import com.bioagricola.apirest.modelo.enums.TipoOperador;

/**
 * Clase que representa una condición de filtrado para un consulta JPQL. La condición
 * de define con un campo, un operador de comparación (=,!=,{@literal <}, etc), un valor y un 
 * tipo de operador de concatenación (OR o AND) para unir esta condicion con
 * otra condición.
 * 
 * @author GeneradorCRUD
 */
public class InformacionFiltro {

	public final String campo;
	public final TipoFiltro tipo;
	public final Object valor;
	public final TipoOperador operador;
        public final String nombre;

        /**
         * Por defecto se selecciona un tipo de operador AND.
         * @param tipo Tipo del filtro
         * @param campo Nombre del campo 
         * @param valor Valor por el cual filtrar el campo
         * @param nombre El nombre del campo para la consulta
         */
	public InformacionFiltro(TipoFiltro tipo, String campo, Object valor, String nombre) {
		this.tipo = tipo;
		this.campo = campo;
		this.valor = valor;
		this.operador = TipoOperador.AND;
		this.nombre = nombre;
	}

        /**
         * 
         * @param tipo Tipo del filtro
         * @param campo Nombre del campo
         * @param valor Valor por el cual filtrar el campo
         * @param tipoOperador Operador de concatenación
         * @param nombre El nombre del campo para la consulta
         */
	public InformacionFiltro(TipoFiltro tipo, String campo, Object valor,
			TipoOperador tipoOperador, String nombre) {
		this.tipo = tipo;
		this.campo = campo;
		this.valor = valor;
		this.operador = tipoOperador;
		this.nombre = nombre;
	}
        

}
