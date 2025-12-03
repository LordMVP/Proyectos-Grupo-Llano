/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.delegado;

import com.gell.psews.negocio.constantes.EEstado;
import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.servicio.ArrayOfPSEHostingField;
import com.gell.psews.negocio.servicio.ArrayOfPSEHostingMemberService;
import com.gell.psews.negocio.servicio.PSEHostingCreateTransactionReturn;
import com.gell.psews.negocio.servicio.PSEHostingField;
import com.gell.psews.negocio.servicio.PSEHostingMemberService;
import com.gell.psews.negocio.servicio.PSEHostingTransactionInformationReturn;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.negocio.util.ServicioPSE;
import com.gell.psews.negocio.procesos.ProcesoVerificacionPSE;
import com.gell.psews.negocio.servicio.PSEHostingCreateTransactionReturnCode;
import com.gell.psews.negocio.servlet.ServletGenerico;
import com.gell.psews.negocio.util.CertificadoUtil;
import com.gell.psews.persistencia.basedatos.ConexionBD;
import com.gell.psews.persistencia.dao.DetalleRecaudoWebDAO;
import com.gell.psews.persistencia.dao.FacturaDAO;
import com.gell.psews.persistencia.dao.ParametroDAO;
import com.gell.psews.persistencia.dao.RecaudoWebLogDAO;
import com.gell.psews.persistencia.dto.DetalleAplicacionRecaudoDTO;
import com.gell.psews.persistencia.dto.DetalleRecaudoWebDTO;
import com.gell.psews.persistencia.dto.DistribucionRecaudoDTO;
import com.gell.psews.persistencia.dto.PagadorDTO;
import com.gell.psews.persistencia.dto.PagoAdicionalDTO;
import com.gell.psews.persistencia.dto.RecaudoWebDTO;
import com.gell.psews.persistencia.dto.RecaudoWebLogDTO;
import com.gell.psews.persistencia.dto.RespuestaDTO;
import com.gell.psews.persistencia.dto.UsuarioDTO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.persistencia.dto.pse.DatosPSE;
import com.gell.psews.persistencia.dto.pse.EmpresaDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;
import com.google.gson.Gson;
import java.math.BigDecimal;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author lrey
 */
@SuppressWarnings("UseSpecificCatch")
public class PSEDelegado {

    private final Connection cnn;
    private final RecaudoWebDelegado recaudoWebDelegado;
    private final SuscripcionDelegado suscripcionDelegado;

    public PSEDelegado(Connection cnn) {
        this.cnn = cnn;
        recaudoWebDelegado = new RecaudoWebDelegado(cnn);
        suscripcionDelegado = new SuscripcionDelegado(cnn);
    }

