package com.bioagricola.apirest.aprovechamiento.negocio;

import com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.TerTerceroDTO;
import com.bioagricola.apirest.modelo.entidades.TerTercero;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorTerTercero;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// protected region Incluya importaciones adicionales en esta seccion on begin


// protected region Incluya importaciones adicionales en esta seccion end


/**
 * Servicios para operaciones CRUD y de negocio sobre la entidad TerTercero
 *
 * @author GeneradorCRUD
 */
@Service
public class NegocioTerTercero extends NegocioAbstracto<TerTercero, TerTerceroDTO> {

    @Autowired
    private NegocioParParametro negocioParParametro;

    @Autowired
    private ManejadorTerTercero manejadorTerTercero;

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(NegocioTerTercero.class.getName());

    // protected region Declare atributos adicionales en esta seccion on begin

    // protected region Declare atributos adicionales en esta seccion end

    /**
     * Método encargado de retornar una lista de terceros filtrando por nombre completo
     *
     * @param nombre Cadena de caracteres a utilizar para filtrar la lista de terceros.
     * @return List<TerTerceroDTO>
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     */
    public List<TerTerceroDTO> consultaTercerosAprovechadoresPorNombre(String nombre)
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException {
        List<Integer> clasificaciones = getClasificacionesAprovechamiento();

        List<TerTercero> terceros = manejadorTerTercero.consultaTercerosAprovechadoresPorNombre(
                nombre.toUpperCase(),
                clasificaciones);

        return convertirListaEntidadesADao(terceros);
    }

    /**
     * Método encargado de retornar una lista de terceros filtrando por documento y digito de verificación
     *
     * @param documento Cadena de caracteres a utilizar para filtrar la lista de terceros.
     * @param digito    Cadena de caracteres a utilizar para filtrar la lista de terceros.
     * @return List<TerTerceroDTO>
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     */
    public List<TerTerceroDTO> consultaTercerosAprovechadoresPorDocumentoYDigito(String documento, String digito)
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException {
        List<Integer> clasificaciones = getClasificacionesAprovechamiento();

        List<TerTercero> terceros;

        if (digito.isEmpty()) {
            terceros = manejadorTerTercero.consultaTercerosAprovechadoresPorDocumento(
                    documento, clasificaciones);
        } else if (documento.isEmpty()) {
            terceros = manejadorTerTercero.consultaTercerosAprovechadoresPorDigito(
                    Short.valueOf(digito), clasificaciones);
        } else {
            terceros = manejadorTerTercero.consultaTercerosAprovechadoresPorDocumentoYDigito(
                    documento, Short.valueOf(digito), clasificaciones);
        }

        return convertirListaEntidadesADao(terceros);
    }

    public List<TerTerceroDTO> consultaTercerosAprovechadoresPorClasifificacion(String clasificacion, boolean isDsuscripId)
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException { // HU-159
        List<Integer> clasificaciones = getClasificacionesAprovechamiento();

        List<TerTercero> terceros;
        Integer clasificationValue = 0;
        switch (clasificacion) {
            case "APROVECHADOR":
                clasificationValue = clasificaciones.get(0);
                break;
            case "APROVECHADORINCENTIVO":
                clasificationValue = clasificaciones.get(1);
                break;
            default:
                throw new InvalidParameterException("No se envió una clasificación correcta");
        }

        if (isDsuscripId)
            terceros = manejadorTerTercero.consultaTercerosIncentivoAprovechadorOAprovechador(clasificationValue);
        else
            terceros = manejadorTerTercero.consultaTercerosAprovechadoresPorClasificacion(clasificationValue);

        return convertirListaEntidadesADao(terceros);
    }
    
    public List<TerTerceroDTO> consultaTercerosAprovechadores()
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException { // HU-159
        List<Integer> clasificaciones = getClasificacionesAprovechamiento();

        List<TerTercero> terceros = new ArrayList<>();

        terceros.addAll(manejadorTerTercero.consultaTercerosAprovechadoresPorClasificacion(clasificaciones.get(0)));
        terceros.addAll(manejadorTerTercero.consultaTercerosAprovechadoresPorClasificacion(clasificaciones.get(1)));

        return convertirListaEntidadesADao(terceros);
    }

    private List<Integer> getClasificacionesAprovechamiento() throws JsonParseException, JsonMappingException, IOException {
        Map<String, Object> parametros = negocioParParametro.consultaParametrosAprovechamiento();

        List<Integer> clasificaciones = new ArrayList<>();

        clasificaciones.add((Integer) parametros.get(ConstantesServicios.CLASIFICACION_TERCERO_APROVECHADOR));
        clasificaciones.add((Integer) parametros.get(ConstantesServicios.CLASIFICACION_TERCERO_INCENTIVO_APROVECHADOR));

        return clasificaciones;
    }

    /**
     * Metodo encargado de retornar informacion adicional de terceros aprovechadores
     *
     * @return
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     */
    public Map<Integer, Object> consultaParametrosTerceroAprovechador(Long terIderegistro)
            throws JsonParseException, JsonMappingException, IOException {
        Map<Integer, Object> consulta = this.consultaParametros(ConstantesServicios.INFO_TERCEROAPROVECHADOR, terIderegistro);
        return consulta;
    }


    /**
     * Metodo encargado de retornar parametro de informacion adicional del tercero aprovechador
     *
     * @param parametroAConsultar
     * @return Map<String, Object>
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     */
    public Map<Integer, Object> consultaParametros(String parametroAConsultar, Long terIderegistro) throws JsonParseException, JsonMappingException, IOException {
        List<TerTercero> terceroInfo = manejadorTerTercero.consultaTerceroInfoAdicional(terIderegistro);
        Map<Integer, Object> parametros = new HashMap<>();
        if (!terceroInfo.isEmpty()) {
            TerTercero tercero = terceroInfo.get(0);
            parametros = new ObjectMapper().readValue(tercero.getTerInfoadicional(), HashMap.class);
            parametros.get(parametroAConsultar);
        }

        return parametros;
    }

    /**
     * Método encargado de retornar una lista de terceros filtrando por nombre completo
     *
     * @return List<TerTerceroDTO>
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     */
    public List<TerTerceroDTO> consultaTercerosIncentivoAprovechadorPorNombre()
            throws JsonParseException, JsonMappingException, IOException, InvalidParameterException {
        List<Integer> clasificaciones = getClasificacionesIncentivoAprovechador();

        List<TerTercero> terceros = manejadorTerTercero.consultaTercerosIncentivoAprovechador(clasificaciones);

        return convertirListaEntidadesADao(terceros);
    }

    private List<Integer> getClasificacionesIncentivoAprovechador() throws JsonParseException, JsonMappingException, IOException {
        Map<String, Object> parametros = negocioParParametro.consultaParametrosAprovechamiento();

        List<Integer> clasificaciones = new ArrayList<>();

        clasificaciones.add((Integer) parametros.get(ConstantesServicios.CLASIFICACION_TERCERO_INCENTIVO_APROVECHADOR));

        return clasificaciones;
    }


    /**
     * {@inheritDoc}
     *
     * @param nombreAtributo {@inheritDoc}
     * @return {@inheritDoc}
     */
    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        return TerTercero.contieneAtributo(nombreAtributo);
    }

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    protected Logger getLogger() {
        return logger;
    }

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    protected TerTerceroDTO instanciarDAO() {
        return new TerTerceroDTO();
    }

    // protected region Use esta region para su implementacion de otros metodos on begin


    // protected region Use esta region para su implementacion de otros metodos end

}
