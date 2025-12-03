package com.bioagricola.hya.controller;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.hya.service.PerfilService;
import com.gell.estandar.persistencia.entidades.OpcOpcion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Clase que almacena los endpoints de los servicios relacionados con el control de perfiles H&A
 * @author cperez@progracol.com
 */
@RestController
@RequestMapping("/api")
public class PerfilController {

    private final PerfilService perfilService;
    
    private final ParParametroService parametroService;

    @Autowired
    private AuthenticationFacade authFacade;

    public PerfilController(PerfilService perfilService, ParParametroService parametroService) {
        this.perfilService = perfilService;
        this.parametroService = parametroService;
    }

    /**
     * Servicio para traer opciones del menu dependiendo del perfil del usuario
     * @param idprograma id de programa - programa que identifica app H&A
     * @return listado de opciones del menu
     */
    @GetMapping("/menu-app/{idprograma}")
    public ResponseEntity<List<OpcOpcion>> listarOpcionesMenu(@PathVariable("idprograma") Integer idprograma){
        Integer idusuario = authFacade.getCredentials().getAuditoria().getIdUsuario();
        Integer idempresa = authFacade.getCredentials().getAuditoria().getIdEmpresa();
        List<OpcOpcion> menu = this.perfilService.getOpcionesMenu(idprograma, idusuario, idempresa);
        return new ResponseEntity<>(menu, HttpStatus.OK);
    }

    /**
     * Servicio que retorna las unidades de permisos para os botones dependiendo del usuario logueado y del programa
     * @param programa id de programa
     * @return lista de unidades
     */
    @GetMapping("/unidades-control/{programa}")
    public ResponseEntity<List<Map<String, Object>>> getUnidadesUsuarioPrograma(@PathVariable("programa") Integer programa){
        Integer idusuario = authFacade.getCredentials().getAuditoria().getIdUsuario();
        List<Map<String, Object>> unidades = this.perfilService.getUnidadesUsuarioPrograma(programa, idusuario);
        return new ResponseEntity<>(unidades, HttpStatus.OK);
    }
    
    /**
     * Servicio que retornala versión actual de la app desde par_parametros.
     * @return versión app hya
     */
    @GetMapping("/consultar-version-app")
    public ResponseEntity<String> consultarVersionApp(){
        org.json.JSONObject hya_parametros = parametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
        return new ResponseEntity<>(hya_parametros.get("hyaVersionApp").toString(), HttpStatus.OK);
    }
}
