package com.bioagricola.apirest.liquidacion.negocio;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.TerTerceroDTO;
import com.bioagricola.apirest.modelo.dtos.DsusDetsuscripDTO;
import com.bioagricola.apirest.modelo.entidades.DsusDetsuscrip;
import com.bioagricola.apirest.modelo.entidades.TerTercero;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDsusDetsuscrip;
import com.bioagricola.apirest.modelo.manejadores.ManejadorTerTercero;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionAgrupamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionFiltro;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionOrdenamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.RangoConsulta;
import com.bioagricola.apirest.modelo.utils.UtilOperaciones;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import java.io.IOException;
import java.math.BigDecimal;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

// protected region Incluya importaciones adicionales en esta seccion on begin

// protected region Incluya importaciones adicionales en esta seccion end

/**
 * Servicios para operaciones CRUD y de negocio sobre la entidad TerTercero
 *
 * @author GeneradorCRUD
 */
@Service
public class NegocioTerTercero extends NegocioAbstracto<TerTercero, TerTerceroDTO> {

    @Autowired
    private ManejadorTerTercero manejadorTerTercero;

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(NegocioTerTercero.class.getName());

    // protected region Declare atributos adicionales en esta seccion on begin

    // protected region Declare atributos adicionales en esta seccion end

    /**
     * Realiza un consulta en la entidad TerTercero aplicando los filtros, el
     * ordenamiento, y el rango (from y to) que se pasan como parámetro. Los
     * parámetros filterBy y orderBy pueden ser nulos. El parámetro from y to están
     * relacionados. Si from es diferente de nulo to puedo ser nulo, pero no al
     * revés. Ambos pueden ser nulos, en cuyo caso no se aplica una restricción de
     * rango a la consulta.
     *
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere filtrar, seguido por un operador de comparación que
     *                 puede tomar los valores
     *                 {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'},
     *                 y por último el valor por el que se quiere filtrar. Los
     *                 filtros se concatenan por el símbolo
     *                 {@literal '&' (AND) o '|' (OR)}. Ej. Una secuencia de
     *                 parámetros de filtrado puede ser
     *                 {@literal terTerceroId>1&terTerceroName:LIKE:juan}
     * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere ordenar, seguido por el símbolo '$' y
     *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos
     *                 ultimos valores son opcionales ya que si no se especifica por
     *                 defecto se asume que el ordenamiento es de forma Ascendente.
     *                 Si se coloca más de un parámetro debe ir separado por coma :
     *                 ','. Ej. Una secuencia de parámetros de ordenamiento puede
     *                 ser: terTerceroId$ASC, terTerceroName$DESC
     * @param from     Número de registro inicial que se quiere retornar de la
     *                 consulta realizada. Entero mayor o igual a 0
     * @param to       Número de registro final que se quiere retornar de la
     *                 consulta realizada. Entero mayor o igual al parámetro from
     * @return Una lista de DAOs de los TerTercero que se consultaron con los
     * parámetros enviados por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los
     *                                   parámetros de la url tenía un error de
     *                                   sintáxis por lo que no pudo ser procesado
     *                                   correctamente
     */
    public List<TerTerceroDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
            throws InvalidParameterException {
        // protected region Modifique el metodo consultar on begin
        logService(this.getClass().getName(), "consultar", filterBy, orderBy, from, to);

        List<InformacionFiltro> filtros = invocarDecodificacionFiltro(filterBy);
        List<InformacionOrdenamiento> ordenamiento = invocarDecodificacionOrdenamiento(orderBy);
        RangoConsulta rango = validarParametrosBloque(from, to);

        return convertirListaEntidadesADao(manejadorTerTercero.consultar(filtros, ordenamiento, rango));
        // protected region Modifique el metodo consultar end
    }

    /**
     * Crea el terTercero que se pasa como parámetro en la base de datos.
     *
     * @param terTerceroDTO El DAO de la entidad TerTercero a crear. Este se envía
     *                      en el cuerpo de la solicitud POST como un objeto JSON.
     * @return La insntancia de TerTercero recién creado
     */
    public TerTerceroDTO crear(TerTerceroDTO terTerceroDTO) {
        // protected region Modifique el metodo crear on begin

        logService(this.getClass().getName(), "crear", terTerceroDTO);

        TerTercero terTercero = new TerTercero();
        copiarPropiedades(terTercero, terTerceroDTO);

        manejadorTerTercero.save(terTercero);

        return terTerceroDTO;
        // protected region Modifique el metodo crear end
    }

