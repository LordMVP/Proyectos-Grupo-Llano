package com.bioagricola.common.controller;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.entity.dto.CredentialsDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.dto.EmpresasDTO;
import com.bioagricola.common.dto.PermisoProgramaDTO;
import com.bioagricola.common.dto.SesionDTO;
import com.bioagricola.common.entity.Empresas;
import com.bioagricola.common.entity.PrunPrgUnidad;
import com.bioagricola.common.service.PrunPrgUnidadServiceImpl;
import com.bioagricola.common.service.UsuariosService;
import com.bioagricola.homologaciones.service.impl.AutenticacionService;
import com.bioagricola.homologaciones.service.impl.EmpresasService;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.persistencia.entidades.OpcOpcion;

@RestController
@RequestMapping(path = "api/global")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class GlobalRestController {

	@Autowired
	private AutenticacionService authService;
	
	@Autowired
	private AuthenticationFacade authFacade;
	
	@Autowired
	private EmpresasService empresasService;
	
	@Autowired
	private UsuariosService usuarioService;
	
	@Autowired
	private PrunPrgUnidadServiceImpl prunService; 


	@RequestMapping(path = "/menu",method = RequestMethod.POST)
	public List<OpcOpcion> getMenu() throws NoSuchAlgorithmException, AplicacionExcepcion {		
		CredentialsDTO dto = authFacade.getCredentials();		
		System.out.println("Empresa de la session: "+dto.getAuditoria().getIdEmpresa());
		System.out.println("Token de la session: "+dto.getAuditoria().getToken()); 
		System.out.println("Usuario de la session: "+dto.getAuditoria().getIdUsuario());				
		return authService.getMenuPrisma(dto.getAuditoria().getToken());		
	}
	
	@RequestMapping(path="/load-permission/{programa}",method = RequestMethod.POST)
	public ResponseEntity<List<PermisoProgramaDTO>> getPermissions(@PathVariable(name = "programa")Long programa){
		Long usuIderegistro = authFacade.getIdUsuarioLong();
		List<PrunPrgUnidad> permisos = this.prunService.getPermisosUsuarioPrograma(usuIderegistro, programa);
		List<PermisoProgramaDTO> permisosDto = new  ArrayList<>();
		permisosDto = permisos.stream().map(i->new PermisoProgramaDTO(i.getPrgIderegistro(),
				i.getUniIderegistro().getUniCodigo1(),
				i.getUniIderegistro().getUniIderegistro(),
				i.getUniIderegistro().getUniNombre1())).collect(Collectors.toList());
		return ResponseEntity.ok(permisosDto);
	}
	
	@RequestMapping(path="/validar-permiso/{programa}/{permiso}",method = RequestMethod.POST)
	public ResponseEntity<List<PrunPrgUnidad>> validarPermisoPrograma(@PathVariable(name = "programa")Long programa,@PathVariable("permiso")String permiso){
		Long usuIderegistro = authFacade.getIdUsuarioLong();
		List<PrunPrgUnidad> permisos = this.prunService.getPermisosUsuarioPrograma(usuIderegistro, programa);
		return ResponseEntity.ok(permisos);
	}
	
	
	
	@RequestMapping(path = "/sesion",method = RequestMethod.POST)
	public ResponseEntity<SesionDTO> getSesion() {
		SesionDTO sesionDto = new SesionDTO();
		List<HashMap<String, Object>> datosUsuario = usuarioService.datosReportes(authFacade.getCredentials().getAuditoria().getIdUsuario(),authFacade.getCredentials().getAuditoria().getIdEmpresa());
		if(datosUsuario.size()>0) {
			String nombreUsuario = datosUsuario.get(0).get("usuario_nom").toString();
			sesionDto.setUsuario(nombreUsuario);
		}
		Optional<Empresas> empresa = this.empresasService.getEmpresaByEmpresaSevemp(new Long(authFacade.getCredentials().getAuditoria().getIdEmpresa()));
		if(empresa.isPresent()) {
			sesionDto.setEmpresa(empresa.get().getEmpresaNom());
		}
		//sesionDto.setUsuario(authFacade.getCredentials().getAuditoria().getIdUsuario()+"");		
		sesionDto.setOrigen("Interno");
		return ResponseEntity.ok(sesionDto);
	}
	
	@RequestMapping(path = "/empresas",method = RequestMethod.POST)
	public ResponseEntity<List<EmpresasDTO>> getEmpresas(Pageable pageable){
		Page<Empresas> page = this.empresasService.getEmpresasForLogin(pageable);
		List<EmpresasDTO> dtoEmpresas = new ArrayList<EmpresasDTO>();
		page.get().forEach(empresa -> {
			EmpresasDTO dto = new EmpresasDTO();			
			dto.setEmpresaId(empresa.getEmpresaSevemp().intValue());
			dto.setEmpresaNombre(empresa.getEmpresaNom());
			dtoEmpresas.add(dto);
		});
		return ResponseEntity.ok(dtoEmpresas);
	}
}
