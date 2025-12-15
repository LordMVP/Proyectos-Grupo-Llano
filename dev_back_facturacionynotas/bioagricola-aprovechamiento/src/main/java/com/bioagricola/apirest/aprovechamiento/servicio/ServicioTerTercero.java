package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.negocio.NegocioTerTercero;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.ITerTercero;
import com.bioagricola.apirest.modelo.dtos.TerTerceroDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad TerTercero
 *
 * @author GeneradorCRUD
 */
@RestController
@RequestMapping("/webresources/servicios/tertercero")
public class ServicioTerTercero implements ITerTercero {

    @Autowired
    private NegocioTerTercero negocioTerTercero;

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(ServicioTerTercero.class.getName());

    /**
     * Método de servicio encargado de consultar los terceros aprovechadores que coincidan
     * por nombre con el texto suministrado
     */
    @GetMapping("/consultaTercerosAprovechadoresPorNombre")
    public List<TerTerceroDTO> consultaTercerosAprovechadoresPorNombre(
            @RequestParam(value = "nombre") String nombre)
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException {

        return negocioTerTercero.consultaTercerosAprovechadoresPorNombre(nombre);
    }

    /**
     * Método de servicio encargado de consultar los terceros aprovechadores que coincidan
     * por documento con el texto suministrado
     */
    @GetMapping("/consultaTercerosAprovechadoresPorDocumentoYDigito")
    public List<TerTerceroDTO> consultaTercerosAprovechadoresPorDocumentoYDigito(
            @RequestParam(value = "documento") String documento,
            @RequestParam(value = "digito") String digito)
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException {

        return negocioTerTercero.consultaTercerosAprovechadoresPorDocumentoYDigito(documento, digito);
    }

    @GetMapping("/consultaTercerosIncentivoAprovechadorPorNombre")
    public List<TerTerceroDTO> consultaTercerosIncentivoAprovechadorPorNombre()
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException {

        return negocioTerTercero.consultaTercerosIncentivoAprovechadorPorNombre();
    }

    /**
     * Método de servicio encargado de consultar los terceros aprovechadores
     * según su clasificación
     */
    @GetMapping("/consultaTercerosAprovechadoresPorClasificacion")
    public List<TerTerceroDTO> consultaTercerosAprovechadoresPorClasificacion(
            @RequestParam(value = "clasificacion") String clasificacion,
            @RequestParam(value = "dsuscripId", required = false) Integer dsuscripId)
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException {

        return negocioTerTercero.consultaTercerosAprovechadoresPorClasifificacion(clasificacion, dsuscripId != null);
    }

    /**
     * Método de servicio encargado de consultar los terceros aprovechadores
     * se aprovechamiento e incentivo aprovechamiento
     */
    @GetMapping("/consultaTercerosAprovechadores")
    public List<TerTerceroDTO> consultaTercerosAprovechadores()
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException {

        return negocioTerTercero.consultaTercerosAprovechadores();
    }

    // protected region Use esta region para su implementacion de otros servicios on begin

    // protected region Use esta region para su implementacion de otros servicios end

}
