package com.bioagricola.apirest.modelo.manejadores.utils;

import static com.bioagricola.apirest.modelo.utils.UtilConstantes.NOT_NULL_VALUE;
import static com.bioagricola.apirest.modelo.utils.UtilConstantes.NULL_VALUE;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Parameter;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;

import com.bioagricola.apirest.modelo.enums.FuncionAgrupamientoJPQL;
import com.bioagricola.apirest.modelo.enums.TipoFiltro;
import com.bioagricola.apirest.modelo.enums.TipoOrdenamiento;
import com.bioagricola.apirest.modelo.enums.TipoQuery;
import com.bioagricola.apirest.modelo.utils.UtilReflection;

public class ManejadorCrudImpl<T, ID extends Serializable>
        extends SimpleJpaRepository<T, ID> implements ManejadorCrud<T, ID>, IManejadorCrud<T, ID> {

    /**
     * a imprimir logs...
     */
    private static final org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger(ManejadorCrudImpl.class.getName());

    public static final Integer IGNORAR_PARAMETRO_CONSULTA = -1;

    private Class<T> claseEntidad;

    private final EntityManager entityManager;
    
    public ManejadorCrudImpl(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
        this.claseEntidad = entityInformation.getJavaType();
      }

    /**
     * {@inheritDoc}
     *
     * @param filtros {@inheritDoc}
     * @param rangoConsulta {@inheritDoc}
     * @return {@inheritDoc}
     */
    @Override
    @Transactional
    public Integer consultarTotalRegistros(Collection<InformacionFiltro> filtros, RangoConsulta rangoConsulta) {

        Query qCount = construirJpqlQuery(filtros, null, null, rangoConsulta, TipoQuery.SELECT, new InformacionAgrupamiento(FuncionAgrupamientoJPQL.COUNT));

        return ((Long) qCount.getSingleResult()).intValue();
    }

    /**
     * {@inheritDoc}
     *
     * @param filtros {@inheritDoc}
     * @param informacionOrdenamiento {@inheritDoc}
     * @param rangoConsulta {@inheritDoc}
     * @return {@inheritDoc}
     */
    @Override
    @Transactional
    public List<T> consultar(Collection<InformacionFiltro> filtros, Collection<InformacionOrdenamiento> informacionOrdenamiento, RangoConsulta rangoConsulta) {

        Query q = construirJpqlQuery(filtros, informacionOrdenamiento, null, rangoConsulta, TipoQuery.SELECT, new InformacionAgrupamiento(FuncionAgrupamientoJPQL.NINGUNA));

        return q.getResultList();
    }

    /**
     * {@inheritDoc}
     *
     * @param filtros {@inheritDoc}
     * @param infoOrdenamiento {@inheritDoc}
     * @param infoAgrupamiento {@inheritDoc}
     * @return {@inheritDoc}
     */
    @Override
    @Transactional
    public List<Object> consultarLista(Collection<InformacionFiltro> filtros, Collection<InformacionOrdenamiento> infoOrdenamiento, InformacionAgrupamiento infoAgrupamiento) {
        Query q = construirJpqlQuery(filtros, infoOrdenamiento, null, null, TipoQuery.SELECT, infoAgrupamiento);

        return q.getResultList();
    }

    /**
     * {@inheritDoc}
     *
     * @param asignaciones {@inheritDoc}
     * @param filtros {@inheritDoc}
     */
    @Override
    @Transactional
    public void actualizarPorFiltros(Collection<InformacionAsignacion> asignaciones, Collection<InformacionFiltro> filtros) {

        Query q = construirJpqlQuery(filtros, null, asignaciones, null, TipoQuery.UPDATE, new InformacionAgrupamiento(FuncionAgrupamientoJPQL.NINGUNA));
        q.executeUpdate();

    }

    
    public void preCrear() {
    	/**
         * Metodo que se ejecuta antes de crear un registro en la base de datos y en
         * el que la clase que extienda esta clase puede anadir funcionalidad
         * personalizada.
         */
    }

  
    public void postCrear() {
    	  /**
         * Metodo que se ejecuta despues de crear un registro en la base de datos y
         * en el que la clase que extienda esta clase puede anadir funcionalidad
         * personalizada.
         */
    }

   
    public void preActualizar() {
    	 /**
         * Metodo que se ejecuta antes de actualizar un registro en la base de datos
         * y en el que la clase que extienda esta clase puede anadir funcionalidad
         * personalizada.
         */
    }

   
    public void postActualizar() {
    	 /**
         * Metodo que se ejecuta despues de crear un registro en la base de datos y
         * en el que la clase que extienda esta clase puede anadir funcionalidad
         * personalizada.
         */
    }

    
    public void preEliminar() {
    	/**
         * Metodo que se ejecuta antes de eliminar un registro en la base de datos y
         * en el que la clase que extienda esta clase puede anadir funcionalidad
         * personalizada.
         */
    }

   
    public void postEliminar() {
    	 /**
         * Metodo que se ejecuta despues de eliminar un registro en la base de datos
         * y en el que la clase que extienda esta clase puede anadir funcionalidad
         * personalizada.
         */
    }

    /**
     * {@inheritDoc}
     *
     * @param filtros {@inheritDoc}
     */
    @Override
    @Transactional
    public void eliminarPorFiltro(Collection<InformacionFiltro> filtros) {

        preEliminar();
        Query query = construirJpqlQuery(filtros, null, null, null,
                TipoQuery.DELETE, new InformacionAgrupamiento(FuncionAgrupamientoJPQL.NINGUNA));
        query.executeUpdate();
        postEliminar();
    }

    
    public void preGuardar() {
    	/**
         * Metodo que se ejecuta antes de crear o actualizar un registro en la base
         * de datos y en el que la clase que extienda esta clase puede anadir
         * funcionalidad personalizada.
         */
    }

   
    public void postGuardar() {
    	 /**
         * Metodo que se ejecuta despues de crear o actualizar un registro en la
         * base de datos y en el que la clase que extienda esta clase puede anadir
         * funcionalidad personalizada.
         */
    }

    /**
     * @return the claseEntidad
     */
    public Class<T> getClaseEntidad() {
        return claseEntidad;
    }

    /**
     * @param claseEntidad the claseEntidad to set
     */
    public void setClaseEntidad(Class<T> claseEntidad) {
        this.claseEntidad = claseEntidad;
    }

    /**
     * Construye una consulta JPQL de tipo SELECT, DELETE o UPDATE para la tabla
     * de la entidad T con las condiciones de filtrado, ordenamiento,
     * asignacion, rango y agrupamiento especificadas segun corresponda al tipo
     * de consulta.
     *
     * Si la consulta es de tipo SELECT aplican los parametros filtros,
     * informacionOrdenamiento, rangoConsulta y funcionAgrupamiento.
     *
     * Si la consulta es de tipo UPDATE aplican los parametros filtros e
     * infoAsignaciones.
     *
     * Si la consulta es de tipo DELETE aplica unicamente el parametro filtros.
     *
     * @param filtros Las condiciones de filtrado de la consulta. Si es nulo no
     * se aplican condiciones de filtrado.
     * @param informacionOrdenamiento Las condiciones de ordenamiento de la
     * consulta. Si es nulo no se aplican condiciones de ordenamiento.
     * @param infoAsignaciones Las asignaciones a realizar en la actualizacion.
     * Si es nulo no se aplican asignaciones. Una actualizacion debe tener por
     * lo menos una asignacion.
     * @param rangoConsulta Rango de registros a seleccionar en la consulta
     * realizada.
     * @param tipoQuery Tipo de query a construir: SELECT, UPDATE o DELETE. No
     * puede ser nulo.
     * @param infoAgrupamiento Especifica la informacion de agurpamiento para
     * realizar en las consultas tipo SELECT (COUNT, DISTINCT, NINGUNA).
     * @return El query jpql listo para ejecucion.
     */
    private Query construirJpqlQuery(Collection<InformacionFiltro> filtros, Collection<InformacionOrdenamiento> informacionOrdenamiento,
            Collection<InformacionAsignacion> infoAsignaciones, RangoConsulta rangoConsulta,
            TipoQuery tipoQuery, InformacionAgrupamiento infoAgrupamiento) {

        Collection<InformacionFiltro> filters = filtros;
        if (filters == null) {
            filters = Collections.emptyList();
        }

        Collection<InformacionOrdenamiento> ordenamiento = informacionOrdenamiento;
        if (ordenamiento == null) {
            ordenamiento = Collections.emptyList();
        }

        Collection<InformacionAsignacion> asignaciones = infoAsignaciones;
        if (asignaciones == null) {
            asignaciones = Collections.emptyList();
        }

        if (tipoQuery == null) {
            throw new RuntimeException("Se debe especificar un tipo de query para poder construir la consulta");
        }

        StringBuilder jpql = new StringBuilder();
        switch (tipoQuery) {
            case DELETE:
                jpql.append(generarQueryEliminacion(filters));
                break;
            case SELECT:
                jpql.append(generarQueryConsulta(filters, ordenamiento, infoAgrupamiento));
                break;
            case UPDATE:
                jpql.append(generarQueryActualizacion(asignaciones, filters));
                break;
            default:
                jpql.append(generarQueryConsulta(filters, ordenamiento, infoAgrupamiento));
        }

        Query query = entityManager.createQuery(jpql.toString());
        logger.debug("Query a ejecutar : " + jpql.toString());

        setearValoresConsulta(query, filters, asignaciones, rangoConsulta, tipoQuery);

        return query;

    }

    /**
     * Setea los valores de parametros de filtrado, de asignacion y de rango
     * dependiendo del tipo de query.
     *
     * @param query El query jpql de consulta con los parametros pendientes por
     * asignar un valor.
     * @param filters Las condiciones de filtrado de la consulta. Si es nulo no
     * se aplican condiciones de filtrado.
     * @param asignaciones Las asignaciones a realizar en la actualizacion. Si
     * es nulo no se aplican asignaciones. Una actualizacion debe tener por lo
     * menos una asignacion.
     * @param rangoConsulta Rango de registros a seleccionar en la consulta
     * realizada.
     * @param tipoQuery Tipo de query a construir: SELECT, UPDATE o DELETE
     */
    public void setearValoresConsulta(Query query, Collection<InformacionFiltro> filters,
            Collection<InformacionAsignacion> asignaciones, RangoConsulta rangoConsulta, TipoQuery tipoQuery) {

        asignarValoresFiltros(query, filters);

        if (tipoQuery.equals(TipoQuery.UPDATE)) {
            asignarValoresAsignacion(query, asignaciones);
        }

        if (rangoConsulta != null) {
            if (rangoConsulta.isFromValid()) {
                query.setFirstResult(rangoConsulta.getFrom());
            }

            if (rangoConsulta.isToValid()) {
                query.setMaxResults(rangoConsulta.getMaxResultsParameter());
            }
        }

    }

    /**
     * Construye una consulta jpql de tipo SELECT con las condiciones de
     * filtrado, ordenamiento y agrupamiento especificadas.
     *
     * @param filtros Las condiciones de filtrado de la consulta. Si es nulo no
     * se aplican condiciones de filtrado.
     * @param ordenamientos Las condiciones de ordenamiento de la consulta. Si
     * es nulo no se aplican condiciones de ordenamiento.
     * @param infoAgrupamiento Especifica la informacion de agurpamiento para
     * realizar en las consultas tipo SELECT (COUNT, DISTINCT, NINGUNA).
     * @return El query jpql de consulta con los parametros pendientes por
     * asignar un valor.
     */
    private String generarQueryConsulta(Collection<InformacionFiltro> filtros, Collection<InformacionOrdenamiento> ordenamientos,
            InformacionAgrupamiento infoAgrupamiento) {

        StringBuilder jpql = new StringBuilder();
        jpql.append(TipoQuery.SELECT.toString());

        FuncionAgrupamientoJPQL funcionAgrupamiento = infoAgrupamiento.getFuncionAgrupamiento();
        switch (funcionAgrupamiento) {
            case DISTINCT:
                jpql.append(" ").append(funcionAgrupamiento.toString()).append("( p.").append(infoAgrupamiento.getAtributo()).append(" )");
                break;
            case COUNT:
                jpql.append(" ").append(funcionAgrupamiento.toString()).append("( p )");
                break;
            case NINGUNA:
                jpql.append(" p");
                break;
            default:
                jpql.append(" p");
        }

        jpql.append(" FROM ");
        jpql.append(claseEntidad.getSimpleName()).append(" p ");
        jpql.append(getJpqlWhere(filtros));
        jpql.append(getJpqlOrder(ordenamientos));

        return jpql.toString();
    }

    /**
     * Construye una consulta jpql de tipo UPDATE con las condiciones de
     * filtrado, y asignacion especificadas.
     *
     * @param asignaciones Las asignaciones a realizar en la actualizacion. Si
     * es nulo no se aplican asignaciones. Una actualizacion debe tener por lo
     * menos una asignacion.
     * @param filtros Las condiciones de filtrado de la consulta. Si es nulo no
     * se aplican condiciones de filtrado.
     * @return El query jpql de actualizacion con los parametros pendientes por
     * asignar un valor.
     */
    private String generarQueryActualizacion(Collection<InformacionAsignacion> asignaciones,
            Collection<InformacionFiltro> filtros) {

        StringBuilder jpql = new StringBuilder();
        jpql.append(TipoQuery.UPDATE.toString());
        jpql.append(" ");
        jpql.append(claseEntidad.getSimpleName()).append(" p ");
        jpql.append(getJpqlSet(asignaciones));
        jpql.append(getJpqlWhere(filtros));

        return jpql.toString();
    }

    /**
     * Construye una consulta jpql de tipo DELETE con las condiciones de
     * filtrado especificadas.
     *
     * @param filtros Las condiciones de filtrado de la consulta. Si es nulo no
     * se aplican condiciones de filtrado.
     * @return El query jpql de eliminacion con los parametros pendientes por
     * asignar un valor.
     */
    private String generarQueryEliminacion(Collection<InformacionFiltro> filtros) {

        StringBuilder jpql = new StringBuilder();
        jpql.append(TipoQuery.DELETE.toString());
        jpql.append(" FROM ");
        jpql.append(claseEntidad.getSimpleName()).append(" p ");
        jpql.append(getJpqlWhere(filtros));

        return jpql.toString();
    }

    /**
     * Asigna los valores de los filtros especificados en el query.
     *
     * @param query Query jpql a ejecutar en la base de datos
     * @param filtros Filtros previamentes definidos en el query. Si es nulo no
     * se realiza ninguna asignacion.
     * @return El query con los parametros de filtrado seteados.
     */
    private void asignarValoresFiltros(Query query, Collection<InformacionFiltro> filtros) {
        for (InformacionFiltro filtro : filtros) {
            if (NULL_VALUE.equals(filtro.valor.toString()) || NOT_NULL_VALUE.equals(filtro.valor.toString())) {
                break;
            }
            Parameter parameter = query.getParameter(filtro.nombre.replaceAll("[.]", ""));
            String pValue = filtro.valor.toString();
            if (filtro.tipo.equals(TipoFiltro.LIKE) || filtro.tipo.equals(TipoFiltro.NOT_LIKE)) {
                pValue = "%" + pValue.toUpperCase() + "%";
            }
            UtilReflection.setParameter(query, parameter, pValue);
        }
    }

    /**
     * Asigna los valores de las asignaciones especificadas en el query.
     *
     * @param query query Query jpql a ejecutar en la base de datos
     * @param asignaciones Las asignaciones a realizar en la actualizacion. Si
     * es nulo no se aplican asignaciones. Una actualizacion debe tener por lo
     * menos una asignacion.
     * @return El query con los parametros de actualizacion seteados.
     */
    private void asignarValoresAsignacion(Query query, Collection<InformacionAsignacion> asignaciones) {
        for (InformacionAsignacion asignacion : asignaciones) {
            if (NULL_VALUE.equals(asignacion.valor.toString()) || NOT_NULL_VALUE.equals(asignacion.valor.toString())) {
                break;
            }
            Parameter parameter = query.getParameter(obtenerNombreParametro(asignacion.campo));
            String pValue = asignacion.valor.toString();
            UtilReflection.setParameter(query, parameter, pValue);
        }
    }

    /**
     * Devuelve la condicion de ordenamiento para una consulta jpql a partir de
     * los ordenamientos definidos.
     *
     * @param informacionOrdenamiento Las condiciones de ordenamiento de la
     * consulta. Si es nulo no se aplican condiciones de ordenamiento.
     * @return Una clausula ORDER BY para anadir a una consulta jpql de tipo
     * select.
     */
    private String getJpqlOrder(Collection<InformacionOrdenamiento> informacionOrdenamiento) {

        StringBuilder orderClause = new StringBuilder();
        if (!informacionOrdenamiento.isEmpty()) {
            orderClause.append(" ORDER BY ");
        }
        for (InformacionOrdenamiento ordenamiento : informacionOrdenamiento) {
            if (ordenamiento.tipo != TipoOrdenamiento.SIN_ORDENAR) {
                if (orderClause.length() > 10) {
                    orderClause.append(", ");
                }
                orderClause.append("p.").append(ordenamiento.campo);
                if (ordenamiento.tipo == TipoOrdenamiento.ASCENDENTE) {
                    orderClause.append(" ASC ");
                } else {
                    orderClause.append(" DESC ");
                }
            }
        }

        return orderClause.toString();
    }

    /**
     * Devuelve las asignaciones de una actualizacion jpql (clausula SET) a
     * partir de las asiganciones definidas.
     *
     * @param asignaciones Las asignaciones a definir en el SET de la
     * actualizacion.
     * @return Una clausula SET para anadir a una actualizacion jpql.
     */
    private String getJpqlSet(Collection<InformacionAsignacion> asignaciones) {
        StringBuilder jpqlSet = new StringBuilder();
        if (!asignaciones.isEmpty()) {
            jpqlSet.append(" SET ");
        }
        for (InformacionAsignacion asignacion : asignaciones) {
            if (asignacion.valor != null) {
                if (jpqlSet.length() > 5) {
                    jpqlSet.append(", ");
                }
                jpqlSet.append(obtenerAsignacion(asignacion));
            }
        }

        return jpqlSet.toString();

    }

    /**
     * Devuelve la asignacion como una cadena de caracteres para anadir en una
     * clausula SET de una actualizacion jpql. Ej. nombre=:nombre donde :nombre
     * es el parametro a asignar un valor.
     *
     * @param asignacion La asignacion a transformar.
     * @return Una condicion de asignacion de la clausula SET.
     */
    private String obtenerAsignacion(InformacionAsignacion asignacion) {
        return asignacion.campo + " = :" + obtenerNombreParametro(asignacion.campo);
    }

    /**
     * Devuelve una condicion de filtrado para una consulta jpql a partir de los
     * filtros definidos.
     *
     * @param filtros Filtros previamentes definidos en el query. Si es nulo no
     * se realiza ninguna asignacion.
     * @return Una clausula WHERE para anadir a una consulta jpql de tipo
     * select.
     */
    private String getJpqlWhere(Collection<InformacionFiltro> filtros) {

        StringBuilder jpqlWhere = new StringBuilder();
        if (!filtros.isEmpty()) {
            jpqlWhere.append(" WHERE ");
        }
        for (InformacionFiltro filtro : filtros) {
            if (filtro.valor != null) {
                if (jpqlWhere.length() > 7) {
                    jpqlWhere.append(" ");
                    jpqlWhere.append(filtro.operador);
                    jpqlWhere.append(" ");
                }
                jpqlWhere.append(obtenerCondicionFiltro(filtro));
            }
        }

        return jpqlWhere.toString();

    }

    /**
     * Devuelve la condicion de filtrado como una cadena de caracteres para
     * anadir en una clausula WHERE de una consulta jpql. Ej. nombre=:nombre
     * donde :nombre es el parametro a asignar un valor.
     *
     * @param filtro El filtro a transformar
     * @return Una condicion de filtrado de la clausula WHERE.
     */
    private String obtenerCondicionFiltro(InformacionFiltro filtro) {

        StringBuilder condicionJpql = new StringBuilder();

        switch (filtro.tipo) {
            case LIKE:
                condicionJpql.append("UPPER(").append("p.").append(filtro.campo).append(")");
                condicionJpql.append(" LIKE ");
                break;
            case NOT_LIKE:
                condicionJpql.append("UPPER(").append("p.").append(filtro.campo).append(")");
                condicionJpql.append(" NOT LIKE");
                break;
            case MAYOR:
                condicionJpql.append("p.").append(filtro.campo);
                condicionJpql.append(" > ");
                break;
            case MAYOR_O_IGUAL:
                condicionJpql.append("p.").append(filtro.campo);
                condicionJpql.append(" >= ");
                break;
            case MENOR:
                condicionJpql.append("p.").append(filtro.campo);
                condicionJpql.append(" < ");
                break;
            case MENOR_O_IGUAL:
                condicionJpql.append("p.").append(filtro.campo);
                condicionJpql.append(" <= ");
                break;
            case DIFERENTE:
                condicionJpql.append("p.").append(filtro.campo);
                condicionJpql.append(" <> ");
                break;
            default:
                condicionJpql.append("p.").append(filtro.campo);
                condicionJpql.append(obtenerComparadorCondicion(filtro.valor.toString()));
        }

        condicionJpql.append(" :").append(filtro.nombre.replaceAll("[.]", "")).append(" ");

        return condicionJpql.toString();
    }

    /**
     * Obtiene el comparador a utilizar cuando el idReducido del TipoFiltro no
     * concuerda con el utilizado en las consultas jpql.
     *
     * @param valorFiltro Nombre del TipoFiltro (TipoFiltro.toString())
     * @return El comparador a insertar en la condicion de la consulta jpql.
     */
    private String obtenerComparadorCondicion(String valorFiltro) {

        StringBuilder comparador = new StringBuilder();

        switch (valorFiltro) {
            case NULL_VALUE:
                comparador.append(" IS NULL ");
                break;
            case NOT_NULL_VALUE:
                comparador.append(" IS NOT NULL ");
                break;
            default:
                comparador.append(" = ");
        }

        return comparador.toString();
    }

    /**
     * Devuelve la condicion de filtrado a anadir a una consulta JPQL
     *
     * @param filtros Los filtros a anadir a la consulta
     * @return Una clausula WHERE con la informacion de filtrado especificada.
     */
    private String getNativeSqlWhere(Collection<InformacionFiltro> filtros) {

        String rs = "";
        if (!filtros.isEmpty()) {
            rs = "where ";
            int idx = 0;
            for (InformacionFiltro filtro : filtros) {

                String concatenador = idx > 0 ? " and " : "";
                String comparador = filtro.tipo == TipoFiltro.LIKE ? "like" : "=";
                String aperturaValor = filtro.tipo == TipoFiltro.LIKE ? "'%" : "'";
                String cierreValor = filtro.tipo == TipoFiltro.LIKE ? "%'" : "'";
                rs += concatenador + filtro.campo + " " + comparador + " " + aperturaValor + filtro.valor + cierreValor;

                idx++;

            }
        }

        return rs;
    }

    /**
     * Debido a que en los nombres de los parametros de las consultas no se
     * puede insertar el caracter '.' y algunos nombres compuestos de atributos
     * de entidades se identifican con el nombre de la entidad del PK compuesto,
     * seguido del caracter '.' y del nombre del atributo, se reemplaza el '.'
     * por el caracter '_'.
     *
     * @param nombreAtributo Nombre del atributo a parsear
     * @return El nombre del atributo parseado para su utilizacion como nombre
     * del parametro.
     */
    private String obtenerNombreParametro(String nombreAtributo) {
        return nombreAtributo.replaceAll("[.]", "_");
    }

}
