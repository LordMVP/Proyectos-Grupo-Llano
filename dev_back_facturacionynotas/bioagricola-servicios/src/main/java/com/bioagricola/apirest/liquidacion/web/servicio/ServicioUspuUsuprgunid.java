package com.bioagricola.apirest.liquidacion.web.servicio;

import com.bioagricola.apirest.liquidacion.negocio.NegocioUspuUsuprgunid;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IUspuUsuprgunid;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad Recalmo
 *
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/uspuusuprgunid")
public class ServicioUspuUsuprgunid implements IUspuUsuprgunid {

    @Autowired
    private NegocioUspuUsuprgunid negocioUspuUsuprgunid;

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(ServicioUspuUsuprgunid.class.getName());

    /**
     * Método de servicio encargado de consultar los privilegios de un usuario en sesión
     *
     * @throws IOException
     */
    @GetMapping("/consultaPrivilegios")
    public boolean consultaPrivilegios(@RequestParam("idPrograma") Integer idPrograma) throws IOException {

        return negocioUspuUsuprgunid.consultaPrivilegios(idPrograma);
    }

    /**
     * Método de servicio encargado de consultar los privilegios de un usuario en sesión
     *
     * @throws IOException
     */
    @GetMapping("/consultaPrivilegiosIlimitadoReporte")
    public int consultaPrivilegiosIlimitadoReporte(@RequestParam("idPrograma") Integer idPrograma) throws IOException {

        return negocioUspuUsuprgunid.consultaPrivilegiosIlimitadoReporte(idPrograma);
    }

}