    /**
     * Actualiza en la base de datos el terTercero que se pasa como parámetro.
     *
     * @param terTerceroDTO El DAO de la entidad TerTercero a actualizar. Este se
     *                      envía en el cuerpo de la solicitud PUT como un objeto
     *                      JSON.
     * @return La instancia de la entidad TerTercero que ha sido actualizado
     */
    public TerTerceroDTO actualizar(TerTerceroDTO terTerceroDTO) {
        // protected region Modifique el metodo actualizar on begin

        logService(this.getClass().getName(), "actualizar", terTerceroDTO);

        TerTercero terTercero = manejadorTerTercero.getOne(terTerceroDTO.getTerIderegistro());
        copiarPropiedades(terTercero, terTerceroDTO);

        manejadorTerTercero.save(terTercero);

        return terTerceroDTO;
        // protected region Modifique el metodo actualizar end
    }

    /**
     * Elimina el terTercero con el identificador que se pasa como parámetro.
     *
     * @param terIderegistro Valor del atributo del identificador de la instancia de
     *                       la entidad terTercero a eliminar
     * @return El identificador del terTercero que ha sido eliminado
     */
    public String eliminar(Long terIderegistro) {
        // protected region Modifique el metodo eliminar on begin

        logService(this.getClass().getName(), "eliminar", terIderegistro);
        manejadorTerTercero.deleteById(terIderegistro);

        StringBuilder valores = new StringBuilder();
        valores.append(String.valueOf(terIderegistro));
        return valores.toString();
        // protected region Modifique el metodo eliminar end
    }

    /**
     * Cuenta la cantidad de registros que devuelve la consulta a la tabla de
     * aplicando los filtros o rangos que se pasen como parámetro. Estos pueden ser
     * nulos, en cuyo caso a la consulta no se le realiza ningún tipo de filtrado.
     *
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere filtrar, seguido por un operador de comparación que
     *                 puede tomar los valores
     *                 {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'},
     *                 y por último el valor por el que se quiere filtrar. Los
     *                 filtros se concatenan por el símbolo
     *                 {@literal '&' (AND) o '|' (OR)}. Ej. Una secuencia de
     *                 parámetros de filtrado puede ser
     *                 {@literal terTerceroId>1&terTerceroName:LIKE:juan}
     * @param from     Número de registro inicial que se quiere retornar de la
     *                 consulta realizada. Entero mayor o igual a 0
     * @param to       Número de registro final que se quiere retornar de la
     *                 consulta realizada. Entero mayor o igual al parámetro from
     * @return El número de registros contados a partir de los parámetros enviados
     * por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los
     *                                   parámetros de la url tenía un error de
     *                                   sintáxis por lo que no pudo ser procesado
     *                                   correctamente
     */
    public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException {
        // protected region Modifique el metodo contar on begin

        logService(this.getClass().getName(), "contar", filterBy);

        List<InformacionFiltro> filtros = invocarDecodificacionFiltro(filterBy);
        RangoConsulta rango = validarParametrosBloque(from, to);

        return String.valueOf(manejadorTerTercero.consultarTotalRegistros(filtros, rango));
        // protected region Modifique el metodo contar end
    }

