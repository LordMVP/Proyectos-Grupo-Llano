package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.homologaciones.dto.BusquedaHomologacionCruceRequest;
import com.bioagricola.homologaciones.dto.BusquedaHomologacionGestionRequest;
import com.bioagricola.homologaciones.dto.BusquedaHomologacionRequest;
import com.bioagricola.homologaciones.dto.ConsultaDsusHomologacionRequest;
import com.bioagricola.homologaciones.dto.HomologacionInfoBasicaRequest;
import com.bioagricola.homologaciones.dto.HomologacionInfoGestionRequest;
import com.bioagricola.homologaciones.dto.HomologacionInfoHomoRequest;
import com.bioagricola.homologaciones.dto.HomologacionInfoSuscripcionRequest;
import com.bioagricola.homologaciones.dto.HomologacionResponsePayLoad;
import com.bioagricola.homologaciones.service.impl.HomologacionService;


@RestController
@RequestMapping(path = "api/homologacion")
public class HomologacionRestController
{
	@Autowired
	private HomologacionService service;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/busquedaDsus/{dsus}")
	public List<HashMap<String, Object>> datosHomologacion(@PathVariable("dsus") Integer dsus) 
	{
		return service.datosHomologacion(dsus);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/busqueda", method = RequestMethod.POST)
	public List<HashMap<String, Object>> insertar(@RequestBody BusquedaHomologacionRequest request,Pageable pageable)
	{
		Integer empresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		request.setEmpresaSession(empresa);
		return service.resultadoBusqueda(request,pageable);
	}
	
	/* JLMENDOZA CRUCE DE INFORMACION */
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/busquedaCruceInformacion", method = RequestMethod.POST)
	public List<HashMap<String, Object>> insertarCruceInformacion(@RequestBody BusquedaHomologacionRequest request,Pageable pageable)
	{
		Integer empresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		request.setEmpresaSession(empresa);
		return service.resultadoBusquedaCruceDatos(request,pageable);
	}
	
	
	@RequestMapping(value = "/busqueda/page", method = RequestMethod.POST)
	public Page<List<HashMap<String, Object>>> buscarPaginacion(@RequestBody BusquedaHomologacionRequest request,Pageable pageable)
	{
		Integer empresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		request.setEmpresaSession(empresa);
		List<HashMap<String, Object>> result = service.resultadoBusqueda(request,pageable);
		Page page = new PageImpl<>(result,pageable,0);		
		//return service.resultadoBusqueda(request,pageable);
		return page;
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/infoBasica/{dsus}")
	public List<HashMap<String, Object>> inforamcionBasica(@PathVariable("dsus") Integer dsus) 
	{
		return service.informacionBasica(dsus);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/infoBasicaUpdate", method = RequestMethod.POST)
	public HomologacionResponsePayLoad insertar(@RequestBody HomologacionInfoBasicaRequest request)
	{
		Integer usuario=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		request.setIdUsuario(usuario);
		HomologacionResponsePayLoad response=new HomologacionResponsePayLoad();
		Integer resultado= service.actualizarInfoBasica(request);
		response.setError(false);
		response.setStatusCode(200);
		response.setStatusText("Exito al Registrar...");
		return response;
	}
	
	///informacion suscripcion
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/infoSuscripcion/{dsus}")
	public List<HashMap<String, Object>> informacionSuscripcion(@PathVariable("dsus") Integer dsus) 
	{
		return service.informacionSuscripcion(dsus);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/infoSuscripcionUpdate", method = RequestMethod.POST)
	public HomologacionResponsePayLoad insertarSuscripcion(@RequestBody HomologacionInfoSuscripcionRequest request)
	{
		//System.err.println("que llego de recoleccion "+request.getRut_ideregistro_rec());
		Integer usuario=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		Integer empresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		request.setUsu_ideregistro(usuario);
		request.setEmp_ideregistro(empresa);
		HomologacionResponsePayLoad response=new HomologacionResponsePayLoad();
		Integer resultado= service.actualizarInfoSuscripcionHomologacion(request);
		response.setError(false);
		response.setStatusCode(200);
		response.setStatusText("Exito al Registrar...");
		return response;
	}
	
	///consultar homologacion
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/consultaDsusHomo", method = RequestMethod.POST)
	public List<HashMap<String, Object>> consultaHomologacion(@RequestBody ConsultaDsusHomologacionRequest request) 
	{
		Integer empresa =autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.busquedaInformacionHomologcion(request.getDsus(), request.getMedidor(), request.getPcodigo(), request.getEmpresa(),empresa,request.getDeshomologacion());
	}
	
	///informacion Homologacion
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/infoHomologacion/{dsus}")
	public List<HashMap<String, Object>> informacionHomologacion(@PathVariable("dsus") Integer dsus) 
	{
		Integer empresa =autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.informacionHomologacion(dsus,empresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/crearHomologacion", method = RequestMethod.POST)
	public HomologacionResponsePayLoad crearHomologacion(@RequestBody HomologacionInfoHomoRequest request)
	{
		Integer resultado=0;
		Integer usuario=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		Integer empresa =autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		request.setUsuario(usuario);
		request.setEmpresaHomologa(empresa);
		HomologacionResponsePayLoad response=new HomologacionResponsePayLoad();
		if(request.getDeshomologacion())
		{
			resultado=service.crearDesHomologacion(request,empresa);
		}
		else
		{
			resultado=service.crearHomologacion(request);
		}
		if(resultado==0)
		{
			response.setError(false);
			response.setStatusCode(200);
			response.setStatusText("Exito al Registrar...");
		}
		else
		{
			response.setError(true);
			response.setStatusCode(500);
			response.setStatusText("Error , verificar con el Area de Tecnologia...");
		}
		
		return response;
		
	}
	
	///informacion Gestion
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/infoGestion/{dsus}")
	public List<HashMap<String, Object>> informacionGestion(@PathVariable("dsus") Integer dsus) 
	{
		return service.informacionGestion(dsus);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/infoGestionInsert", method = RequestMethod.POST)
	public HomologacionResponsePayLoad insertarGestion(@RequestBody HomologacionInfoGestionRequest request)
	{
		Integer usuario=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		request.setUsu_ideregistro(usuario);
		HomologacionResponsePayLoad response=new HomologacionResponsePayLoad();
		Integer resultado= service.insertarGestionActualizacion(request);
		if(resultado>0)
		{
			response.setError(false);
			response.setStatusCode(200);
			response.setStatusText("Exito al Registrar...");
		}
		else
		{
			response.setError(true);
			response.setStatusCode(500);
			response.setStatusText("Error insertar...");
		}
		return response;
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/busquedaGestion", method = RequestMethod.POST)
	public List<HashMap<String, Object>> busquedaGestion(@RequestBody BusquedaHomologacionGestionRequest request)
	{
		Integer empresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.buscarGestion(request,empresa);
	}
	
	////reclamos
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/infoReclamos/{dsus}/{empresa}")
	public List<HashMap<String, Object>> informacionReclamos(@PathVariable("dsus") Integer dsus,@PathVariable("empresa") Integer empresa) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.informacionReclamos(dsus, idEmpresa);
	}
	
	
	////cruce gestion
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/busquedaCruce", method = RequestMethod.POST)
	public List<HashMap<String, Object>> busquedaCruceHomologacion(@RequestBody BusquedaHomologacionCruceRequest request)
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		request.setEmpresa(idEmpresa);
		return service.busquedaCruceInfromacion(request);
	}
	
	//importacion
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/columnasTabla/{tabla}")
	public List<HashMap<String, Object>> informacionReclamos(@PathVariable("tabla") String tabla) 
	{
		return service.columnasTabla(tabla);
	}
	

}
