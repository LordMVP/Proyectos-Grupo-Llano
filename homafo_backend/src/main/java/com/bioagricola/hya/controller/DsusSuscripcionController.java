package com.bioagricola.hya.controller;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.hya.dto.DsusDetsuscripDTO;
import com.bioagricola.hya.dto.FiltroDsusDTO;
import com.bioagricola.hya.service.DsusSuscripcionService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Clase que almacena los endpoints de los servicios relacionados con suscripcion
 *
 * @author cperez@progracol.com
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DsusSuscripcionController {
    private final DsusSuscripcionService service;
    private final AuthenticationFacade autoFacade;

    /**
     * Constructor de la clase
     *
     * @param service
     * @param autoFacade
     */
    public DsusSuscripcionController(DsusSuscripcionService service, AuthenticationFacade autoFacade) {
        this.service = service;
        this.autoFacade = autoFacade;
    }

    /**
     * Servicio para guardar un nuevo detalle de suscripcion
     *
     * @param dto dto detalle de suscripcion
     * @return detalle de suscripcion guardado
     */
    @PostMapping("/suscripcion")
    public DsusDetsuscrip create(@Valid @RequestBody DsusDetsuscripDTO dto) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        Integer idEmp = autoFacade.getCredentials().getAuditoria().getIdEmpresa();

        return service.create(dto, idUsu, idEmp);
    }

    /**
     * Servicio para editar una suscripcion
     *
     * @param dto dto detalle suscripcion
     * @param id  id del detalle de suscripcion a editar
     * @return Suscripcion editada con exito
     */
    @PutMapping("/suscripcion/{id}")
    public DsusDetsuscrip update(@Valid @RequestBody DsusDetsuscripDTO dto, @PathVariable("id") Long id) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        Integer idEmp = autoFacade.getCredentials().getAuditoria().getIdEmpresa();

        return service.update(id, dto, idUsu, idEmp);
    }

    /**
     * Servicio para listar suscripciones por id de tercero
     *
     * @param id id tercero
     * @return lista suscripciones
     */
    @GetMapping("/terceros/{id}/suscripciones")
    public List<DsusDetsuscrip> getAllSubscriptionsByIdTer(@PathVariable("id") Long id) {
        Integer idEmp = autoFacade.getCredentials().getAuditoria().getIdEmpresa();

        return service.findAllByIdTer(id, idEmp);
    }

    @GetMapping("/terceros/{idtercero}/suscripciones/{idempresa}")
    public List<Map<String,Object>> getAllSubscriptionsByIdTerAndEnterprise(@PathVariable("idtercero") Long id,@PathVariable("idempresa") Integer idempresa) {
        return service.findAllByIdTerAndEnterprise(id,idempresa);
    }

    /**
     * Servicio para listar suscripciones por id de suscriptor
     *
     * @param id id suscriptor
     * @return lista suscripciones
     */
    @GetMapping("/suscripciones/{id}/detalles-suscripcion")
    public List<DsusDetsuscrip> getAllByIdSus(@PathVariable("id") Long id) {
        Integer idEmp = autoFacade.getCredentials().getAuditoria().getIdEmpresa();

        return service.getAllByIdSus(id, idEmp);
    }

    /**
     * Servicio para listar las propiedades disponibles para asignar suscripcion
     *
     * @param idtercero id tercero
     * @return lista de propiedades disponibles
     */
    @GetMapping("/suscripciones/{idtercero}/propiedades")
    public List<Map<String, ?>> getAllPropertiesByIdTer(@PathVariable("idtercero") Long idtercero) {
        return service.getAllPropertiesByIdTer(idtercero);
    }


    /**
     * Servicio que retorna detalle de suscripcion por id
     *
     * @param id id dsus
     * @return detalle de suscripcion
     */
    @GetMapping("/suscripciones/{id}")
    public DsusDetsuscrip search(@PathVariable("id") Long id) {
        return service.search(id);
    }

    /**
     * Servicio para buscar suscripciones
     *
     * @param dto parametros de filtro
     * @return lista de suscripciones
     */
    @PostMapping("/suscripciones/search")
    public List<HashMap<String, Object>> search(@Valid @RequestBody FiltroDsusDTO dto) {
        Integer idEmp = autoFacade.getCredentials().getAuditoria().getIdEmpresa();
        Integer idsus=null;
        if(dto.getIdsus()!=null) { idsus=dto.getIdsus().intValue(); }
        return service.search(idsus, dto.getMedidor(), dto.getPcodigo(), dto.getIdempresa(), idEmp, dto.getDeshomologacion());
    }

}
