package com.bioagricola.aforos.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.controller.generic.AbstractRestController;
import com.bioagricola.aforos.entity.dto.ResponseDTO;
import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.aforos.entity.dto.TipoAforosFrecuenciasDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.aforos.service.impl.BarriosServiceImpl;
import com.bioagricola.aforos.service.impl.ConConceptoAforosServiceImpl;
import com.bioagricola.aforos.service.impl.DsusDetsuscripcionServiceImpl;
import com.bioagricola.aforos.service.impl.ProyectosServiceImpl;
import com.bioagricola.aforos.service.impl.TerTerceroServiceImpl;
import com.bioagricola.aforos.service.impl.UniUnidadAforosServiceImpl;
import com.bioagricola.common.entity.ConConcepto;
import com.bioagricola.homologaciones.service.impl.CicCicloService;
import com.bioagricola.homologaciones.service.impl.RutRutaService;

@RestController
@RequestMapping("/api/contenidoEstatico")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StaticContentController extends AbstractRestController{
	Logger logger = LoggerFactory.getLogger(StaticContentController.class);

	@Autowired
	private UniUnidadAforosServiceImpl uniUnidadAforosServiceImpl;
	@Autowired
	private TerTerceroServiceImpl terTerceroServiceImpl;
	@Autowired
	private ConConceptoAforosServiceImpl conConceptoAforosServiceImpl;
	@Autowired
	private ProyectosServiceImpl proyectosServiceImpl;
	@Autowired
	private BarriosServiceImpl barriosServiceImpl;
	@Autowired
	private CicCicloService cicCicloService;
	@Autowired
	private RutRutaService rutRutaService;
	@Autowired
	private DsusDetsuscripcionServiceImpl dsusDetsuscripcionServiceImpl;
	@Autowired
	private AuthenticationFacade autoFacade;
	
	/*@GetMapping("/tiposAforos")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getTiposAforos() {
		return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getTiposAforos());
	}*/
	
	@GetMapping("/tiposAforos")
	public ResponseDTO<List<TipoAforosFrecuenciasDTO>> getTiposAforos() {
		return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getTiposAforosAndFrecuencias());
	}
	
	@GetMapping("/tecnicosAforadores")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getTecnicosAforadores() {
		return new ResponseDTO<>(Boolean.TRUE,terTerceroServiceImpl.getTecnicosAforadoresBySuscripcion());
	}
	
	@GetMapping("/tiposUsos")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getAllTiposUsos() {
		return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getTiposUsos());
	}
	
	@GetMapping("/actividades")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getAllActividades() {
		return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getAllActividades());
	}
	
	@GetMapping("/tiposGeneradores")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getAllTiposGeneradores() {
		return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getTiposGeneradores());
	}
	
	@GetMapping("/tiposAdjuntos")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getAllTiposAdjuntos() {
		return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getTiposAdjuntos());
	}
	
	/**
	 * Reclamación, seguimiento, etc
	 */
	@GetMapping("/conceptosAforos")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getConceptos() {
		return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getConceptosAforos());
	}
	
	@GetMapping("/municipios")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getMunicipios() {
		//return new ResponseDTO<>(Boolean.TRUE,proyectosServiceImpl.getMunicipiosActivosAforos());
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return new ResponseDTO<>(Boolean.TRUE,proyectosServiceImpl.getMunicipiosActivosEmpresa(idEmpresa));
	}
	
	@GetMapping("/ciclos")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getCiclosActivosAforos() {
		return new ResponseDTO<>(Boolean.TRUE,cicCicloService.getCiclosActivosAforos());
	}
	
	@GetMapping("/rutas")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getRutasAforos() {
		return new ResponseDTO<>(Boolean.TRUE,rutRutaService.getRutasAforos());
	}
	
	@GetMapping("/estratos")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getEstratosAforos() {
		return new ResponseDTO<>(Boolean.TRUE,dsusDetsuscripcionServiceImpl.getEstratosAforos());
	}
	
	@GetMapping("/ubicaciones")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getUbicaciones() {
		return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getUbicaciones());
	}
	
	@GetMapping("/barrios/{idMunicipio}")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getBarriosByMunicipo(@PathVariable Long idMunicipio) {
		return new ResponseDTO<>(Boolean.TRUE,barriosServiceImpl.getBarriosByMunicipio(idMunicipio));
	}
	
	@GetMapping("/terceroNombreCompleto/{nombre}")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getBarriosByMunicipo(@PathVariable String nombre) {
		return new ResponseDTO<>(Boolean.TRUE,terTerceroServiceImpl.getTercerosNombreLike(nombre));
	}
	
	/**
	 * Bolsa, Canecas, etc
	 */
	@GetMapping("/recipientesConceptoAforo")
	public ResponseDTO<List<ConConcepto>> getConceptosAforos() {
		return new ResponseDTO<>(Boolean.TRUE,conConceptoAforosServiceImpl.getConceptosRecipientes());
	}
	

	@GetMapping("/tiposDistribucion")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getTiposDistribucionAforo() {
		logger.warn("llamado a tipoDistribucion, este endPoint debe ser desarrollado");		
        return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getTipoDistribucion());
		//return new ResponseDTO<>();
	}
	


	@GetMapping("/claseSusAforos")
	public ResponseDTO<List<StaticContentResponseDTO<String>>> getclaseSusAforos() {
		return new ResponseDTO<>(Boolean.TRUE,uniUnidadAforosServiceImpl.getClaseSusAforos());
	}


}
