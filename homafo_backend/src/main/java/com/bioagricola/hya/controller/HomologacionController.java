package com.bioagricola.hya.controller;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.CnreCnvrecaudo;
import com.bioagricola.common.entity.Empresas;
import com.bioagricola.homologaciones.service.impl.EmpresasService;
import com.bioagricola.hya.dto.FiltroHomologacionDTO;
import com.bioagricola.hya.dto.GestionHomologaDTO;
import com.bioagricola.hya.service.DsusHomologacionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Clase que almacena los endpoints de los servicios relacionados con homologacion
 *
 * @author dsolano
 */
@RestController
@RequestMapping("api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HomologacionController {
    private final DsusHomologacionService service;
    private final AuthenticationFacade autoFacade;
    private final EmpresasService empresasService;

    public HomologacionController(DsusHomologacionService service, AuthenticationFacade autoFacade, EmpresasService empresasService) {
        this.service = service;
        this.autoFacade = autoFacade;
        this.empresasService = empresasService;
    }

    @PostMapping("homologacion")
    public GestionHomologaDTO save(@Valid @RequestBody GestionHomologaDTO dto) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        Integer idEmp = autoFacade.getCredentials().getAuditoria().getIdEmpresa();

        return service.create(dto, idUsu, idEmp);
    }

    @PutMapping("homologacion/{id}")
    public GestionHomologaDTO update(@Valid @RequestBody GestionHomologaDTO dto, @PathVariable("id") Long id) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        Integer idEmp = autoFacade.getCredentials().getAuditoria().getIdEmpresa();

        return service.update(id, dto, idUsu, idEmp);
    }

    /**
     * Servicio para filtrar homologacion
     *
     * @param dto parametros de filtro
     * @return lista de homologacion
     */
    @PostMapping("/homologacion/filtrar")
    public Page<GestionHomologaDTO> filter(@Valid @RequestBody FiltroHomologacionDTO dto, Pageable pageable) {
        return service.filter(dto, pageable.getPageNumber(), pageable.getPageSize());
    }

    /**
     * Servicio que retorna lista de convenios por empresa en sesion
     *
     * @return lista de convenios
     */
    @GetMapping("homologacion/convenios")
    public List<CnreCnvrecaudo> getAllAgreements() {
        return service.getAllAgreementsByEmpId(autoFacade.getCredentials().getAuditoria().getIdEmpresa().longValue());
    }

    /**
     * Servicio que retorna lista de empresas por convenio
     *
     * @return lista de empresas por convenio
     */
    @GetMapping("homologacion/convenios/{id}/empresas")
    public List<Empresas> getAllEmpByAgreementId(@PathVariable("id") Long id) {
        return service.getAllEmpByAgreementId(id);
    }

    /**
     * Servicio que retorna lista de convenios por empresa
     *
     * @return lista de convenios
     */
    @GetMapping("homologacion/empresas/{id}/convenios")
    public List<CnreCnvrecaudo> getAllAgreementByEmpId(@PathVariable("id") Long id) {
        return service.getAllAgreementsByEmpId(id);
    }

    /**
     * Servicio que retorna lista de empresas alternas
     * @return lista de empresas
     */
    @GetMapping("homologacion/empresas")
    public List<HashMap<String, Object>> getAllAgreementByEmpId() {
        Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
        return empresasService.listaEmpresasAlternas(idEmpresa);
    }


    /**
     * Servicio para filtrar historico homologacion
     */
    @PostMapping("/homologacion/historico")
    public ResponseEntity<List<Map<String, Object>>> getHistoryHomologation(@Valid @RequestBody FiltroHomologacionDTO dto) {
        List<Map<String,Object>> homologationInfo=this.service.getHistoryHomologation(dto);
        return new ResponseEntity<>(homologationInfo, HttpStatus.OK);
    }
}
