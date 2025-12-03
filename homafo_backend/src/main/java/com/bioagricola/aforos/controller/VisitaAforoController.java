package com.bioagricola.aforos.controller;

import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.bioagricola.aforos.controller.generic.AbstractRestController;
import com.bioagricola.aforos.entity.dto.AforoResponseGeneral;
import com.bioagricola.aforos.entity.dto.DmafConceptosDto;
import com.bioagricola.aforos.entity.dto.ResponseDTO;
import com.bioagricola.aforos.entity.dto.SearchDTO;
import com.bioagricola.aforos.entity.dto.VisitByAforoDTO;
import com.bioagricola.aforos.entity.dto.VisitaAforoAdjuntoDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.aforos.service.impl.MaestroAforoVisitaServiceImpl;
import com.bioagricola.aforos.service.impl.VisitasAforosAdjuntosServiceImpl;
import com.bioagricola.homologaciones.dto.UsuarioWrapper;
import com.bioagricola.homologaciones.service.impl.AutenticacionService;
import com.gell.estandar.dto.RespuestaDTO;

@RestController
@RequestMapping("/api/visitas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VisitaAforoController extends AbstractRestController{

	@Autowired
	private MaestroAforoVisitaServiceImpl maestroAforoVisitaServiceImpl;
	@Autowired
	private VisitasAforosAdjuntosServiceImpl visitasAforosAdjuntosServiceImpl;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@Autowired
	AutenticacionService service;
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	

	@RequestMapping(method = RequestMethod.POST, path="/adjuntar", produces=MediaType.APPLICATION_JSON_VALUE , consumes = {"multipart/form-data"})
	public ResponseDTO<List<VisitaAforoAdjuntoDTO>> cargarArchivo(@RequestParam(name="fileList") List<MultipartFile> fileList,
			@RequestParam(name = "idDetalle") Long idDetalle,
			@RequestParam(name = "uniTipoAdjunto") Long uniTipoAdjunto,
			@RequestParam(name = "observaciones") String observaciones
			)
	{
		
		UsuarioWrapper usuario=new UsuarioWrapper();
		usuario.setIdUsuario(autoFacade.getCredentials().getAuditoria().getIdUsuario());
		usuario.setIdEmpresa(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
		String token= service.procesarSesion(usuario);
		
		VisitaAforoAdjuntoDTO vaaDTO=new VisitaAforoAdjuntoDTO();
		vaaDTO.setIdDetalle(idDetalle);
		vaaDTO.setUniTipoAdjunto(uniTipoAdjunto);
		vaaDTO.setObservaciones(observaciones);
		
		List<VisitaAforoAdjuntoDTO> response = visitasAforosAdjuntosServiceImpl.cargarArchivos(fileList, token, vaaDTO);
		if(response.isEmpty()) {
			return new ResponseDTO<>(Boolean.FALSE,"No se ha podido completar la carga",response);
		}
		 
		return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	//@SuppressWarnings("rawtypes")
	@GetMapping("/ver/{idDetalle}")
	public ResponseDTO<List<RespuestaDTO>> getVisitasPendientes(@PathVariable Long idDetalle)
	{
		UsuarioWrapper usuario=new UsuarioWrapper();
		usuario.setIdUsuario(autoFacade.getCredentials().getAuditoria().getIdUsuario());
		usuario.setIdEmpresa(autoFacade.getCredentials().getAuditoria().getIdEmpresa());
		String tokenBack= service.procesarSesion(usuario);
		
		List<RespuestaDTO> response= visitasAforosAdjuntosServiceImpl.verArchivo(idDetalle, tokenBack);
		String respuestaObservaciones=visitasAforosAdjuntosServiceImpl.buscarObservaciones(idDetalle, tokenBack);
		return new ResponseDTO<>(Boolean.TRUE,respuestaObservaciones,response);
	}
		
	@PostMapping("/obtenerPendientes")
	public ResponseDTO<VisitByAforoDTO> getVisitasPendientes(@Valid @RequestBody SearchDTO searchDTO) {
		VisitByAforoDTO response = maestroAforoVisitaServiceImpl.getVisitasByAforo(searchDTO, Boolean.TRUE);
		return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	@PostMapping("/obtenerTramitadas")
	public ResponseDTO<VisitByAforoDTO> getVisitasTramitadas(@Valid @RequestBody SearchDTO searchDTO) {
		VisitByAforoDTO response = maestroAforoVisitaServiceImpl.getVisitasByAforo(searchDTO, Boolean.FALSE);
		return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	@PostMapping("/obtenerCanceladas")
	public ResponseDTO<VisitByAforoDTO> getVisitasCanceladas(@Valid @RequestBody SearchDTO searchDTO) {
		VisitByAforoDTO response = maestroAforoVisitaServiceImpl.getVisitasByAforoCancelados(searchDTO, Boolean.FALSE);
		return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	@PutMapping(value= "/actualizar")
	public ResponseDTO<Long> setVisits(@Valid @RequestBody VisitByAforoDTO visits) {
		Long response = maestroAforoVisitaServiceImpl.setVisitasByAforo(visits);
		return new ResponseDTO<>(Boolean.TRUE,"Registros actualizados correctamente",response);
	}
	
	@PutMapping("/generar")
	public ResponseDTO<VisitByAforoDTO> generateVisits(@Valid @RequestBody SearchDTO searchDTO) {
		System.err.println("entre a generar ");
		VisitByAforoDTO response = maestroAforoVisitaServiceImpl.generateVisits(searchDTO);
		return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	@GetMapping("/buscarConceptos/{dmafIderegistro}")
	public DmafConceptosDto buscarConceptosDmaf(@PathVariable Long dmafIderegistro)
	{
		return maestroAforoVisitaServiceImpl.buscarConceptosDmaf(dmafIderegistro);
	}
	
	@PostMapping("/crudConceptosdmaf")
	public AforoResponseGeneral crudConceptosdmaf(@Valid @RequestBody DmafConceptosDto request) {
		Integer resultado=0;
		resultado=maestroAforoVisitaServiceImpl.crudConceptosDmaf(request);
		AforoResponseGeneral response=new AforoResponseGeneral();
		if(resultado==0)
		{
			response.setError(false);
			response.setStatusCode(200);
			response.setStatusText("Exito en la Transaccion...");
		}
		else
		{
			response.setError(true);
			response.setStatusCode(500);
			response.setStatusText("Error , verificar con el Area de Tecnologia...");
		}
		
		return response;
		
	}
	
	@GetMapping("/ListaDmafEstado/{idAforo}")
	public ResponseDTO<VisitByAforoDTO> ListaDmafEstado(@PathVariable Long idAforo) {
		VisitByAforoDTO response = maestroAforoVisitaServiceImpl.getListaDmafEstado(idAforo);
		return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	
}