    /**
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere filtrar, seguido por un operador de comparación que
     *                 puede tomar los valores
     *                 {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'},
     *                 y por último el valor por el que se quiere filtrar. Los
     *                 filtros se concatenan por el símbolo
     *                 {@literal '&' (AND) o '|' (OR)}. Ej. Una secuencia de
     *                 parámetros de filtrado puede ser
     *                 {@literal terTerceroId>1&terTerceroName:LIKE:juan}
     * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere ordenar, seguido por el símbolo '$' y
     *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos
     *                 ultimos valores son opcionales ya que si no se especifica por
     *                 defecto se asume que el ordenamiento es de forma Ascendente.
     *                 Si se coloca más de un parámetro debe ir separado por coma :
     *                 ','. Ej. Una secuencia de parámetros de ordenamiento puede
     *                 ser: terTerceroId$ASC, terTerceroName$DESC
     * @param atributo Nombre del atributo de la entidad TerTercero del cual se
     *                 quieren obtener los diferentes valores.
     * @return Una lista con los diferentes valores que se encuentran en la columna
     * de la tabla asociada al atributo.
     * @throws InvalidParameterException Si el atributo no existe en la entidad o si
     *                                   los filtros y el ordenamiento contienen
     *                                   atributos de la entidad que no existen.
     */
    public List<String> consultarLista(String filterBy, String orderBy, String atributo)
            throws InvalidParameterException {
        // protected region Modifique el metodo consultarLista on begin

        logService(this.getClass().getName(), "contar", filterBy, orderBy, atributo);

        List<InformacionFiltro> filtros = invocarDecodificacionFiltro(filterBy);
        List<InformacionOrdenamiento> ordenamiento = invocarDecodificacionOrdenamiento(orderBy);
        InformacionAgrupamiento infoAgrupamiento = decodificarInformacionAgrupamiento(atributo);

        return UtilOperaciones.convertirListaObjetosAString(
                manejadorTerTercero.consultarLista(filtros, ordenamiento, infoAgrupamiento));
        // protected region Modifique el metodo consultarLista end
    }

    public List<String> consultarNombresPorEmpresa() {

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

        List<String> response = new ArrayList<>();
        response = manejadorTerTercero.consultarNombresPorEmpresa(idEmpresa);

        return response;
    }
    /**
     * {@inheritDoc}
     *
     * @param nombreAtributo {@inheritDoc}
     * @return {@inheritDoc}
     */
    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        return TerTercero.contieneAtributo(nombreAtributo);
    }

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    protected Logger getLogger() {
        return logger;
    }

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    protected TerTerceroDTO instanciarDAO() {
        return new TerTerceroDTO();
    }

    // protected region Use esta region para su implementacion de otros metodos on
    // begin

    /**
     * Búsqueda de Clientes por nombre completo, documento e id de Empresa
     *
     * @param fullname parámetro con el nombre completo a buscar, puede ser null
     * @param id       parámetro con el documento de identificación a buscar, puede ser null
     * @return
     */
    public List<TerTerceroDTO> searchClientsByFullNameOrId(String fullname, String id) {
        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmp = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<TerTerceroDTO> terceroDTOList = new ArrayList<>();

        Specification<TerTercero> spec = (root, query, cb) -> {
            final List<Predicate> predicates = new ArrayList<>();
            final Join<TerTercero, DsusDetsuscrip> dsusDetsuscripJoin = root.join("dsusDetsuscripTerIderegistroFkeyes");

            predicates.add(cb.equal(dsusDetsuscripJoin.get("empIderegistro"), idEmp));

            if (fullname != null)
                predicates.add(cb.like(cb.upper(root.get("terNomcompleto")), "%" + fullname.toUpperCase(Locale.ROOT) + "%"));

            if (id != null)
                predicates.add(cb.like(root.get("terDocumento"), "%" + id + "%"));

            return cb.and(predicates.toArray(new Predicate[predicates.size()]));
        };

        manejadorTerTercero.findAll(spec, PageRequest.of(0, 20))
                .forEach(source -> terceroDTOList.add(convertSourceToTarget(source)));
        return terceroDTOList;
    }
    
    public List<TerTerceroDTO> searchTerceroByFullNameOrId(String fullname, String id) {
        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmp = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<TerTerceroDTO> terceroDTOList = new ArrayList<>();

        Specification<TerTercero> spec = (root, query, cb) -> {
            final List<Predicate> predicates = new ArrayList<>();

            if (fullname != null)
                predicates.add(cb.like(cb.upper(root.get("terNomcompleto")), "%" + fullname.toUpperCase(Locale.ROOT) + "%"));

            if (id != null)
                predicates.add(cb.like(root.get("terDocumento"), "%" + id + "%"));

            return cb.and(predicates.toArray(new Predicate[predicates.size()]));
        };

        manejadorTerTercero.findAll(spec, PageRequest.of(0, 20))
                .forEach(source -> terceroDTOList.add(convertSourceToTarget(source)));
        return terceroDTOList;
    }

    /**
     * @param source
     * @return
     */
    private TerTerceroDTO convertSourceToTarget(TerTercero source) {
        TerTerceroDTO target = new TerTerceroDTO();

        copiarPropiedades(target, source);
        return target;
    }
    // protected region Use esta region para su implementacion de otros metodos end
}
