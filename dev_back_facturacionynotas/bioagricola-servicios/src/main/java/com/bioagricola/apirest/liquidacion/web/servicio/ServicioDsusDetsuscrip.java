package com.bioagricola.apirest.liquidacion.web.servicio;

import com.bioagricola.apirest.liquidacion.negocio.NegocioDsusDetsuscrip;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IDsusDetsuscrip;
import com.bioagricola.apirest.modelo.dtos.*;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.utils.GeneralBodyResponse;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad
 * DsusDetsuscrip
 * 
 * @author GeneradorCRUD
 */
@RestController
@RequestMapping("/webresources/servicios/dsusdetsuscrip")
public class ServicioDsusDetsuscrip implements IDsusDetsuscrip {

	@Autowired
	private NegocioDsusDetsuscrip negocioDsusDetsuscrip;

	/**
	 * Realiza un consulta en la entidad DsusDetsuscrip aplicando los filtros, el
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
	 *                 {@literal dsusDetsuscripId>1&dsusDetsuscripName:LIKE:juan}
	 * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada
	 *                 parámetro está compuesto por el nombre del campo por el que
	 *                 se quiere ordenar, seguido por el símbolo '$' y
	 *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos
	 *                 ultimos valores son opcionales ya que si no se especifica por
	 *                 defecto se asume que el ordenamiento es de forma Ascendente.
	 *                 Si se coloca más de un parámetro debe ir separado por coma :
	 *                 ','. Ej. Una secuencia de parámetros de ordenamiento puede
	 *                 ser: dsusDetsuscripId$ASC, dsusDetsuscripName$DESC
	 * @param from     Número de registro inicial que se quiere retornar de la
	 *                 consulta realizada. Entero mayor o igual a 0
	 * @param to       Número de registro final que se quiere retornar de la
	 *                 consulta realizada. Entero mayor o igual al parámetro from
	 * @return Una lista de DAOs de los DsusDetsuscrip que se consultaron con los
	 *         parámetros enviados por el cliente
	 * @throws InvalidParameterException Excepción lanzada cuando algunos de los
	 *                                   parámetros de la url tenía un error de
	 *                                   sintáxis por lo que no pudo ser procesado
	 *                                   correctamente
	 */
	@GetMapping
	public List<DsusDetsuscripDTO> consultar(@RequestParam(value = "filterBy") String filterBy,
			@RequestParam(value = "orderBy") String orderBy, @RequestParam(value = "from") Integer from,
			@RequestParam(value = "to") Integer to) throws InvalidParameterException {
		// protected region Use esta region para su implementacion on begin

		return negocioDsusDetsuscrip.consultar(filterBy, orderBy, from, to);
		// protected region Use esta region para su implementacion end
	}

	/**
	 * Crea el dsusDetsuscrip que se pasa como parámetro en la base de datos.
	 * 
	 * @param dsusDetsuscripDTO El DAO de la entidad DsusDetsuscrip a crear. Este se
	 *                          envía en el cuerpo de la solicitud POST como un
	 *                          objeto JSON.
	 * @return El identificador de la insntancia de DsusDetsuscrip recién creado
	 */
	@PostMapping(consumes = "application/json", produces = "application/json")
	public DsusDetsuscripDTO crear(@RequestBody DsusDetsuscripDTO dsusDetsuscripDTO) {
		// protected region Use esta region para su implementacion on begin

		return negocioDsusDetsuscrip.crear(dsusDetsuscripDTO);
		// protected region Use esta region para su implementacion end

	}

	/**
	 * Actualiza en la base de datos el dsusDetsuscrip que se pasa como parámetro.
	 * 
	 * @param dsusDetsuscripDTO El DAO de la entidad DsusDetsuscrip a actualizar.
	 *                          Este se envía en el cuerpo de la solicitud PUT como
	 *                          un objeto JSON.
	 * @return El identificador de la instancia de la entidad DsusDetsuscrip que ha
	 *         sido actualizado
	 */
	@PutMapping(consumes = "application/json", produces = "application/json")
	public DsusDetsuscripDTO actualizar(@RequestBody DsusDetsuscripDTO dsusDetsuscripDTO) {
		// protected region Use esta region para su implementacion on begin

		return negocioDsusDetsuscrip.actualizar(dsusDetsuscripDTO);
		// protected region Use esta region para su implementacion end
	}

