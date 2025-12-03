/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.servlet;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.basedatos.ConexionBD;
import com.gell.psews.persistencia.dto.RespuestaDTO;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author lrey
 */
public abstract class ServletEstandarJSON extends ServletGenerico {

    @Override
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String accion = request.getServletPath();
        RespuestaDTO respuesta;
        try (PrintWriter out = response.getWriter()) {
            try {
                respuesta = procesar(request, response, accion);
                int codigo = respuesta.getCodigo();

                respuesta.setCodigo(codigo > 0 ? 1 : (codigo < 0) ? -1 : 0);
            } catch (AplicacionExcepcion e) {
                respuesta = new RespuestaDTO();
                respuesta.setCodigo(-1);
                respuesta.setMensaje(e.getMensaje());
            }
            GsonBuilder gsonBuilder = new GsonBuilder();
            gsonBuilder.setDateFormat("dd/MM/yyyy");
            out.print(gsonBuilder.create().toJson(respuesta));
        }
    }

    public RespuestaDTO procesar(HttpServletRequest request, HttpServletResponse response, String accion) throws IOException, AplicacionExcepcion {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Connection cnn = null;
        RespuestaDTO respuesta;
        try {
            cnn = ConexionBD.conectar();
            respuesta = procesarPeticionJSON(request, response, accion, cnn);
            ConexionBD.commit(cnn);
            return respuesta;
        } catch (JsonSyntaxException ex) {
            LogUtil.error(ex);
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_ACTUALIZAR_FACTURA_JSON);
        } catch (AplicacionExcepcion e) {
            throw e;
        } catch (Throwable ex) {
            LogUtil.error(ex);
            throw new AplicacionExcepcion(EMensajes.ERROR_NEGOCIO_FATAL);
        } finally {
            ConexionBD.cerrar(cnn);
        }
    }

    public abstract RespuestaDTO procesarPeticionJSON(HttpServletRequest request, HttpServletResponse response, String accion, Connection cnn) throws AplicacionExcepcion;

}
