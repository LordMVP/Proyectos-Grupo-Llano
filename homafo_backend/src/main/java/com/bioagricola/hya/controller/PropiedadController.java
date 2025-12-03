package com.bioagricola.hya.controller;


import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.ProPropiedad;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.homologaciones.repository.HomologacionRepository;
import com.bioagricola.hya.dto.GeoDirecDto;
import com.bioagricola.hya.dto.ProPropiedadDTO;
import com.bioagricola.hya.dto.util.CoordenadaDTO;
import com.bioagricola.hya.service.ArcGisService;
import com.bioagricola.hya.service.PropiedadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * Clase que almacena los endpoints de los servicios relacionados con propiedad de terceros
 *
 * @author dsolano
 */
@RestController
@RequestMapping("api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PropiedadController {
	
	@Autowired
	private HomologacionRepository repository;
	
    private final PropiedadService service;
    private final AuthenticationFacade autoFacade;
    private final ArcGisService arcGisService;

    public PropiedadController(PropiedadService service, AuthenticationFacade autoFacade, ArcGisService arcGisService) {
        this.service = service;
        this.autoFacade = autoFacade;
        this.arcGisService = arcGisService;
    }

    /**
     * Servicio que retorna lista de propiedades por id de tercero
     *
     * @param idTercero id tercero
     * @return lista de propiedades
     */
    @GetMapping("/terceros/{idTercero}/propiedades")
    public List<ProPropiedad> getListByTercero(@PathVariable("idTercero") Long idTercero) {
        //return service.listAllByIdTercero(idTercero);
    	Integer idEmpresa = autoFacade.getCredentials().getAuditoria().getIdEmpresa() ; 
    	List<Object[]> parametros=repository.parametroValor(idEmpresa);
		ConvertGeneral convertir=new ConvertGeneral();
		Integer municipio = Integer.parseInt(convertir.extraerValorParametro(parametros, "uni_municipio"));
		Integer tipoPropiedad = Integer.parseInt(convertir.extraerValorParametro(parametros, "uni_tipo_pro_casa"));
    	return service.listAllByIdTerceroIdEmpresa(idTercero,idEmpresa,municipio,tipoPropiedad);
    }

    /**
     * Servicio para buscar una propiedad por el id
     *
     * @param id id propiedad
     * @return propiedad
     */
    @GetMapping("/propiedades/{id}")
    public ProPropiedad search(@PathVariable("id") Integer id) {
        return service.search(id);
    }

    /**
     * Servicio para guardar una nueva dto
     *
     * @param dto nueva dto
     * @return dto guardada
     */
    @PostMapping("/propiedad")
    public ProPropiedad create(@Valid @RequestBody ProPropiedadDTO dto) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();

        return service.create(dto, idUsu);
    }

    /**
     * Servicio para editar una dto
     *
     * @param dto datos de dto
     * @param id  id de la dto a editar
     * @return Recurso editado correctamente
     */
    @PutMapping("/propiedad/{id}")
    public ProPropiedad update(@Valid @RequestBody ProPropiedadDTO dto, @PathVariable("id") Integer id) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();

        return service.update(id, dto, idUsu);
    }

    /**
     * Servivio para eliminar una propiedad
     *
     * @param id id de propiedad
     * @return Recurso eliminado con exito
     */
    @DeleteMapping("/propiedad/{id}")
    public Boolean delete(@PathVariable("id") Integer id) {
        return service.delete(id);
    }

    /**
     * Servicio que retorna token para implementacion de servicio ArcGis
     *
     * @return token
     */
    @GetMapping("/arcgis/geolocalizacion/token")
    public String generateToken() {
        return arcGisService.generateToken();
    }

    /**
     * Servicio que retorna coordenadas de localizacion por parametros de direccion
     *
     * @param geoDirecDto formulario parametros de direccion
     * @return localizacion
     */
    @PostMapping("/arcgis/geolocalizacion/direccion")
    public Object getDirection(@Valid @RequestBody GeoDirecDto geoDirecDto) {
        return arcGisService.getDirection(geoDirecDto);
    }

    /**
     * Servicio que retorna caracteristicas de localizacion, sector, seccion y manzana por las coordenadas de localizacion y tipo (rural o urbano)
     * <p>
     * type 1= urbano 2=rural
     * x    valor coordenadas x
     * y    valor coordenadas y
     *
     * @return caracteristicas localizacion
     */
    @PostMapping("/arcgis/geolocalizacion/caracteristicas")
    public Object getCharacteristics(@Valid @RequestBody CoordenadaDTO dto) {
        return arcGisService.getCharacteristics(dto.getX(), dto.getY(), dto.getType());
    }

    /**
     * Servicio que retorna listado de capas del mapa
     *
     * @return listcado capas
     */
    @GetMapping("/arcgis/geolocalizacion/capas")
    public List<Map<String, Object>> getLayers() {
        return arcGisService.getLayers(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
    }

    /**
     * Servicio para validar si la propiedad esta asociada a una suscripcion
     *
     * @param idPr id propiedad
     * @return true o false
     */
    @GetMapping("/suscripcion/{idpropiedad}")
    public Boolean validateSubscription(@PathVariable("idpropiedad") Long idPr) {
        return service.validateSubscription(idPr);
    }
}
