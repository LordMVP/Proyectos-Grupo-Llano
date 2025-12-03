package com.bioagricola.apirest.liquidacion.web.servicio;

import com.bioagricola.apirest.liquidacion.negocio.NegocioPerPeriodo;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IPerPeriodo;
import com.bioagricola.apirest.modelo.dtos.PerPeriodoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad PerPeriodo
 *
 * @author GeneradorCRUD
 */
@RestController
@RequestMapping("/webresources/servicios/perperiodo")
public class ServicioPerPeriodo implements IPerPeriodo {

    @Autowired
    private NegocioPerPeriodo negocioPerPeriodo;

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(ServicioPerPeriodo.class.getName());

    /**
     * Realiza un consulta en la entidad PerPeriodo aplicando los filtros, el ordenamiento,
     * y el rango (from y to) que se pasan como parámetro. Los parámetros filterBy y orderBy
     * pueden ser nulos. El parámetro from y to están relacionados. Si from es diferente de nulo
     * to puedo ser nulo, pero no al revés. Ambos pueden ser nulos, en cuyo caso no se aplica una
     * restricción de rango a la consulta.
     *
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     *                 de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     *                 por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     *                 Ej. Una secuencia de parámetros de filtrado puede ser {@literal perPeriodoId>1&perPeriodoName:LIKE:juan}
     * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere ordenar, seguido por el símbolo '$' y
     *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos ultimos valores son opcionales ya que si
     *                 no se especifica por defecto se asume que el ordenamiento es de forma Ascendente. Si se coloca más de un
     *                 parámetro debe ir separado por coma : ','.
     *                 Ej. Una secuencia de parámetros de ordenamiento puede ser: perPeriodoId$ASC, perPeriodoName$DESC
     * @param from     Número de registro inicial que se quiere retornar de la consulta realizada. Entero mayor o igual a 0
     * @param to       Número de registro final que se quiere retornar de la consulta realizada. Entero mayor o igual al parámetro from
     * @return Una lista de DAOs de los PerPeriodo que se consultaron con los parámetros enviados por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    @GetMapping
    public List<PerPeriodoDTO> consultar(@RequestParam(value = "filterBy") String filterBy,
                                         @RequestParam(value = "orderBy") String orderBy, @RequestParam(value = "from") Integer from,
                                         @RequestParam(value = "to") Integer to)
            throws InvalidParameterException {
        // protected region Use esta region para su implementacion on begin

        return negocioPerPeriodo.consultar(filterBy, orderBy, from, to);
        // protected region Use esta region para su implementacion end 
    }

    /**
     * Crea el perPeriodo que se pasa como parámetro en la base de datos.
     *
     * @param perPeriodoDTO El DAO de la entidad PerPeriodo a crear. Este se envía en el cuerpo de la
     *                      solicitud POST como un objeto JSON.
     * @return El identificador de la insntancia de PerPeriodo recién creado
     */
    @PostMapping(consumes = "application/json", produces = "application/json")
    public PerPeriodoDTO crear(@RequestBody PerPeriodoDTO perPeriodoDTO) {
        // protected region Use esta region para su implementacion on begin

        return negocioPerPeriodo.crear(perPeriodoDTO);
        // protected region Use esta region para su implementacion end 

    }

    /**
     * Actualiza en la base de datos el perPeriodo que se pasa como parámetro.
     *
     * @param perPeriodoDTO El DAO de la entidad PerPeriodo a actualizar. Este se envía en el cuerpo de la
     *                      solicitud PUT como un objeto JSON.
     * @return El identificador de la instancia de la entidad PerPeriodo que ha sido actualizado
     */
    @PutMapping(consumes = "application/json", produces = "application/json")
    public PerPeriodoDTO actualizar(@RequestBody PerPeriodoDTO perPeriodoDTO) {
        // protected region Use esta region para su implementacion on begin

        return negocioPerPeriodo.actualizar(perPeriodoDTO);
        // protected region Use esta region para su implementacion end
    }

    /**
     * Elimina el perPeriodo con el identificador que se pasa como parámetro.
     *
     * @param perIderegistro Valor del atributo del identificador de la instancia de la entidad  perPeriodo a eliminar
     * @return El identificador del perPeriodo que ha sido eliminado
     */
    @DeleteMapping
    public String eliminar(@RequestParam("perIderegistro") Integer perIderegistro) {
        // protected region Use esta region para su implementacion on begin

        return negocioPerPeriodo.eliminar(perIderegistro);
        // protected region Use esta region para su implementacion end
    }

    /**
     * Cuenta la cantidad de registros que devuelve la consulta a la tabla de
     * aplicando los filtros o rangos que se pasen como parámetro. Estos
     * pueden ser nulos, en cuyo caso a la consulta no se le realiza ningún tipo de
     * filtrado.
     *
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     *                 de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     *                 por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     *                 Ej. Una secuencia de parámetros de filtrado puede ser {@literal perPeriodoId>1&perPeriodoName:LIKE:juan}
     * @param from     Número de registro inicial que se quiere retornar de la consulta realizada. Entero mayor o igual a 0
     * @param to       Número de registro final que se quiere retornar de la consulta realizada. Entero mayor o igual al parámetro from
     * @return El número de registros contados a partir de los parámetros enviados por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    @GetMapping("/contar")
    public String contar(@RequestParam(value = "filterBy") String filterBy,
                         @RequestParam(value = "from") Integer from,
                         @RequestParam(value = "to") Integer to) throws InvalidParameterException {
        // protected region Use esta region para su implementacion on begin

        return negocioPerPeriodo.contar(filterBy, from, to);
        // protected region Use esta region para su implementacion end
    }

    /**
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     *                 de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     *                 por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     *                 Ej. Una secuencia de parámetros de filtrado puede ser {@literal perPeriodoId>1&perPeriodoName:LIKE:juan}
     * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere ordenar, seguido por el símbolo '$' y
     *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos ultimos valores son opcionales ya que si
     *                 no se especifica por defecto se asume que el ordenamiento es de forma Ascendente. Si se coloca más de un
     *                 parámetro debe ir separado por coma : ','.
     *                 Ej. Una secuencia de parámetros de ordenamiento puede ser: perPeriodoId$ASC, perPeriodoName$DESC
     * @param atributo Nombre del atributo de la entidad PerPeriodo del cual se quieren obtener los diferentes valores.
     * @return Una lista con los diferentes valores que se encuentran en la columna de la tabla asociada al atributo.
     * @throws InvalidParameterException Si el atributo no existe en la entidad o si los filtros y el ordenamiento
     *                                   contienen atributos de la entidad que no existen.
     */
    @GetMapping("/lista")
    public List<String> consultarLista(@RequestParam(value = "filterBy") String filterBy,
                                       @RequestParam(value = "orderBy") String orderBy, @RequestParam(value = "atributo") String atributo) throws InvalidParameterException {
        // protected region Use esta region para su implementacion on begin
        return negocioPerPeriodo.consultarLista(filterBy, orderBy, atributo);
        // protected region Use esta region para su implementacion end
    }

    // protected region Use esta region para su implementacion de otros servicios on begin
    // protected region Use esta region para su implementacion de otros servicios end

}
