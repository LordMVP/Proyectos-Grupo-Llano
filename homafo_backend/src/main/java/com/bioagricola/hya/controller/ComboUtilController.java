package com.bioagricola.hya.controller;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.CicCiclo;
import com.bioagricola.common.entity.ConConcepto;
import com.bioagricola.common.entity.HrrHorrecoleccion;
import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.hya.dto.BasicSearchDTO;
import com.bioagricola.hya.dto.ComboUtilDTO;
import com.bioagricola.hya.dto.UniUnidadDTO;
import com.bioagricola.hya.service.ComboUtilService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * Clase que contiene los endpoints de los servicios relacionados con consulta de items para selectores
 *
 * @author dsolano
 */
@RestController
@RequestMapping(path = "api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ComboUtilController {

    private final ComboUtilService comboUtilService;
    private final AuthenticationFacade autoFacade;

    /**
     * Constructor de la clase
     *
     * @param comboUtilService
     * @param autoFacade
     */
    public ComboUtilController(ComboUtilService comboUtilService, AuthenticationFacade autoFacade) {
        this.comboUtilService = comboUtilService;
        this.autoFacade = autoFacade;
    }

    @GetMapping("/unidades/tipo-contacto")
    public List<ComboUtilDTO> getContactType() {
        return comboUtilService.getContactTypes();
    }

    /**
     * Servicio que retorna las unidades de tipo persona
     *
     * @return lista de unidades
     */
    @GetMapping("/unidades/tipo-persona")
    public List<UniUnidadDTO> getPersonTypes() {
        return comboUtilService.getPersonTypes(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna las unidades de tipo identificacion
     *
     * @return lista de unidades
     */
    @GetMapping("/unidades/tipo-identificacion")
    public List<UniUnidadDTO> getIdentificationTypes() {
        return comboUtilService.getIdentificationTypes(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna las unidades de permisos para os botones dependiendo del usuario logueado y del programa
     *
     * @param programa id de programa
     * @return lista de unidades
     */
    @GetMapping("/unidades/{programa}")
    public List<ComboUtilDTO> getUnityPrograms(@PathVariable("programa") Integer programa) {
        return comboUtilService.getUnityPrograms(programa, autoFacade.getCredentials().getAuditoria().getIdUsuario());
    }

    /**
     * Servicio que retorna listado de ciudades a partir de la coincidencia de un parametro de busqueda, en el nombre de la ciudad.
     *
     * @param search parametro nombre ciudad
     * @return listado de ciudades
     */
    @PostMapping("/ciudad")
    public List<ComboUtilDTO> searchCities(@Valid @RequestBody BasicSearchDTO search) {
        return comboUtilService.searchCities("%" + search.getSearch() + "%");
    }

    /**
     * Servicio que retorna nombres de los terceros segun parametro de busqueda
     *
     * @param search parametro de busqueda
     * @return lista nombres terceros
     */
    @PostMapping("/terceronombre")
    public List<ComboUtilDTO> getAllNamesTer(@Valid @RequestBody BasicSearchDTO search) {
        return comboUtilService.getAllNamesTer("%" + search.getSearch() + "%");
    }

    /**
     * Servicio que retorna listado de items o unidades para los combos de seleccion
     *
     * @param idPrograma id del programa
     * @return listado de items
     */
    @GetMapping("/tercero/unidades/{idPrograma}")
    public Map<Integer, List<ComboUtilDTO>> getAllCombos(@PathVariable("idPrograma") Integer idPrograma) {
        return comboUtilService.getAllCombos(idPrograma, autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna listado de clasificaciones de terceros
     *
     * @return lista de clasificaciones
     */
    @GetMapping("/tercero/clasificaciones")
    public List<ComboUtilDTO> getAllClassifications() {
        return comboUtilService.getAllClassifications(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna los tipos de propiedad
     *
     * @return lista de tipos de propiedad
     */
    @GetMapping("/propiedad/tipos")
    public List<ComboUtilDTO> getPropertyTypes() {
        return comboUtilService.getPropertyTypes(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna las clasificaciones de vivienda
     *
     * @return lista de tipos de propiedad
     */
    @GetMapping("/propiedad/clasificacion-vivienda")
    public List<ComboUtilDTO> getAllHomeClassifications() {
        return comboUtilService.getAllHomeClassifications(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna listado de municipios
     *
     * @return listado de municipios
     */
    @GetMapping("/propiedad/municipios")
    public List<ComboUtilDTO> getAllCities() {
        return comboUtilService.getAllCities(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna listado de barrios por municipio
     *
     * @param idMunicipio id municipio
     * @return listado de barrios
     */
    @GetMapping("/propiedad/municipios/{idMunicipio}/barrios")
    public List<ComboUtilDTO> getAllNeighborhoodsByCity(@PathVariable("idMunicipio") Integer idMunicipio) {
        return comboUtilService.getAllNeighborhoodsByCity(idMunicipio);
    }

    /**
     * Servicio que retorna listado de complementos de direccion
     *
     * @param idMunicipio id de municipio
     * @param idBarrio    id de barrio
     * @return listado de complementos
     */
    @GetMapping("/propiedad/municipios/{idMunicipio}/barrios/{idBarrio}/complementos")
    public List<ComboUtilDTO> getAllDirections(@PathVariable("idMunicipio") Integer idMunicipio, @PathVariable("idBarrio") Integer idBarrio) {
        return comboUtilService.getAllDirections(idMunicipio, idBarrio);
    }

    /**
     * Servicio que retorna lista de estados suscripcion por id empresa
     *
     * @return lista de estados
     */
    @GetMapping("suscripcion/states")
    public List<ComboUtilDTO> getAllStates() {
        return comboUtilService.getAllStates(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna lista de tipos de estratos
     *
     * @return lista estratos
     */
    @GetMapping("suscripcion/estratos")
    public List<ComboUtilDTO> getAllStrataTypes() {
        return comboUtilService.getAllStrataTypes(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna lista de tipos de uso
     *
     * @return lista tipos uso
     */
    @GetMapping("suscripcion/tipouso")
    public List<ComboUtilDTO> getAllUseTypes() {
        return comboUtilService.getAllUseTypes(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna liquidaciones por tipo uso, id ciclo y municipio
     *
     * @return lista liquidaciones
     */
    @GetMapping("suscripcion/liquidaciones")
    public List<ComboUtilDTO> getAllSettlements() {
        return comboUtilService.getAllSettlements(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Sercicio que retorna ruta por municipio barrio
     *
     * @return rutas
     */
    @GetMapping("suscripcion/macrorutas")
    public List<RutRuta> getAllMacroRoutes() {
        return comboUtilService.getAllMacroRoutes();
    }

    /**
     * Sercicio que retorna microrutas
     *
     * @return microrutas
     */
    @GetMapping("suscripcion/macrorutas/{id}/microrutas")
    public List<ComboUtilDTO> getAllMicroRoutesByMacroRouteId(@PathVariable("id") Integer id) {
        return comboUtilService.getAllMicroRoutesByMacroRouteId(id);
    }

    /**
     * Sercicio que retornar horarios
     *
     * @return horarios por id macrorutas
     */
    @GetMapping("suscripcion/rurerutas/{id}/horarios")
    public List<HrrHorrecoleccion> getAllSchedulesByMacroRouteId(@PathVariable("id") Integer id) {
        return comboUtilService.getAllSchedulesByMacroRouteId(id);
    }

    @GetMapping("suscripcion/rutasbar/{idruta}/horarios")
    public List<Map<String,Object>> getAllSchedulesByRouteBarId(@PathVariable("idruta") Integer id) {
        return comboUtilService.getAllSchedulesByRouteBarId(id);
    }

    @GetMapping("suscripcion/rutasbar/{idmun}/{idbar}")
    public List<Map<String,Object>> getAllRoutesBarByMunBar(@PathVariable("idmun") Long idmunicipaliy,@PathVariable("idbar") Long idneighborhood) {
        return comboUtilService.getAllRoutesBarByMunBar(idmunicipaliy,idneighborhood);
    }

    /**
     * Servicio que retorna ciclos por id ruta y empresa usuario logueado
     *
     * @return lista ciclos
     */
    /*@GetMapping("suscripcion/ciclos/{idliquidacion}")
    public List<CicCiclo> getAllCycles(@PathVariable("idliquidacion") Integer idliquidacion) {
        return comboUtilService.getAllCycles(autoFacade.getCredentials().getAuditoria().getIdEmpresa(),idliquidacion);
    }*/

    @GetMapping("suscripcion/ciclos")
    public List<CicCiclo> getAllCycles() {
        return comboUtilService.getAllCycles(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna ciclos por id ruta y empresa usuario logueado
     *
     * @return lista ciclos
     */
    @GetMapping("ciclos/{id}")
    public CicCiclo getCycleById(@PathVariable("id") Long id) {
        return comboUtilService.getCycleById(id);
    }

    /**
     * Servicio que retorna ciclos por id ruta y empresa usuario logueado
     *
     * @return lista ciclos
     */
    @GetMapping("suscripcion/ciclos/{id}/rutas")
    public List<RutRuta> getAllRoutesByIdCycle(@PathVariable("id") Integer id) {
        return comboUtilService.getAllRoutesByIdCycle(id);
    }

    /**
     * Servicio que retorna actividades economicas suscripcion
     *
     * @return lista de actividades economicas
     */
    @GetMapping("suscripcion/act-economicas")
    public List<ComboUtilDTO> getAllEconomicActivities() {
        return comboUtilService.getAllEconomicActivities(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna lista de conceptos
     *
     * @return lista de conceptos
     */
    @GetMapping("suscripcion/conceptos")
    public List<ConConcepto> getAllConcepts() {
        return comboUtilService.getAllConceptsByIdProgram(autoFacade.getCredentials().getAuditoria().getIdUsuario());
    }
    
    /**
     * Servicio que retorna lista de conceptos
     *
     * @return lista de conceptos
     */
    @GetMapping("suscripcion/conceptos/{programa}")
    public List<ConConcepto> getAllConceptsPrograma(@PathVariable("programa") Integer programa) {
        return comboUtilService.getAllConceptsByIdProgramPrograma(autoFacade.getCredentials().getAuditoria().getIdUsuario(),programa);
    }

    /**
     * Metodo para listar tipos de suscripcion
     *
     * @param idconvenio
     * @return tipos suscripcion
     */
    @GetMapping("suscripcion/municipio/{idmunicipio}/convenio/{idconvenio}/tiposuscripcion")
    public List<ComboUtilDTO> getAllSubscriptionTypes(@PathVariable("idconvenio") Integer idconvenio, @PathVariable("idmunicipio") Integer idmunicipio) {
        return comboUtilService.getAllSubscriptionTypes(idconvenio, autoFacade.getCredentials().getAuditoria().getIdEmpresa(), idmunicipio);
    }

    /**
     * Servicio que retorna lista de empresas
     *
     * @return lista de empresas
     */
    @GetMapping("suscripcion/empresas")
    public List<ComboUtilDTO> getAllEnterprises() {
        return comboUtilService.getAllEnterprises(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio que retorna la lista de tipos de documentos
     *
     * @param idSuscripcion
     * @param idMunicipio
     * @return
     */
    @GetMapping("/tipos/{idSuscripcion}/{idMunicipio}")
    public List<ComboUtilDTO> listarTipos(@PathVariable("idSuscripcion") Integer idSuscripcion, @PathVariable("idMunicipio") Integer idMunicipio) {
        return comboUtilService.listarTiposDocumentos(idSuscripcion, idMunicipio, autoFacade.getCredentials().getAuditoria().getIdEmpresa(), autoFacade.getCredentials().getAuditoria().getIdUsuario());
    }

    /**
     * Servicio que retorna conceptos segun lista de liquidaciones
     *
     * @param idLiquidaciones liistado ids liquidaciones
     * @return listado de conceptos de liquidaciones
     */
    @PostMapping("liquidacion/conceptos")
    public List<Map<String, Object>> listarConceptosLiquidaciones(@RequestBody List<Integer> idLiquidaciones) {
        return comboUtilService.listarConceptosLiquidaciones(idLiquidaciones);
    }
}
