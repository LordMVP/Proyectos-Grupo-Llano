/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.llanogas.achagua.negocio.delegados;

import co.com.llanogas.achagua.persistencia.dao.RecaudoDAO;
import co.com.llanogas.achagua.negocio.utilidades.FechaUtil;
import co.com.llanogas.achagua.persistencia.conexion.BDConexion;
import co.com.llanogas.achagua.persistencia.dto.CicloPeriodoDTO;
import co.com.llanogas.achagua.persistencia.dto.DistribucionRecaudo;
import co.com.llanogas.achagua.persistencia.dto.FormaPagoRecaudoDTO;
import co.com.llanogas.achagua.persistencia.dto.InformacionAdicionalDTO;
import co.com.llanogas.achagua.persistencia.dto.InformacionRecaudoDTO;
import co.com.llanogas.achagua.persistencia.dto.RecaudoDTO;
import co.com.llanogas.achagua.persistencia.dto.RespuestaDTO;
import co.com.llanogas.achagua.persistencia.dto.SuscripcionDTO;
import co.com.llanogas.achagua.persistencia.excepcion.BaseDatosException;
import co.com.llanogas.achagua.persistencia.excepcion.RegistroExcepcion;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author hrey
 */
public class DelegadoCargarRecaudos {

    private Connection cnn;
    private RecaudoDAO recaudoDAO;

    public DelegadoCargarRecaudos() throws BaseDatosException {
        cnn = BDConexion.conectar();
        recaudoDAO = new RecaudoDAO(cnn);
    }

    public List<RespuestaDTO> cargarRecaudos(List<InformacionRecaudoDTO> listaRecaudos) {
        RespuestaDTO respuesta;
        List<RespuestaDTO> listaRespuesta = null;
        try {

            return procesarRecaudos(listaRecaudos);
        } catch (Throwable ex) {
            listaRespuesta = new ArrayList<RespuestaDTO>();
            respuesta = new RespuestaDTO();
            respuesta.setCodigoRespuesta(respuesta.getCodigoRespuesta());
            respuesta.setIdRecaudoEntidad(-666);
            respuesta.setMensaje("No se pudo terminar la transacción");
            listaRespuesta.add(respuesta);

        } finally {
            BDConexion.desconectar(cnn);
        }
        return listaRespuesta;
    }

    private List<RespuestaDTO> procesarRecaudos(List<InformacionRecaudoDTO> listaRecaudos) {
        RespuestaDTO respuesta;
        RecaudoDTO recaudo;
        List<RespuestaDTO> listaRespuesta = new ArrayList<RespuestaDTO>();
        for (InformacionRecaudoDTO informacionRecaudo : listaRecaudos) {
            respuesta = new RespuestaDTO();
            respuesta.setIdRecaudoEntidad(informacionRecaudo.getIdRecaudoEntidad());
            try {
                recaudo = getRecaudo(informacionRecaudo);
                recaudoDAO.insertarRecaudo(recaudo);
                insertarDistribucionRecaudo(recaudo);
                FormaPagoRecaudoDTO formaPago = insertarFormaPago(recaudo, informacionRecaudo);
                insertarInformacionAdicional(formaPago, informacionRecaudo);
                respuesta.setCodigoRespuesta(1);
                respuesta.setMensaje("recibido correctamente");
                BDConexion.commit(cnn);
            } catch (ParseException ex) {
                Logger.getLogger(DelegadoCargarRecaudos.class.getName()).log(Level.SEVERE, null, ex);
                respuesta.setCodigoRespuesta(-20);
                respuesta.setMensaje("Error en el formato de la fecha yyyy-MM-dd hh:mm:ss");
            } catch (SQLException ex) {
                Logger.getLogger(DelegadoCargarRecaudos.class.getName()).log(Level.SEVERE, null, ex);
                respuesta.setCodigoRespuesta(-6);
                respuesta.setMensaje("Error recibiendo el recaudo ");
            } catch (RegistroExcepcion ex) {
                respuesta.setCodigoRespuesta(ex.getCodigo());
                respuesta.setMensaje(ex.getMessage());
            } finally {
                BDConexion.rollBack(cnn);
            }
            listaRespuesta.add(respuesta);
        }
        return listaRespuesta;
    }

    private DistribucionRecaudo insertarDistribucionRecaudo(RecaudoDTO recaudo) throws SQLException, RegistroExcepcion {
        CicloPeriodoDTO cicloPeriodo = recaudoDAO.consultarCicloPeriodo(recaudo.getIdSuscripcion());
        DistribucionRecaudo distribucionRecaudo = new DistribucionRecaudo();
        distribucionRecaudo.setRecaudo(recaudo);
        distribucionRecaudo.setIdCiclo(cicloPeriodo.getIdCiclo());
        distribucionRecaudo.setIdPeriodo(cicloPeriodo.getIdPeriodo());
        recaudoDAO.insertarDistribucionRecaudo(distribucionRecaudo);
        return distribucionRecaudo;
    }