    public RespuestaDTO<Properties> createTransactionPaymentMulticreditHosting(String codigoCliente, PagadorDTO pagador, int idEmpresaRecaudadora)
            throws PersistenciaExcepcion, NegocioExcepcion {
        ConfiguracionDTO configuracion = ServletGenerico.LISTA_CONFIGURACION.get(idEmpresaRecaudadora);
        if (configuracion == null) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CONFIGURACION, "" + idEmpresaRecaudadora);
        }
        RecaudoWebDTO recaudoWebDTO = new RecaudoWebDTO();
        recaudoWebDTO.setEmail(pagador.getCorreo());
        recaudoWebDTO.setEstado(EEstado.RecaudoWeb.PENDIENTE);
        String respuesta = "";
        try {
            UsuarioDTO usuario = suscripcionDelegado.consultarPagoPSE(codigoCliente, idEmpresaRecaudadora);
            recaudoWebDTO.setValorPagoTotal(usuario.getValorGas() + usuario.getValorAseo());
            setReferencia(recaudoWebDTO, pagador);
            recaudoWebDTO.setCamposPagador(new Gson().toJson(pagador));
            setDatosPSE(recaudoWebDTO, configuracion);
            recaudoWebDelegado.insertarRecaudoWeb(recaudoWebDTO);
            ConexionBD.commit(cnn);

            guardarLog(recaudoWebDTO, cnn);
            /**
             * Clases que provee el webservices de PSE de acuerdo al WSDL
             * otorgado
             */
            ArrayOfPSEHostingField fields = getCamposAdicionales(pagador, usuario);
            ArrayOfPSEHostingMemberService memberServices = getServiciosAdicionales(usuario, configuracion);
             PSEHostingCreateTransactionReturn identificador = ServicioPSE.createTransactionPaymentMulticreditHosting(recaudoWebDTO, fields, memberServices, pagador.getIp(), configuracion);
            

            RespuestaDTO respuestaDTO = procesarRespuesta(identificador, recaudoWebDTO, usuario, configuracion);
            respuesta = new Gson().toJson(respuestaDTO);
            return respuestaDTO;
        } catch (PersistenciaExcepcion | NegocioExcepcion e) {
            LogUtil.error(e);
            respuesta = LogUtil.getTraza(e);
            throw e;
        } catch (Exception e) {
            LogUtil.error(e);
            respuesta = LogUtil.getTraza(e);
            recaudoWebDTO.setMensaje(e.getMessage());
            recaudoWebDTO.setEstado(EEstado.RecaudoWeb.ERROR);
            recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_PETICION);
        } finally {
            actualizarLog(respuesta, recaudoWebDTO, cnn);
        }
    }

    public RespuestaDTO<Properties> createTransactionPaymentMulticreditHostingConAdicional(double pagoadionaseo, double pagoadiciongas, String tramaPpa_ideregistro, Float PagoAdicionalSeleccionado, String codigoCliente, PagadorDTO pagador, int idEmpresaRecaudadora)
            throws PersistenciaExcepcion, NegocioExcepcion {
        ConfiguracionDTO configuracion = ServletGenerico.LISTA_CONFIGURACION.get(idEmpresaRecaudadora);
        if (configuracion == null) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CONFIGURACION, "" + idEmpresaRecaudadora);
        }
        RecaudoWebDTO recaudoWebDTO = new RecaudoWebDTO();
        recaudoWebDTO.setEmail(pagador.getCorreo());
        recaudoWebDTO.setEstado(EEstado.RecaudoWeb.PENDIENTE);
        recaudoWebDTO.setMedioPago(6657L); // AJUSTAR PENDIENTE
        String respuesta = "";

        float valorPagoadiciona = 0;
        ArrayList<PagoAdicionalDTO> pagoAdicional = new ArrayList<>();
        
        System.out.println("\t codigo:"+codigoCliente + " -- "+idEmpresaRecaudadora + "Pagador:"+pagador.getNombreCliente());
        
        try {

            UsuarioDTO usuario = suscripcionDelegado.consultarPagoPSE(codigoCliente, idEmpresaRecaudadora);

            System.out.println("valor gas " + usuario.getValorGas() + " valor aseo" + usuario.getValorAseo() + " total valor adicional" + PagoAdicionalSeleccionado);

            System.out.println("codigo cliente ............" + codigoCliente);
            recaudoWebDTO.setValorPagoTotal(usuario.getValorGas() + usuario.getValorAseo() + PagoAdicionalSeleccionado);
            setReferencia(recaudoWebDTO, pagador);
            recaudoWebDTO.setCamposPagador(new Gson().toJson(pagador));
            setDatosPSE(recaudoWebDTO, configuracion);            
            recaudoWebDelegado.insertarRecaudoWeb(recaudoWebDTO);
            ConexionBD.commit(cnn);
            PSEHostingCreateTransactionReturn identificador = new PSEHostingCreateTransactionReturn();
            guardarLog(recaudoWebDTO, cnn);
            /**
             * Clases que provee el webservices de PSE de acuerdo al WSDL
             * otorgado
             */
            ArrayOfPSEHostingField fields = getCamposAdicionales(pagador, usuario);
            ArrayOfPSEHostingMemberService memberServices = getServiciosAdicionales(usuario, configuracion);

            // PSEHostingCreateTransactionReturn identificador = ServicioPSE.createTransactionPaymentMulticreditHocreateTransactionPaymentMulticreditHostingsting(recaudoWebDTO, fields, memberServices, pagador.getIp(), configuracion);
            identificador.setReturnCode(PSEHostingCreateTransactionReturnCode.OK);

            System.out.println("valor adicional de seo y gas " + pagoadionaseo + " " + pagoadiciongas);

            usuario.setValorAdicionalAseo(pagoadionaseo);
            usuario.setValorAdicionalGas(pagoadiciongas);
            recaudoWebDTO.setTramaPpa_ideregistro(tramaPpa_ideregistro);
            RespuestaDTO respuestaDTO = procesarRespuestaAdicional(identificador, recaudoWebDTO, usuario, configuracion);
            respuesta = new Gson().toJson(respuestaDTO);

            return respuestaDTO;
        } catch (PersistenciaExcepcion | NegocioExcepcion e) {
            LogUtil.error(e);
            respuesta = LogUtil.getTraza(e);
            throw e;
        } catch (Exception e) {
            LogUtil.error(e);
            respuesta = LogUtil.getTraza(e);
            recaudoWebDTO.setMensaje(e.getMessage());
            recaudoWebDTO.setEstado(EEstado.RecaudoWeb.ERROR);
            recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_PETICION);
        } finally {
            actualizarLog(respuesta, recaudoWebDTO, cnn);
        }
    }

    private void setReferencia(RecaudoWebDTO recaudo, PagadorDTO pagador)
            throws NegocioExcepcion, PersistenciaExcepcion {
        recaudo.setReferenceNumber1(pagador.getIp());
        recaudo.setReferenceNumber2(pagador.getTipoDocumentoCliente());
        recaudo.setReferenceNumber3(pagador.getIdCliente());

    }

    private void crearDetalleRecaudoWebAdicional(UsuarioDTO usuario, RecaudoWebDTO recaudoWeb, ConfiguracionDTO configuracionDTO)
            throws PersistenciaExcepcion {
        ArrayList<DetalleAplicacionRecaudoDTO> facturaselecccionadaGas = new ArrayList<>();
        ArrayList<DetalleAplicacionRecaudoDTO> facturaselecccionadaAseo = new ArrayList<>();
        int sus_aseo = 0;
        int sus_gas = 0;

        double valoradicional = 0.0;
        if (usuario.getValorAdicionalGas() != null) {
            valoradicional = (double) usuario.getValorAdicionalGas();

        }
        long idEmpresaPrincipal = configuracionDTO.getEmpresa().getIdEmpresaPrincipal();
        DetalleRecaudoWebDAO detalleRecaudoWebDAO = new DetalleRecaudoWebDAO(cnn);
        DetalleRecaudoWebDTO detalleRecaudo = new DetalleRecaudoWebDTO();
        detalleRecaudo.setIdRecaudoWeb(recaudoWeb.getIdRecaudoWeb());
        detalleRecaudo.setEstadoPago(EEstado.DetalleRecaudoWeb.Pago.PENDIENTE);
        detalleRecaudo.setEstadoAplicacionPago(EEstado.DetalleRecaudoWeb.Aplicacion.PENDIENTE);
        detalleRecaudo.setIdEmpresa(idEmpresaPrincipal);
        detalleRecaudo.setIdSuscripcion(usuario.getIdSuscripcion());
        System.out.println("sus gas " + usuario.getIdSuscripcion() + " con empresa " + idEmpresaPrincipal + "valor adicional " + usuario.getValorAdicionalGas());
        Double valor = usuario.getValorGas() + valoradicional;
        detalleRecaudo.setValorPago(valor);

        int idrecaudo = 0;
        sus_gas = Integer.parseInt(usuario.getIdSuscripcion().toString());

        System.out.println("se consultara facturas adicionales de gas " + sus_gas);
        facturaselecccionadaGas = this.retornarFacturasjson(recaudoWeb.getTramaPpa_ideregistro(), sus_gas);

        for (DetalleAplicacionRecaudoDTO detalleAplicacionRecaudoDTO : facturaselecccionadaGas) {
            System.out.println("facturas json =" + detalleAplicacionRecaudoDTO.getDwra_idfacturas() + " ppa_ideregistro =" + detalleAplicacionRecaudoDTO.getPpa_ideregistro());
        }

//System.out.println("facturas json gas "+facturaselecccionadaGas);
//detalleRecaudo.setFacturasAdicionales(facturaselecccionadaGas);
//.setDetalleAplicacionRecaudo(facturaselecccionadaGas);
        idrecaudo = detalleRecaudoWebDAO.insertarDetalleRecaudo2(detalleRecaudo);
        int uni_recaudoA = 0;
        if (idrecaudo > 0) {
            uni_recaudoA = detalleRecaudoWebDAO.parametro_aplicacion((int) idEmpresaPrincipal);
               System.out.println("RECAUDO"+uni_recaudoA);
               System.out.println("EMPRESA->"+idEmpresaPrincipal);
            for (DetalleAplicacionRecaudoDTO detalleAplicacionRecaudoDTO : facturaselecccionadaGas) {
                detalleRecaudoWebDAO.insertarDetalleAplicacionRecaudo(detalleAplicacionRecaudoDTO, idrecaudo, uni_recaudoA, sus_gas);
            }
        }
        long idEmpresaSegunda = configuracionDTO.getEmpresa().getIdEmpresaSegunda();
        try {
            System.out.println("SEGUNDA EMPRESA"+idEmpresaSegunda);
            Long idSuscripcionAseo = suscripcionDelegado.consultarIdSuscripcionPorConvenio(usuario.getIdSuscripcionAseo().toString(), idEmpresaSegunda);
            detalleRecaudo = new DetalleRecaudoWebDTO();
            detalleRecaudo.setIdRecaudoWeb(recaudoWeb.getIdRecaudoWeb());
            detalleRecaudo.setEstadoPago(EEstado.DetalleRecaudoWeb.Pago.PENDIENTE);
            detalleRecaudo.setEstadoAplicacionPago(EEstado.DetalleRecaudoWeb.Aplicacion.PENDIENTE);
            detalleRecaudo.setIdEmpresa(idEmpresaSegunda);
            detalleRecaudo.setIdSuscripcion(idSuscripcionAseo);
            valor = usuario.getValorAseo() + (double) usuario.getValorAdicionalAseo();
            detalleRecaudo.setValorPago(valor);
            System.out.println("sus aseo " + idSuscripcionAseo + " con empresa " + idEmpresaSegunda + " valor adicional " + usuario.getValorAseo());
            sus_aseo = Integer.parseInt(usuario.getIdSuscripcionAseo().toString());
            System.out.println("se consultara facturas adicionales de aseo " + sus_aseo);
            facturaselecccionadaAseo = this.retornarFacturasjson(recaudoWeb.getTramaPpa_ideregistro(), sus_aseo);
            for (DetalleAplicacionRecaudoDTO detalleAplicacionRecaudoDTO : facturaselecccionadaAseo) {
                System.out.println("facturas json =" + detalleAplicacionRecaudoDTO.getDwra_idfacturas() + " ppa_ideregistro =" + detalleAplicacionRecaudoDTO.getPpa_ideregistro());
            }

//System.out.println("facturas json aseo "+facturaselecccionadaAseo);
//detalleRecaudo.setFacturasAdicionales(facturaselecccionadaAseo);
            detalleRecaudo.setDetalleAplicacionRecaudo(facturaselecccionadaAseo);
            idrecaudo = detalleRecaudoWebDAO.insertarDetalleRecaudo2(detalleRecaudo);

            System.out.println("el id recaudo es " + idrecaudo);

            if (idrecaudo > 0) {
                uni_recaudoA = detalleRecaudoWebDAO.parametro_aplicacion((int) idEmpresaSegunda);
                for (DetalleAplicacionRecaudoDTO detalleAplicacionRecaudoDTO : facturaselecccionadaAseo) {
                    detalleRecaudoWebDAO.insertarDetalleAplicacionRecaudo(detalleAplicacionRecaudoDTO, idrecaudo, uni_recaudoA, sus_aseo);
                }

            }

            // se realizara procesao de aplicar recaudo q  es alimentar rec y actualizar fac y dfac para pagos adicionales sprint 5
        } catch (NegocioExcepcion ex) {
            LogUtil.info(ex.getMensaje());
        }

    }

    private void crearDetalleRecaudoWeb(UsuarioDTO usuario, RecaudoWebDTO recaudoWeb, ConfiguracionDTO configuracionDTO)
            throws PersistenciaExcepcion {
        long idEmpresaPrincipal = configuracionDTO.getEmpresa().getIdEmpresaPrincipal();
        DetalleRecaudoWebDAO detalleRecaudoWebDAO = new DetalleRecaudoWebDAO(cnn);
        DetalleRecaudoWebDTO detalleRecaudo = new DetalleRecaudoWebDTO();
        detalleRecaudo.setIdRecaudoWeb(recaudoWeb.getIdRecaudoWeb());
        detalleRecaudo.setEstadoPago(EEstado.DetalleRecaudoWeb.Pago.PENDIENTE);
        detalleRecaudo.setEstadoAplicacionPago(EEstado.DetalleRecaudoWeb.Aplicacion.PENDIENTE);
        detalleRecaudo.setIdEmpresa(idEmpresaPrincipal);
        detalleRecaudo.setIdSuscripcion(usuario.getIdSuscripcion());
        Double valor = usuario.getValorGas();
        detalleRecaudo.setValorPago(valor);
        detalleRecaudoWebDAO.insertarDetalleRecaudo(detalleRecaudo);
        long idEmpresaSegunda = configuracionDTO.getEmpresa().getIdEmpresaSegunda();
        try {
            Long idSuscripcionAseo = suscripcionDelegado.consultarIdSuscripcionPorConvenio(usuario.getIdSuscripcion().toString(), idEmpresaSegunda);
            detalleRecaudo = new DetalleRecaudoWebDTO();
            detalleRecaudo.setIdRecaudoWeb(recaudoWeb.getIdRecaudoWeb());
            detalleRecaudo.setEstadoPago(EEstado.DetalleRecaudoWeb.Pago.PENDIENTE);
            detalleRecaudo.setEstadoAplicacionPago(EEstado.DetalleRecaudoWeb.Aplicacion.PENDIENTE);
            detalleRecaudo.setIdEmpresa(idEmpresaSegunda);
            detalleRecaudo.setIdSuscripcion(idSuscripcionAseo);
            valor = usuario.getValorAseo();
            detalleRecaudo.setValorPago(valor);
            detalleRecaudoWebDAO.insertarDetalleRecaudo(detalleRecaudo);
        } catch (NegocioExcepcion ex) {
            LogUtil.info(ex.getMensaje());
        }

    }

    /**
     * Se agregan lo campos adicionales que requiere PSE para realizar la
     * transacción
     *
     * @param pagador información de la persona que está pagando, esa
     * información se obtiene del formulario
     * @param usuario información que devuelve la funcion getliq_facturacion_pse
     * @return
     * @throws NegocioExcepcion
     * @throws PersistenciaExcepcion
     */
    private ArrayOfPSEHostingField getCamposAdicionales(PagadorDTO pagador, UsuarioDTO usuario)
            throws NegocioExcepcion, PersistenciaExcepcion {

        ArrayOfPSEHostingField arrayCampos = new ArrayOfPSEHostingField();
        List<PSEHostingField> listaCampos = arrayCampos.getPSEHostingField();

        PSEHostingField campo;

        campo = new PSEHostingField();
        campo.setName("id_cliente");
        campo.setValue(pagador.getIdCliente());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("nombre_cliente");
        campo.setValue(pagador.getNombreCliente() + " " + pagador.getApellidoCliente());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("apellido_cliente");
        campo.setValue(pagador.getApellidoCliente());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("telefono_cliente");
        campo.setValue(pagador.getTelefonoCliente());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("correo_cliente");
        campo.setValue(pagador.getCorreo());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("referencia_pago_llanogas");
        campo.setValue(usuario.getIdSuscripcion());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("valor_pago_llanogas");
        campo.setValue(usuario.getValorGas());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("referencia_pago_bioagricola");
        campo.setValue(usuario.getNumeroFacturaAseo());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("valor_pago_bioagricola");
        campo.setValue(usuario.getValorAseo());
        listaCampos.add(campo);

        return arrayCampos;

    }

    private ArrayOfPSEHostingMemberService getServiciosAdicionales(UsuarioDTO usuario, ConfiguracionDTO configuracion) {
        EmpresaDTO empresa = configuracion.getEmpresa();
        String nitBioAgricola = empresa.getNitEmpresaSegunda();
        DatosPSE datosPSE = configuracion.getDatosPSE();
        ArrayOfPSEHostingMemberService lista = new ArrayOfPSEHostingMemberService();
        List<PSEHostingMemberService> listaServicioMiembro = lista.getPSEHostingMemberService();
        PSEHostingMemberService servicio;

        servicio = new PSEHostingMemberService();
        servicio.setIdentification(nitBioAgricola);
        servicio.setAmount(new BigDecimal(usuario.getValorAseo()));
        servicio.setVATAmount(new BigDecimal(0));
        servicio.setServiceCode(datosPSE.getCodigoSegunda());
        listaServicioMiembro.add(servicio);

        servicio = new PSEHostingMemberService();
        servicio.setIdentification(empresa.getNitEmpresaPrincipal());
        servicio.setAmount(new BigDecimal(usuario.getValorGas()));
        servicio.setVATAmount(new BigDecimal(0));
        servicio.setServiceCode(datosPSE.getCodigoPrincipal());
        listaServicioMiembro.add(servicio);

        return lista;
    }

    private RespuestaDTO<Properties> procesarRespuestaAdicional(PSEHostingCreateTransactionReturn identificador, RecaudoWebDTO recaudoWebDTO,
            UsuarioDTO usuario, ConfiguracionDTO configuracion)
            throws NegocioExcepcion, PersistenciaExcepcion {
        switch (identificador.getReturnCode()) {
            case OK:
                recaudoWebDTO.setEstado(EEstado.RecaudoWeb.PENDIENTE);
                String url = configuracion.getDatosPSE().getUrlBancosPSE() + identificador.getPaymentIdentifier();
                
                System.out.println("URL:"+url);
                /**
                 * Si se crea la transacción en PSE se registra la información
                 * en el detalle de WEB RECAUDO
                 */

                crearDetalleRecaudoWebAdicional(usuario, recaudoWebDTO, configuracion);
                recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.PENDIENTE);
                Properties parametros = new Properties();
                /**
                 * Se devuelve la URL donde se va a redireccionar, en este caso
                 * se hace se redirecciona a la url de bancos de PSE
                 *
                 */
                parametros.put("url", url);
                /**
                 * Se devulve el identificador de la transacción
                 */
                parametros.put("idTransaccion", recaudoWebDTO.getIdRecaudoWeb());
                return new RespuestaDTO<>(EMensajes.Ok)
                        .setDatos(parametros);
            case ERRORS:
                recaudoWebDTO.setEstado(EEstado.RecaudoWeb.ERROR);
                recaudoWebDTO.setMensaje(identificador.getErrorMessage());
                recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);
                throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FATAL.getCodigo(), identificador.getErrorMessage());
            default:
                throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_RESPUESTA_INCOMPLETA);
        }
    }

    /**
     * Procesa la respuesta de PSE
     *
     * @param identificador
     * @param recaudoWebDTO
     * @param usuario
     * @return
     * @throws NegocioExcepcion
     * @throws PersistenciaExcepcion
     */

    private RespuestaDTO<Properties> procesarRespuesta(PSEHostingCreateTransactionReturn identificador, RecaudoWebDTO recaudoWebDTO,
            UsuarioDTO usuario, ConfiguracionDTO configuracion)
            throws NegocioExcepcion, PersistenciaExcepcion {
        switch (identificador.getReturnCode()) {
            case OK:
                recaudoWebDTO.setEstado(EEstado.RecaudoWeb.PENDIENTE);
                String url = configuracion.getDatosPSE().getUrlBancosPSE() + identificador.getPaymentIdentifier();
                /**
                 * Si se crea la transacción en PSE se registra la información
                 * en el detalle de WEB RECAUDO
                 */

                crearDetalleRecaudoWeb(usuario, recaudoWebDTO, configuracion);
                recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.PENDIENTE);
                Properties parametros = new Properties();
                /**
                 * Se devuelve la URL donde se va a redireccionar, en este caso
                 * se hace se redirecciona a la url de bancos de PSE
                 *
                 */
                parametros.put("url", url);
                /**
                 * Se devulve el identificador de la transacción
                 */
                parametros.put("idTransaccion", recaudoWebDTO.getIdRecaudoWeb());
                return new RespuestaDTO<>(EMensajes.Ok)
                        .setDatos(parametros);
            case ERRORS:
                recaudoWebDTO.setEstado(EEstado.RecaudoWeb.ERROR);
                recaudoWebDTO.setMensaje(identificador.getErrorMessage());
                recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);
                throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FATAL.getCodigo(), identificador.getErrorMessage());
            default:
                throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_RESPUESTA_INCOMPLETA);
        }
    }

    /**
     * Verifica el estado de una transacción en PSE
     *
     * @param paymentId id de la transacción
     * @param configuracionDTO información de la parametrización de la empresa
     * principal
     * @return
     */
    public RespuestaDTO getTransactionInformationHosting(String paymentId, ConfiguracionDTO configuracionDTO) {
        PSEHostingTransactionInformationReturn informacion = ServicioPSE.getTransactionInformationHosting(paymentId, configuracionDTO);
        LogUtil.info(new Gson().toJson(informacion));
        return new RespuestaDTO(EMensajes.Ok);
    }

    /**
     * Verifica que después que PSE responde se valida la información de la
     * transacción en la plataforma de PSE
     *
     * @param paymentId Identificador de la transacción
     * @return
     */
    public RespuestaDTO confirmarPago(String paymentId) {
        try {
            Long id = Long.parseLong(paymentId);
            ProcesoVerificacionPSE proceso = ProcesoVerificacionPSE.getInstancia();
            RecaudoWebDTO recaudo = new RecaudoWebDelegado(cnn).consultar(id);
            proceso.procesarRegistro(cnn, recaudo);
            return new RespuestaDTO(EMensajes.Ok);
        } catch (NegocioExcepcion | PersistenciaExcepcion ex) {
            Logger.getLogger(PSEDelegado.class.getName()).log(Level.SEVERE, null, ex);
            return new RespuestaDTO(EMensajes.ERROR_NEGOCIO_FATAL);
        }
    }

    private RecaudoWebLogDTO guardarLog(RecaudoWebDTO recaudoWebDTO, Connection cnn)
            throws PersistenciaExcepcion {
        RecaudoWebLogDTO recaudoWebLogDTO = new RecaudoWebLogDTO();
        recaudoWebLogDTO.setIdRecaudoWeb(recaudoWebDTO.getIdRecaudoWeb());
        new RecaudoWebLogDAO(cnn).insertarRecaudoLog(recaudoWebLogDTO);
        ConexionBD.commit(cnn);
        return recaudoWebLogDTO;
    }

    private void actualizarLog(String respuesta, RecaudoWebDTO recaudoWebDTO, Connection cnn) {
        try {
            RecaudoWebLogDTO recaudoWebLogDTO = new RecaudoWebLogDTO();
            recaudoWebLogDTO.setIdRecaudoWeb(recaudoWebDTO.getIdRecaudoWeb());
            recaudoWebLogDTO.setRespuesta(respuesta);
            new RecaudoWebLogDAO(cnn).actualizarRecaudoLog(recaudoWebLogDTO);
            ConexionBD.commit(cnn);
        } catch (PersistenciaExcepcion ex) {
            LogUtil.error(ex);
            ConexionBD.rollbackSinError(cnn);
        }
    }

    private void setDatosPSE(RecaudoWebDTO recaudo, ConfiguracionDTO configuracion) {
        DatosPSE datosPSE = configuracion.getDatosPSE();
        recaudo.setPaymentDescription(datosPSE.getMessage());
        recaudo.setTicketOfficeId(configuracion.getDatosPSE().getTicketOfficeId());
        recaudo.setServiceCode(datosPSE.getServiceCode());
        long idMedio = configuracion.getRecaudo().getMedio();
        recaudo.setMedioPago(idMedio);
    }

    public RespuestaDTO createTransactionPaymentHostingCusiana(String codigoCliente,
            PagadorDTO pagador,
            int idEmpresaRecaudadora)
            throws AplicacionExcepcion {
        ConfiguracionDTO configuracion = ServletGenerico.LISTA_CONFIGURACION.get(idEmpresaRecaudadora);
        if (configuracion == null) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CONFIGURACION, "" + idEmpresaRecaudadora);
        }
        RecaudoWebDTO recaudoWebDTO = new RecaudoWebDTO();
        recaudoWebDTO.setEmail(pagador.getCorreo());
        recaudoWebDTO.setEstado(EEstado.RecaudoWeb.PENDIENTE);
        String respuesta = "";
        try {
            UsuarioDTO usuario = suscripcionDelegado.consultarPagoPSE(codigoCliente, idEmpresaRecaudadora);
            recaudoWebDTO.setValorPagoTotal(usuario.getValorGas());
            setReferencia(recaudoWebDTO, pagador);
            setDatosPSE(recaudoWebDTO, configuracion);
            recaudoWebDTO.setCamposPagador(new Gson().toJson(pagador));

            recaudoWebDelegado.insertarRecaudoWeb(recaudoWebDTO);
            ConexionBD.commit(cnn);

            guardarLog(recaudoWebDTO, cnn);
            /**
             * Clases que provee el webservices de PSE de acuerdo al WSDL
             * otorgado
             */
            ArrayOfPSEHostingField fields = getCamposAdicionalesCusiana(pagador, usuario);
            PSEHostingCreateTransactionReturn identificador = ServicioPSE.createTransactionPaymentHosting(configuracion, recaudoWebDTO, pagador.getIp(), fields);
            RespuestaDTO respuestaDTO = procesarRespuesta(identificador, recaudoWebDTO, usuario, configuracion);
            respuesta = new Gson().toJson(respuestaDTO);
            return respuestaDTO;
        } catch (PersistenciaExcepcion | NegocioExcepcion e) {
            LogUtil.error(e);
            respuesta = LogUtil.getTraza(e);
            throw e;
        } catch (Exception e) {
            LogUtil.error(e);
            respuesta = LogUtil.getTraza(e);
            recaudoWebDTO.setMensaje(e.getMessage());
            recaudoWebDTO.setEstado(EEstado.RecaudoWeb.ERROR);
            recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_PETICION);
        } finally {
            actualizarLog(respuesta, recaudoWebDTO, cnn);
        }
    }

    /**
     * Se agregan lo campos adicionales que requiere PSE para realizar la
     * transacción
     *
     * @param pagador información de la persona que está pagando, esa
     * información se obtiene del formulario
     * @param usuario información que devuelve la funcion getliq_facturacion_pse
     * @return
     * @throws NegocioExcepcion
     * @throws PersistenciaExcepcion
     */
    private ArrayOfPSEHostingField getCamposAdicionalesCusiana(PagadorDTO pagador, UsuarioDTO usuario)
            throws NegocioExcepcion, PersistenciaExcepcion {

        ArrayOfPSEHostingField arrayCampos = new ArrayOfPSEHostingField();
        List<PSEHostingField> listaCampos = arrayCampos.getPSEHostingField();

        PSEHostingField campo;

        campo = new PSEHostingField();
        campo.setName("id_cliente");
        campo.setValue(pagador.getIdCliente());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("nombre_cliente");
        campo.setValue(pagador.getNombreCliente() + " " + pagador.getApellidoCliente());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("apellido_cliente");
        campo.setValue(pagador.getApellidoCliente());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("telefono_cliente");
        campo.setValue(pagador.getTelefonoCliente());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("correo_cliente");
        campo.setValue(pagador.getCorreo());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("referencia_pago_cusianagas");
        campo.setValue(usuario.getIdSuscripcion());
        listaCampos.add(campo);

        campo = new PSEHostingField();
        campo.setName("valor_pago_cusianagas");
        campo.setValue(usuario.getValorGas());
        listaCampos.add(campo);

        return arrayCampos;
    }

    public ArrayList<DetalleAplicacionRecaudoDTO> retornarFacturasjson(String trama, int suscriptor) throws PersistenciaExcepcion {
        ArrayList<String> facturas = new ArrayList<>();
        ArrayList<DetalleAplicacionRecaudoDTO> respuesta = new ArrayList<>();
        DetalleAplicacionRecaudoDTO objectdto = new DetalleAplicacionRecaudoDTO();
        System.out.println("trama recibida del id ppa_ideregistro " + trama + " y suscriptor " + suscriptor);
        ArrayList<DetalleAplicacionRecaudoDTO[]> facturasFinal = new ArrayList<>();
        ArrayList<DetalleAplicacionRecaudoDTO> facturaseleccionada = new ArrayList<>();
        List<String> idnum = new ArrayList();
        String[] tramaArray = trama.split(",");
        System.out.println("imprimiendo arreglo..............");
        for (String id : tramaArray) {

            if (!id.isEmpty()) {
                System.out.println("id ppa_ideregistro recibido =" + id);

                idnum.add(id);
            }
        }

        for (String id : idnum) {
            System.out.println("se consulta facturas con id " + id + " y suscriptor" + suscriptor);
            objectdto = recaudoWebDelegado.obtenerFacturasSeleccionadas(id, suscriptor);

            if (objectdto.getDwra_idfacturas() != null && objectdto.getPpa_ideregistro() != 0) {
                facturaseleccionada.add(objectdto);
            }

        }

        return facturaseleccionada;
    }

}
