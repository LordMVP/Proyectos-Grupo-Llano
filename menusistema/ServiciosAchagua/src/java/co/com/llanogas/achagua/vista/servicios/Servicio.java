/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.llanogas.achagua.vista.servicios;

import co.com.llanogas.achagua.negocio.delegados.DelegadoCargarRecaudos;
import co.com.llanogas.achagua.persistencia.dto.InformacionRecaudoDTO;
import co.com.llanogas.achagua.persistencia.dto.RespuestaDTO;
import co.com.llanogas.achagua.persistencia.excepcion.BaseDatosException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

@WebService
public class Servicio {

    /**
     *
     * @param listaRecaudos
     * @return
     */
    @WebMethod(operationName = "cargarRecaudos")
    public List<RespuestaDTO> cargarRecaudos(@WebParam(name = "listaRecaudos") List<InformacionRecaudoDTO> listaRecaudos) {
        ArrayList<RespuestaDTO> listaRespuestas;
        try {
            if (listaRecaudos == null || listaRecaudos.isEmpty()) {
                RespuestaDTO respuesta = new RespuestaDTO();
                respuesta.setCodigoRespuesta(-11);
                respuesta.setMensaje("La lista de recuados está vacía");
                listaRespuestas = new ArrayList<RespuestaDTO>();
                listaRespuestas.add(respuesta);
                return listaRespuestas;
            }
            return new DelegadoCargarRecaudos().cargarRecaudos(listaRecaudos);
        } catch (BaseDatosException ex) {
            Logger.getLogger(Servicio.class.getName()).log(Level.SEVERE, null, ex);
            listaRespuestas = new ArrayList<RespuestaDTO>();
            RespuestaDTO respuesta = new RespuestaDTO();
            respuesta.setCodigoRespuesta(respuesta.getCodigoRespuesta());
            respuesta.setIdRecaudoEntidad(-666);
            respuesta.setMensaje("No se pudo procesar ningun registro");
            listaRespuestas.add(respuesta);
            return listaRespuestas;
        }

    }

}