    private RecaudoDTO getRecaudo(InformacionRecaudoDTO informacion) throws ParseException, SQLException, RegistroExcepcion {
        SuscripcionDTO suscripcion = recaudoDAO.consultarSuscripcion(informacion.getIdSuscripcion());
        RecaudoDTO recaudo = new RecaudoDTO();
        recaudo.setEstado("G");
        recaudo.setIdSuscripcion(informacion.getIdSuscripcion());
        recaudo.setFecha(FechaUtil.convertir(informacion.getFechaPago()));
        recaudo.setFechaAplicado(new Date());
        recaudo.setIdConvenio(0);
        recaudo.setIdDocumento(informacion.getIdClasePago());
        recaudo.setIdEmpresa(suscripcion.getIdEmpresa());
        recaudo.setIdMedioPago(informacion.getIdMedioPago());
        recaudo.setIdSuscriptor(suscripcion.getIdSuscriptor());
        recaudo.setIdTercero(suscripcion.getIdTercero());
        recaudo.setValorAjuste(0);
        recaudo.setValorCambio(0);
        recaudo.setValorPagado(informacion.getValorConsignado());
        recaudo.setValorReal(informacion.getValorConsignado());
        return recaudo;
    }

    private FormaPagoRecaudoDTO insertarFormaPago(RecaudoDTO recaudo, InformacionRecaudoDTO informacion) throws SQLException {
        FormaPagoRecaudoDTO formaPago = new FormaPagoRecaudoDTO();
        formaPago.setRecaudo(recaudo);
        recaudoDAO.insertarFormaPago(formaPago, informacion);
        return formaPago;
    }

    private void insertarInformacionAdicional(FormaPagoRecaudoDTO formpaPago, InformacionRecaudoDTO informacion) throws SQLException {
        InformacionAdicionalDTO infoAdicional = new InformacionAdicionalDTO();
        infoAdicional.setDescripcion("webservices");
        infoAdicional.setEstado("A");
        infoAdicional.setFormaPago(formpaPago);
        infoAdicional.setGrupoInformacion(1);
        infoAdicional.setIdDetalleTipo(10);
        infoAdicional.setIdTipo(9);
        infoAdicional.setInformacion(informacion.getNumeroNota());
        infoAdicional.setTipoNombre("Numero Nota");
        recaudoDAO.insertarInformacionAdicional(infoAdicional);

        infoAdicional = new InformacionAdicionalDTO();
        infoAdicional.setDescripcion("webservices");
        infoAdicional.setEstado("A");
        infoAdicional.setFormaPago(formpaPago);
        infoAdicional.setGrupoInformacion(1);
        infoAdicional.setIdDetalleTipo(10);
        infoAdicional.setIdTipo(9);
        infoAdicional.setInformacion(informacion.getEntidadRecaudadora());
        infoAdicional.setTipoNombre("Entidad recaudadora");
        recaudoDAO.insertarInformacionAdicional(infoAdicional);

        infoAdicional = new InformacionAdicionalDTO();
        infoAdicional.setDescripcion("webservices");
        infoAdicional.setEstado("A");
        infoAdicional.setFormaPago(formpaPago);
        infoAdicional.setGrupoInformacion(1);
        infoAdicional.setIdDetalleTipo(10);
        infoAdicional.setIdTipo(9);
        infoAdicional.setInformacion(informacion.getNumeroConsignacion());
        infoAdicional.setTipoNombre("Número Consignacion");
        recaudoDAO.insertarInformacionAdicional(infoAdicional);

        infoAdicional = new InformacionAdicionalDTO();
        infoAdicional.setDescripcion("webservices");
        infoAdicional.setEstado("A");
        infoAdicional.setFormaPago(formpaPago);
        infoAdicional.setGrupoInformacion(1);
        infoAdicional.setIdDetalleTipo(10);
        infoAdicional.setIdTipo(9);
        infoAdicional.setInformacion(informacion.getNumeroCuentaEmpresa());
        infoAdicional.setTipoNombre("Número cuenta empresa");
        recaudoDAO.insertarInformacionAdicional(infoAdicional);

        infoAdicional = new InformacionAdicionalDTO();
        infoAdicional.setDescripcion("webservices");
        infoAdicional.setEstado("A");
        infoAdicional.setFormaPago(formpaPago);
        infoAdicional.setGrupoInformacion(1);
        infoAdicional.setIdDetalleTipo(10);
        infoAdicional.setIdTipo(9);
        infoAdicional.setInformacion(informacion.getIdRecaudoEntidad() + "");
        infoAdicional.setTipoNombre("Número recaudo entidad ");
        recaudoDAO.insertarInformacionAdicional(infoAdicional);
    }

}