	/**
	 * Elimina el dsusDetsuscrip con el identificador que se pasa como parámetro.
	 * 
	 * @param dsusIderegistr Valor del atributo del identificador de la instancia de
	 *                       la entidad dsusDetsuscrip a eliminar
	 * @return El identificador del dsusDetsuscrip que ha sido eliminado
	 */
	@DeleteMapping
	public String eliminar(@RequestParam("dsusIderegistr") Long dsusIderegistr) {
		// protected region Use esta region para su implementacion on begin

		return negocioDsusDetsuscrip.eliminar(dsusIderegistr);
		// protected region Use esta region para su implementacion end
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
	 *                 {@literal dsusDetsuscripId>1&dsusDetsuscripName:LIKE:juan}
	 * @param from     Número de registro inicial que se quiere retornar de la
	 *                 consulta realizada. Entero mayor o igual a 0
	 * @param to       Número de registro final que se quiere retornar de la
	 *                 consulta realizada. Entero mayor o igual al parámetro from
	 * @return El número de registros contados a partir de los parámetros enviados
	 *         por el cliente
	 * @throws InvalidParameterException Excepción lanzada cuando algunos de los
	 *                                   parámetros de la url tenía un error de
	 *                                   sintáxis por lo que no pudo ser procesado
	 *                                   correctamente
	 */
	@GetMapping("/contar")
	public String contar(@RequestParam(value = "filterBy") String filterBy, @RequestParam(value = "from") Integer from,
			@RequestParam(value = "to") Integer to) throws InvalidParameterException {
		// protected region Use esta region para su implementacion on begin

		return negocioDsusDetsuscrip.contar(filterBy, from, to);
		// protected region Use esta region para su implementacion end
	}

	/**
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
	 *                 {@literal dsusDetsuscripId>1&dsusDetsuscripName:LIKE:juan}
	 * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada
	 *                 parámetro está compuesto por el nombre del campo por el que
	 *                 se quiere ordenar, seguido por el símbolo '$' y
	 *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos
	 *                 ultimos valores son opcionales ya que si no se especifica por
	 *                 defecto se asume que el ordenamiento es de forma Ascendente.
	 *                 Si se coloca más de un parámetro debe ir separado por coma :
	 *                 ','. Ej. Una secuencia de parámetros de ordenamiento puede
	 *                 ser: dsusDetsuscripId$ASC, dsusDetsuscripName$DESC
	 * @param atributo Nombre del atributo de la entidad DsusDetsuscrip del cual se
	 *                 quieren obtener los diferentes valores.
	 * @return Una lista con los diferentes valores que se encuentran en la columna
	 *         de la tabla asociada al atributo.
	 * @throws InvalidParameterException Si el atributo no existe en la entidad o si
	 *                                   los filtros y el ordenamiento contienen
	 *                                   atributos de la entidad que no existen.
	 */
	@GetMapping("/lista")
	public List<String> consultarLista(@RequestParam(value = "filterBy") String filterBy,
			@RequestParam(value = "orderBy") String orderBy, @RequestParam(value = "atributo") String atributo)
			throws InvalidParameterException {
		// protected region Use esta region para su implementacion on begin
		return negocioDsusDetsuscrip.consultarLista(filterBy, orderBy, atributo);
		// protected region Use esta region para su implementacion end
	}

	/**
	 * Servicio de consulta de detalle de suscripcion/es según los parámetros
	 * ingresados
	 * 
	 * @param idSuscripcion    valor opcional del id de suscripción a consultar
	 * @param nombreTercero    valor opcional para la consulta de detalles de
	 *                         suscripción
	 * @param documentoTercero valor opcional para la consulta de detalles de
	 *                         suscripción
	 * @param ciclo            valor opcional para la consulta de detalles de
	 *                         suscripción id de ciclo
	 * @param documento        valor opcional para la consulta de detalles de
	 *                         suscripción id del documento
	 * @param tipoDocumento    valor opcional para la consulta de detalles de
	 *                         suscripción id del tipo de documento
	 * @param pagina           valor correspondiente al número de página para hacer
	 *                         la consulta
	 * @param tamanoPagina     valor correspondiente al número de objetos a
	 *                         consultar y que retornará el servicio
	 * @throws ParseException
	 */
	@GetMapping("/consultaDetalle")
	public ResponseConsultaDetalleSuscripcionDTO consultaDetalle(
			@RequestParam(value = "idSuscripcion") Long idSuscripcion,
			@RequestParam(value = "nombreTercero") String nombreTercero,
			@RequestParam(value = "documentoTercero") String documentoTercero,
			@RequestParam(value = "ciclo") Integer ciclo, @RequestParam(value = "documento") Integer documento,
			@RequestParam(value = "tipoDocumento") Integer tipoDocumento,
			@RequestParam(value = "numCatastral") String numCatastral,
			@RequestParam(value = "codAntSuscripcion") String codAntSuscripcion,
			@RequestParam(value = "pagina") Integer pagina, @RequestParam(value = "tamanoPagina") Integer tamanoPagina,
			@RequestParam(value = "fechaDesde") String fechaDesde,
			@RequestParam(value = "fechaHasta") String fechaHasta) throws InvalidParameterException, ParseException {

		return negocioDsusDetsuscrip.consultaDetalle(idSuscripcion, nombreTercero, documentoTercero, ciclo, documento,
				tipoDocumento, numCatastral, codAntSuscripcion, pagina, tamanoPagina, fechaDesde, fechaHasta);
	}

	@GetMapping("/consultaDetalleEstrato")
	public ResponseConsultaDetalleSuscripcionDTO consultaDetalleEstrato(
			@RequestParam(value = "idSuscripcion") Long idSuscripcion,
			@RequestParam(value = "nombreTercero") String nombreTercero,
			@RequestParam(value = "documentoTercero") String documentoTercero,
			@RequestParam(value = "ciclo") Integer ciclo, @RequestParam(value = "documento") Integer documento,
			@RequestParam(value = "tipoDocumento") Integer tipoDocumento,
			@RequestParam(value = "numCatastral") String numCatastral,
			@RequestParam(value = "codAntSuscripcion") String codAntSuscripcion,
			@RequestParam(value = "pagina") Integer pagina, @RequestParam(value = "tamanoPagina") Integer tamanoPagina,
			@RequestParam(value = "fechaDesde") String fechaDesde,
			@RequestParam(value = "fechaHasta") String fechaHasta) throws IOException {

		return negocioDsusDetsuscrip.consultaDetalleEstrato(idSuscripcion, nombreTercero, documentoTercero, ciclo,
				documento, tipoDocumento, numCatastral, codAntSuscripcion, pagina, tamanoPagina, fechaDesde,
				fechaHasta);
	}

	@GetMapping("/consultaDetalleTipoUso")
	public ResponseConsultaDetalleSuscripcionDTO consultaDetalleTipoUso(
			@RequestParam(value = "idSuscripcion") Long idSuscripcion,
			@RequestParam(value = "nombreTercero") String nombreTercero,
			@RequestParam(value = "documentoTercero") String documentoTercero,
			@RequestParam(value = "ciclo") Integer ciclo, @RequestParam(value = "documento") Integer documento,
			@RequestParam(value = "tipoDocumento") Integer tipoDocumento,
			@RequestParam(value = "numCatastral") String numCatastral,
			@RequestParam(value = "codAntSuscripcion") String codAntSuscripcion,
			@RequestParam(value = "pagina") Integer pagina, @RequestParam(value = "tamanoPagina") Integer tamanoPagina,
			@RequestParam(value = "fechaDesde") String fechaDesde,
			@RequestParam(value = "fechaHasta") String fechaHasta) {

		return negocioDsusDetsuscrip.consultaDetalleTipoUso(idSuscripcion, nombreTercero, documentoTercero, ciclo,
				documento, tipoDocumento, numCatastral, codAntSuscripcion, pagina, tamanoPagina, fechaDesde,
				fechaHasta);
	}

	/**
	 * Servicio de consulta de ID de suscripcion a partir de la empresa y numero del
	 * medidor
	 * 
	 * @param empresaId     valor del id de la empresa que pertenece el medidor
	 * @param numeroMedidor Codigo unico del medidor de la propiedad o predio
	 */

	@GetMapping("/consultaPorMedidor")
	public List<ConsultaMedidorSuscriptcionDTO> consultaId(@RequestParam(value = "empresaId") String empresaId,
			@RequestParam(value = "numeroMedidor") String numeroMedidor,
			@RequestParam(value = "codigoAnterior") String codigoAnterior) throws InvalidParameterException {

		return negocioDsusDetsuscrip.consultaIdMedidor(empresaId, numeroMedidor, codigoAnterior);
	}

	/**
	 * Método de servicio encargado de consultar las suscripciones a las que se les
	 * quiere realizar la marcación por deshabitado a futuro, con tal de validar si
	 * ya existe o no
	 * 
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 * @throws ParseException
	 */
	@PostMapping(path = "/consultaMarcacionTarifa", consumes = "application/json", produces = "application/json")
	public ResponseMarcacionTarifaDeshabitadoDTO consultaMarcacionTarifa(
			@RequestBody RequestConsultaMarcacionTarifaDTO requestConsultaMarcacionTarifaDTO)
			throws IOException, ParseException {

		return negocioDsusDetsuscrip.consultaMarcacionTarifa(requestConsultaMarcacionTarifaDTO);
	}

	/**
	 * Método de servicio encargado de consultar las suscripciones que fueron
	 * reliquidadas
	 * 
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 */
	@PostMapping(path = "/consultaSuscripReliquidadas", consumes = "application/json", produces = "application/json")
	public ResponseConsulSuscripReliquidadasDTO consultaSuscripcionesReliquidadas(
			@RequestBody RequestConsulSuscripReliquidadasDTO requestConsulSuscripReliquidadasDTO) throws IOException {

		return negocioDsusDetsuscrip.consultaSuscripcionesReliquidadas(requestConsulSuscripReliquidadasDTO);
	}

	/**
	 * Método de servicio encargado de consultar los conceptos de las suscripciones
	 * que fueron reliquidadas
	 */
	@GetMapping("/consultaConceptosSuscripReliquidada")
	public List<ConceptoSuscripcionReliquidadaDTO> consultaConceptosSuscripcionesReliquidadas(
			@RequestParam(value = "facIderegistro") Long facIderegistro) {

		return negocioDsusDetsuscrip.consultaConceptosSuscripcionesReliquidadas(facIderegistro);
	}

	/**
	 * Servicio de consulta de facturas de aforados
	 * 
	 * @param idSuscripcion
	 * @param nombreTercero
	 * @param documentoTercero
	 * @param ciclo
	 * @param documento
	 * @param tipoDocumento
	 * @param numCatastral
	 * @param codAntSuscripcion
	 * @param pagina
	 * @param tamanoPagina
	 * @param fechaDesde
	 * @param fechaHasta
	 * @return
	 * @throws InvalidParameterException
	 * @throws ParseException
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	@GetMapping("/consultaDetalleAforados")
	public ResponseConsultaDetalleSuscripcionDTO consultaDetalleAforados(
			@RequestParam(value = "idSuscripcion") Integer idSuscripcion,
			@RequestParam(value = "nombreTercero") String nombreTercero,
			@RequestParam(value = "documentoTercero") String documentoTercero,
			@RequestParam(value = "ciclo") Integer ciclo, @RequestParam(value = "documento") Integer documento,
			@RequestParam(value = "tipoDocumento") Integer tipoDocumento,
			@RequestParam(value = "numCatastral") String numCatastral,
			@RequestParam(value = "codAntSuscripcion") String codAntSuscripcion,
			@RequestParam(value = "pagina") Integer pagina, @RequestParam(value = "tamanoPagina") Integer tamanoPagina,
			@RequestParam(value = "fechaDesde") String fechaDesde,
			@RequestParam(value = "fechaHasta") String fechaHasta, @RequestParam(value = "fechaPqr") String fechaPqr,
			@RequestParam(value = "tipoNota") Integer tipoNota, @RequestParam(value = "numeroPqr") Integer numeroPqr)
			throws ParseException, IOException {

		return negocioDsusDetsuscrip.consultaDetalleAforados(idSuscripcion, nombreTercero, documentoTercero, ciclo,
				documento, tipoDocumento, numCatastral, codAntSuscripcion, pagina, tamanoPagina, fechaDesde, fechaHasta,
				fechaPqr, tipoNota, numeroPqr);
	}

	/**
	 * Consulta de las facturas de una suscripción para realizar la adición o
	 * eliminación de deuda
	 * 
	 * @param idSuscripcion
	 * @param nombreTercero
	 * @param documentoTercero
	 * @param ciclo
	 * @param documento
	 * @param tipoDocumento
	 * @param numCatastral
	 * @param codAntSuscripcion
	 * @param pagina
	 * @param tamanoPagina
	 * @param fechaDesde
	 * @param fechaHasta
	 * @param tipoNota
	 * @return
	 * @throws InvalidParameterException
	 * @throws ParseException
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	@GetMapping("/consultaDetalleNotaDeuda")
	public ResponseConsultaDetalleSuscripcionDTO consultaDetalleNotaDeuda(
			@RequestParam(value = "idSuscripcion") Integer idSuscripcion,
			@RequestParam(value = "nombreTercero") String nombreTercero,
			@RequestParam(value = "documentoTercero") String documentoTercero,
			@RequestParam(value = "ciclo") Integer ciclo, @RequestParam(value = "documento") Integer documento,
			@RequestParam(value = "tipoDocumento") Integer tipoDocumento,
			@RequestParam(value = "numCatastral") String numCatastral,
			@RequestParam(value = "codAntSuscripcion") String codAntSuscripcion,
			@RequestParam(value = "pagina") Integer pagina, @RequestParam(value = "tamanoPagina") Integer tamanoPagina,
			@RequestParam(value = "fechaDesde") String fechaDesde,
			@RequestParam(value = "fechaHasta") String fechaHasta, @RequestParam(value = "tipoNota") Integer tipoNota,
			@RequestParam(value = "paginador") Boolean paginador,
			@RequestParam(value = "accionARealizar") Integer accionARealizar) {

		return negocioDsusDetsuscrip.consultaDetalleNotaDeuda(idSuscripcion, nombreTercero, documentoTercero, ciclo,
				documento, tipoDocumento, numCatastral, codAntSuscripcion, pagina, tamanoPagina, fechaDesde, fechaHasta,
				tipoNota, paginador, accionARealizar);
	}

	/**
	 * Método de consulta de los detalles de una factura (conceptos) para que sean
	 * mostrados en un pop-up y sean tratados
	 * 
	 * @param facIderegistro
	 * @param tipoNota
	 * @return
	 */
	@GetMapping("/consultaConceptosDeuda")
	public ConceptoSuscripcionDeudaDTO consultaConceptosSuscripcionesDeuda(
			@RequestParam(value = "facIderegistro") Long facIderegistro,
			@RequestParam(value = "tipoNota") Integer tipoNota) {

		return negocioDsusDetsuscrip.consultaConceptosDeuda(facIderegistro, tipoNota);
	}

	/**
	 * Mpetodo de consulta de detalles de una factura reliquidada (novedad) para que
	 * sea mostrados en un pop-up de manera informativa
	 * 
	 * @param facIderegistro
	 * @param tipoNota
	 * @return
	 */
	@GetMapping("/consultaConceptosDeudaReliq")
	public ConceptoSuscripcionDeudaDTO consultaConceptosSuscripcionesDeudaReliq(
			@RequestParam(value = "facIderegistro") Long facIderegistro,
			@RequestParam(value = "tipoNota") Integer tipoNota) {

		return negocioDsusDetsuscrip.consultaConceptosDeudaReliq(facIderegistro);
	}

	/**
	 * Método encargado de insertar los cambios realizados en un detalle de una
	 * factura (concepto) en una tabla temporal
	 *
	 * @param requestInsertarDeudaDTO
	 * @return
	 */
	@PostMapping(path = "/insertarDeudaTmp", consumes = "application/json", produces = "application/json")
	public GenericResponseDTO insertarDeudaTmp(@RequestBody RequestInsertarDeudaDTO requestInsertarDeudaDTO) {

		return negocioDsusDetsuscrip.insertarDeudaTmp(requestInsertarDeudaDTO);
	}

	/**
	 * Endpoint que permite consultar las suscripciones de un tercero por empresa
	 *
	 * @param idClient
	 * @return
	 */
	@GetMapping("/searchSubscriptions/{idClient}")
	public ResponseEntity<GeneralBodyResponse<List<SusSuscripcionDTO>>> searchSubscriptionsByIdClient(@PathVariable("idClient") Long idClient) {
		// protected region Use esta region para su implementacion on begin
		try {
			List<SusSuscripcionDTO> dtoList = this.negocioDsusDetsuscrip.searchSubscriptionsByIdClient(idClient);

			return new ResponseEntity<>(
					new GeneralBodyResponse<>(dtoList, !dtoList.isEmpty() ? "existen subscripciones" : "no existen subscripciones", null),
					HttpStatus.OK);
		} catch (Exception ex) {
			return new ResponseEntity<>(new GeneralBodyResponse<>(null, ex.getMessage(), null), HttpStatus.BAD_REQUEST);
		}
		// protected region Use esta region para su implementacion end
	}
       
}
