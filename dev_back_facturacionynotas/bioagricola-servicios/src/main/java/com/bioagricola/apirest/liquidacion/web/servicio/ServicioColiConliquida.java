package com.bioagricola.apirest.liquidacion.web.servicio;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioColiConliquida;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IConceptosLiquidacion;
import com.bioagricola.apirest.modelo.dtos.ColiConliquidaDTO;
import com.bioagricola.apirest.modelo.dtos.RequestConceptosLiquidacion;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;


/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad ColiConliquida
 * @author GeneradorCRUD
 */
@RestController
@RequestMapping("/webresources/servicios/coliconliquida")
public class ServicioColiConliquida implements IConceptosLiquidacion{

    @Autowired
    private NegocioColiConliquida negocioColiConliquida;

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(ServicioColiConliquida.class.getName());

    /**
     * Realiza un consulta en la entidad ColiConliquida aplicando los filtros, el ordenamiento,
     * y el rango (from y to) que se pasan como parámetro. Los parámetros filterBy y orderBy
     * pueden ser nulos. El parámetro from y to están relacionados. Si from es diferente de nulo
     * to puedo ser nulo, pero no al revés. Ambos pueden ser nulos, en cuyo caso no se aplica una
     * restricción de rango a la consulta.
     * 
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     * de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     * por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     * Ej. Una secuencia de parámetros de filtrado puede ser {@literal coliConliquidaId>1&coliConliquidaName:LIKE:juan}
     * @param orderBy Cadena de caracteres con los parámetros de ordenamiento. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere ordenar, seguido por el símbolo '$' y 
     * posteriormente por los valores 'ASC' o 'DESC'. Estos dos ultimos valores son opcionales ya que si
     * no se especifica por defecto se asume que el ordenamiento es de forma Ascendente. Si se coloca más de un
     * parámetro debe ir separado por coma : ','.
     * Ej. Una secuencia de parámetros de ordenamiento puede ser: coliConliquidaId$ASC, coliConliquidaName$DESC
     * @param from Número de registro inicial que se quiere retornar de la consulta realizada. Entero mayor o igual a 0
     * @param to Número de registro final que se quiere retornar de la consulta realizada. Entero mayor o igual al parámetro from
     * @return Una lista de DAOs de los ColiConliquida que se consultaron con los parámetros enviados por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    @GetMapping
    public List<ColiConliquidaDTO> consultar(@RequestParam(value="filterBy") String filterBy, 
                @RequestParam(value="orderBy") String orderBy, @RequestParam(value="from") Integer from,
                @RequestParam(value="to") Integer to) 
            throws InvalidParameterException {
        // protected region Use esta region para su implementacion on begin
        
        return negocioColiConliquida.consultar(filterBy, orderBy, from, to);
        // protected region Use esta region para su implementacion end 
    }

    /**
     * Crea el coliConliquida que se pasa como parámetro en la base de datos.
     * 
     * @param coliConliquidaDTO El DAO de la entidad ColiConliquida a crear. Este se envía en el cuerpo de la
     * solicitud POST como un objeto JSON.
     * @return El identificador de la insntancia de ColiConliquida recién creado
     */
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ColiConliquidaDTO crear(@RequestBody ColiConliquidaDTO coliConliquidaDTO) {
        // protected region Use esta region para su implementacion on begin

        return negocioColiConliquida.crear(coliConliquidaDTO);
        // protected region Use esta region para su implementacion end 
        
    }

    /**
     * Actualiza en la base de datos el coliConliquida que se pasa como parámetro.
     * 
     * @param coliConliquidaDTO El DAO de la entidad ColiConliquida a actualizar. Este se envía en el cuerpo de la
     * solicitud PUT como un objeto JSON.
     * @return El identificador de la instancia de la entidad ColiConliquida que ha sido actualizado
     */
    @PutMapping(consumes = "application/json", produces = "application/json")
    public ColiConliquidaDTO actualizar(@RequestBody ColiConliquidaDTO coliConliquidaDTO){
        // protected region Use esta region para su implementacion on begin

        return negocioColiConliquida.actualizar(coliConliquidaDTO);
        // protected region Use esta region para su implementacion end
    }

