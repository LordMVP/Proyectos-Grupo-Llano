package com.bioagricola.apirest.modelo.manejadores.utils;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

/**
 * 
 * @author GeneradorCRUD
 * @param <T>  Clase de la entidad asociada al manejador
 * @param <ID> Clase del pk de la entidad T. Si es un PK compuesto es una clase
 *             con la etiqueta @Embbeded, sino una clase "primitiva" como
 *             Integer, Long, String, etc.
 */
public interface IManejadorCrud<T, ID extends Serializable> {

	/**
	 * Actualiza en base de datos el registro correspondiente al objeto de la
	 * entidad T que se pasa como parametro
	 * 
	 * @param obj Instancia de la entidad T a actualizar en la base de datos
	 */
	/**
	 * Ejecuta un query de actualizacion para la entidad T aplicando los filtros y
	 * las asignaciones que se definan en los parametros.
	 * 
	 * @param asignaciones Lista con los campos y sus correspondientes valores a
	 *                     actualizar
	 * @param filtros      Los filtros que definen los registros a actualizar. Si es
	 *                     nulo no se aplica filtro y se actualizan todos los
	 *                     registros de la tabla.
	 */
	public void actualizarPorFiltros(Collection<InformacionAsignacion> asignaciones,
			Collection<InformacionFiltro> filtros);

	/**
	 * Elimina en base de datos el o los registro(s) correspondiente(s) a la entidad
	 * T que cumplen con el criterio definido en la lista de filtros que se pasa
	 * como parametro.
	 * 
	 * @param filtros Los filtros que definen los registros a eliminar. Puede ser
	 *                nulo.
	 */
	public void eliminarPorFiltro(Collection<InformacionFiltro> filtros);

	/**
	 * Devuelve el total de registros encontrados tras consultar la tabla
	 * correspondiente a la entidad T que cumplen los criterios de busqueda
	 * especificados en los parametros.
	 * 
	 * @param filtros       Los filtros que definen los registros a consultar. Si es
	 *                      nulo no se aplica ningun filtro.
	 * @param rangoConsulta El rango de registros sobre el cual limitar la consulta.
	 *                      Si es nulo no se aplica ningun rango.
	 * @return El total de registro encontrados en la consulta.
	 */
	public Integer consultarTotalRegistros(Collection<InformacionFiltro> filtros, RangoConsulta rangoConsulta);

	/**
	 * Realiza una consulta jpql (select) a la tabla correspondiente a la entidad T
	 * aplicando los filtros, ordenamiento y restricciones de rango especificados en
	 * los parametros.
	 * 
	 * @param filtros                 Los filtros que definen los registros a
	 *                                consultar. Si es nulo no se aplica ningun
	 *                                filtro. Si es nulo no se aplica ningun filtro
	 *                                a la consulta.
	 * @param informacionOrdenamiento Definicion del ordenamiento a realizar en la
	 *                                consulta. De igual forma que vienen definidos
	 *                                en la lista se inserta en la consulta JPQL. Si
	 *                                la lista es nula se deja el ordenamiento por
	 *                                defecto de la consulta.
	 * @param rangoConsulta           Define el bloque de datos a seleccionar de la
	 *                                consulta realizada con los filtros y
	 *                                ordenamiento especificado. Si no se define
	 *                                ningun rango se retornan todos los objetos
	 *                                consultados.
	 * @return Una lista de objetos de la entidad T.
	 */
	public List<T> consultar(Collection<InformacionFiltro> filtros,
			Collection<InformacionOrdenamiento> informacionOrdenamiento, RangoConsulta rangoConsulta);

	/**
	 * Devuelve una lista de los diferentes valores que se encuentran en la columna
	 * especificada en la tabla T aplicando los filtros y ordenamientos
	 * especificados.
	 * 
	 * @param filtros          Los filtros que definen los registros a consultar. Si
	 *                         es nulo no se aplica ningun filtro. Si es nulo no se
	 *                         aplica ningun filtro a la consulta.
	 * @param infoOrdenamiento Definicion del ordenamiento a realizar en la
	 *                         consulta. De igual forma que vienen definidos en la
	 *                         lista se inserta en la consulta JPQL. Si la lista es
	 *                         nula se deja el ordenamiento por defecto de la
	 *                         consulta.
	 * @param infoAgrupamiento Especifica la informacion de agurpamiento para
	 *                         realizar en las consultas tipo SELECT (COUNT,
	 *                         DISTINCT, NINGUNA).
	 * @return Una lista de elementos no repetidos
	 */
	public List<Object> consultarLista(Collection<InformacionFiltro> filtros,
			Collection<InformacionOrdenamiento> infoOrdenamiento, InformacionAgrupamiento infoAgrupamiento);

}