    /**
     * Elimina el coliConliquida con el identificador que se pasa como parámetro.
     * 
     * @param uniConcepto Valor del atributo del identificador de la instancia de la entidad  coliConliquida a eliminar
     * @param uniLiquidacion Valor del atributo del identificador de la instancia de la entidad  coliConliquida a eliminar
     * @return El identificador del coliConliquida que ha sido eliminado
     */
    @DeleteMapping
    public String eliminar(@RequestParam("uniConcepto") Integer uniConcepto, @RequestParam("uniLiquidacion") Integer uniLiquidacion) {
        // protected region Use esta region para su implementacion on begin

        return negocioColiConliquida.eliminar(uniConcepto, uniLiquidacion);
        // protected region Use esta region para su implementacion end
    }

    /**
     * Cuenta la cantidad de registros que devuelve la consulta a la tabla de 
     * aplicando los filtros o rangos que se pasen como parámetro. Estos 
     * pueden ser nulos, en cuyo caso a la consulta no se le realiza ningún tipo de
     * filtrado.
     * 
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     * de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     * por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     * Ej. Una secuencia de parámetros de filtrado puede ser {@literal coliConliquidaId>1&coliConliquidaName:LIKE:juan}
     * @param from Número de registro inicial que se quiere retornar de la consulta realizada. Entero mayor o igual a 0
     * @param to Número de registro final que se quiere retornar de la consulta realizada. Entero mayor o igual al parámetro from
     * @return El número de registros contados a partir de los parámetros enviados por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    @GetMapping("/contar")
    public String contar(@RequestParam(value="filterBy") String filterBy,
             @RequestParam(value="from") Integer from,
                @RequestParam(value="to") Integer to) throws InvalidParameterException {        
        // protected region Use esta region para su implementacion on begin

        return negocioColiConliquida.contar(filterBy, from, to);
        // protected region Use esta region para su implementacion end
    }    
    
    /**
     * 
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     * de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     * por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     * Ej. Una secuencia de parámetros de filtrado puede ser {@literal coliConliquidaId>1&coliConliquidaName:LIKE:juan}
     * @param orderBy Cadena de caracteres con los parámetros de ordenamiento. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere ordenar, seguido por el símbolo '$' y 
     * posteriormente por los valores 'ASC' o 'DESC'. Estos dos ultimos valores son opcionales ya que si
     * no se especifica por defecto se asume que el ordenamiento es de forma Ascendente. Si se coloca más de un
     * parámetro debe ir separado por coma : ','.
     * Ej. Una secuencia de parámetros de ordenamiento puede ser: coliConliquidaId$ASC, coliConliquidaName$DESC
     * @param atributo Nombre del atributo de la entidad ColiConliquida del cual se quieren obtener los diferentes valores.
     * @return Una lista con los diferentes valores que se encuentran en la columna de la tabla asociada al atributo.
     * @throws InvalidParameterException Si el atributo no existe en la entidad o si los filtros y el ordenamiento 
     * contienen atributos de la entidad que no existen.
     */
    @GetMapping("/lista")
    public List<String> consultarLista(@RequestParam(value="filterBy") String filterBy,
             @RequestParam(value="orderBy") String orderBy, @RequestParam(value="atributo") String atributo) throws InvalidParameterException{
        // protected region Use esta region para su implementacion on begin
        return negocioColiConliquida.consultarLista(filterBy, orderBy, atributo);
        // protected region Use esta region para su implementacion end
    }

	@Override
	public Object[] getConceptosLiquidacion(RequestConceptosLiquidacion requestId) {
		// TODO Auto-generated method stub
		return null;
	}     
    
   /*@Override
   @PostMapping(value="/ConceptosLiquidacion",consumes = "application/json")
    public Object[] getConceptosLiquidacion(@RequestBody RequestConceptosLiquidacion requestId) {
    	return negocioColiConliquida.getConceptosLiquidacion(
    			requestId.getidliquidacion());
    	}

*/
}
