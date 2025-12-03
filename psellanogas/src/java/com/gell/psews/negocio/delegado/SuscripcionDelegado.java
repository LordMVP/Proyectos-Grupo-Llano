/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.delegado;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.servlet.ServletGenerico;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.dao.FacturaDAO;
import com.gell.psews.persistencia.dao.SuscripcionDAO;
import com.gell.psews.persistencia.dto.CicloDTO;
import com.gell.psews.persistencia.dto.RespuestaDTO;
import com.gell.psews.persistencia.dto.SuscripcionDTO;
import com.gell.psews.persistencia.dto.UsuarioDTO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import com.gell.psews.persistencia.dto.PagoAdicionalDTO;

/**
 *
 * @author lrey
 */
public class SuscripcionDelegado {

    private final Connection cnn;
    private final SuscripcionDAO suscripcionDAO;

    public SuscripcionDelegado(Connection cnn) {
        this.cnn = cnn;
        suscripcionDAO = new SuscripcionDAO(cnn);
    }

    /**
     * Consulta la información del estado del pago
     *
     * @param codigo idsuscripcion o codigoanterior
     * @param idEmpresaRecaudadora identificador de la empresa recaudadora
     * Llanogas o Cusiana
     * @return
     * @throws NegocioExcepcion Factura sin saldo o usuario no encontrado
     * @throws PersistenciaExcepcion Error al ejecutar la consulta
     */
    public RespuestaDTO<UsuarioDTO> consultarPago(String codigo, int idEmpresaRecaudadora)
            throws AplicacionExcepcion {
        Long idSuscripcionGas = consultarIdSuscripcionPorConvenio(codigo, idEmpresaRecaudadora);
        UsuarioDTO usuarioDTO = suscripcionDAO.consultarPago(idSuscripcionGas.toString(), idEmpresaRecaudadora);

        if (usuarioDTO.getValorGas() < 0) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_SIN_SALDO);
        }

        if (usuarioDTO.getFechaVencimiento() == null) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_SIN_FECHA);
        }

        Double saldoFactura = new FacturaDAO(cnn).consultarSaldoFacturas(new Long[]{usuarioDTO.getIdSuscripcion(), usuarioDTO.getIdSuscripcionAseo()});
        if (saldoFactura < 0) { // if (saldoFactura <= 0) ORIGINAL
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_SIN_SALDO);
        }

        /* if (usuarioDTO.getFechaVencimiento().before(FechaUtil.getFechaActual())) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_VENCIDA);
        }*/
        this.validaSuscripcionesConvenio(usuarioDTO.getIdSuscripcionAseo());
        return new RespuestaDTO<>(EMensajes.Ok)
                .setDatos(usuarioDTO);
    }

    public RespuestaDTO<UsuarioDTO> consultarPagoConPagoAdicional(String codigo, int idEmpresaRecaudadora)
            throws AplicacionExcepcion {
        Long idSuscripcionGas = consultarIdSuscripcionPorConvenio(codigo, idEmpresaRecaudadora);
        UsuarioDTO usuarioDTO = suscripcionDAO.consultarPago(idSuscripcionGas.toString(), idEmpresaRecaudadora);
        ConfiguracionDTO configuracion = ServletGenerico.LISTA_CONFIGURACION.get(idEmpresaRecaudadora);
        //gas
        long idEmpresaPrincipal = configuracion.getEmpresa().getIdEmpresaPrincipal();
        //aseo
        long idEmpresaSegundaria = configuracion.getEmpresa().getIdEmpresaSegunda();
        
        if (usuarioDTO.getValorGas() < 0) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_SIN_SALDO);
        }

        if (usuarioDTO.getFechaVencimiento() == null) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_SIN_FECHA);
        }
        System.out.println("RECAUDO --->");
        Double saldoFactura = new FacturaDAO(cnn).consultarSaldoFacturas(new Long[]{usuarioDTO.getIdSuscripcion(), usuarioDTO.getIdSuscripcionAseo()});
        System.out.println("saldo Fac:"+saldoFactura);
        if (saldoFactura < 0) { //if (saldoFactura <= 0) ORIGINAL
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_SIN_SALDO);
        }
        this.validaSuscripcionesConvenio(usuarioDTO.getIdSuscripcionAseo());// Modifica Usuario usuarioDTO.getIdSuscripcion()
        ArrayList<PagoAdicionalDTO> pagoAdicional = new ArrayList<>();
        ArrayList<PagoAdicionalDTO> pagoAdicional2 = new ArrayList<>();
        ArrayList<PagoAdicionalDTO> pagoAdicional21 = new ArrayList<>();

        ArrayList<PagoAdicionalDTO> pagoAdicional3 = new ArrayList<>();

        LogUtil.error("imprime valor :"+usuarioDTO.getValorAseo().toString());
        if (usuarioDTO.getIdSuscripcionAseo() != null) {
            //suscripcionDAO.pagoAdicional(Integer.parseInt(usuarioDTO.getIdSuscripcionAseo().toString()));
            pagoAdicional = suscripcionDAO.llamarCarteraG(Integer.parseInt(usuarioDTO.getIdSuscripcionAseo().toString()), 1);
            LogUtil.error("PagoaDICIONAL"+pagoAdicional.get(0).getSaldo());
        }

        // servicio especial aseo
        System.out.println("empresa de aseo " + idEmpresaSegundaria + " suscripcionId " + usuarioDTO.getIdSuscripcionAseo());
        System.out.println("empresa de gas " + idEmpresaPrincipal + " suscripcionId " + usuarioDTO.getIdSuscripcion());

        if (usuarioDTO.getIdSuscripcionAseo() != null) {
            pagoAdicional2 = suscripcionDAO.llamarServicioEspecial(Integer.parseInt(usuarioDTO.getIdSuscripcionAseo().toString()), (int) idEmpresaSegundaria, (int) idEmpresaPrincipal, (int) idEmpresaSegundaria);
        }

        if (usuarioDTO.getIdSuscripcion() != null) {
            pagoAdicional21 = suscripcionDAO.llamarServicioEspecial(Integer.parseInt(usuarioDTO.getIdSuscripcion().toString()), (int) idEmpresaSegundaria, (int) idEmpresaPrincipal, (int) idEmpresaPrincipal);
        }

        for (PagoAdicionalDTO pagoAdicionalDTO : pagoAdicional21) {
            pagoAdicional3.add(pagoAdicionalDTO);
        }

        for (PagoAdicionalDTO pagoAdicionalDTO : pagoAdicional) {
            pagoAdicional3.add(pagoAdicionalDTO);
        }

        for (PagoAdicionalDTO pagoAdicionalDTO : pagoAdicional2) {
            pagoAdicional3.add(pagoAdicionalDTO);
        }

        System.out.println("imprimiendo todas las facturas seleccionados de los pagos adicionales");
        if (pagoAdicional3.isEmpty() || pagoAdicional3 != null || pagoAdicional3.size() != 0) {

            System.out.println("PAGO ADICIONAL:"+pagoAdicional3.size());

            for (PagoAdicionalDTO pagoAdicionalDTO : pagoAdicional3) {
                System.out.println(pagoAdicionalDTO.getFacturas());

            }

        }

        LogUtil.error("Usuario:"+usuarioDTO.getValorAseo()+" -- "+usuarioDTO.getNumeroFacturaAseo());
        usuarioDTO.setPagoAdicional(pagoAdicional3);
        return new RespuestaDTO<>(EMensajes.Ok)
                .setDatos(usuarioDTO);
    }

    /**
     * Se consultan las suscripcion dependiendo de la empresa
     *
     * @param codigo codigo anterior y/o id suscripción
     * @param idEmpresa
     * @return id suscripcion
     * @throws com.gell.psews.persistencia.exception.PersistenciaExcepcion
     * @throws com.gell.psews.negocio.excepcion.NegocioExcepcion
     *
     */
    public Long consultarIdSuscripcionPorConvenio(String codigo, long idEmpresa)
            throws PersistenciaExcepcion, NegocioExcepcion {
        return suscripcionDAO.consultarIDSuscripcion(codigo, idEmpresa);
    }

    public UsuarioDTO consultarPagoPSE(String codigo, int idEmpresaRecaudadora)
            throws AplicacionExcepcion {
        return consultarPago(codigo, idEmpresaRecaudadora).getDatos();
    }

    public UsuarioDTO consultarPagoPSEConadicional(String codigo, int idEmpresaRecaudadora)
            throws AplicacionExcepcion {
        return consultarPagoConPagoAdicional(codigo, idEmpresaRecaudadora).getDatos();
    }

    public List<SuscripcionDTO> getSuscripcionesConvenio(Long idSuscripcion)
            throws NegocioExcepcion, PersistenciaExcepcion {
        List<SuscripcionDTO> listaSuscripciones = suscripcionDAO.consultarSuscripcionesConvenio(idSuscripcion);
        if (listaSuscripciones.isEmpty()) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_SUSCRIPCION_NO_ENCONTRADA);
        }
        return listaSuscripciones;
    }

    /**
     * Consulta todas las suscripciones asociadas a un convenio y adicionalmente
     * recorre todas las suscripciones para verificar la consistencia de las
     * facturas. Las suscripciones la devuelven de acuerdo al convenio
     *
     * @param idSuscripcion Suscripción de llanogas
     * @return lista de sucripciones asociadas al convenio de la suscripción
     * @throws NegocioExcepcion Inconsistencia de la información de las facturas
     * @throws PersistenciaExcepcion Error al ejecutar la sentencia SQL
     */
    public List<SuscripcionDTO> validaSuscripcionesConvenio(Long idSuscripcion)
            throws NegocioExcepcion, PersistenciaExcepcion {
        LogUtil.error("Llegando:"+idSuscripcion);
        List<SuscripcionDTO> listaSuscripciones = suscripcionDAO.consultarSuscripcionesConvenio(idSuscripcion);
        if (listaSuscripciones.isEmpty()) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_SUSCRIPCION_NO_ENCONTRADA);
        }
        /**
         * Se valida si la suscripción tiene transacciones pendientes o que la
         * aplicación del pago en ACHAGUA esté pendiente
         */
        int cantidadTransacciones = new RecaudoWebDelegado(cnn).consultarCantidadTransaccionesPendientes(idSuscripcion);
        if (cantidadTransacciones > 0) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_TRANSACCION_PENDIENTE);
        }
        /**
         * Se realiza validación que el encabezado y el detalle de la factura
         * estén consistente
         */
        Long[] idsSuscripciones = consultarIdsSuscripciones(listaSuscripciones);
        FacturaDAO facturaDAO = new FacturaDAO(cnn);
        facturaDAO.consultarConsistenciaFactura(idsSuscripciones);

        return listaSuscripciones;
    }

    public static Long[] consultarIdsSuscripciones(List<SuscripcionDTO> listaSuscripciones) {
        Long[] listaIdsSuscripciones = new Long[listaSuscripciones.size()];
        for (int i = 0; i < listaSuscripciones.size(); i++) {
            listaIdsSuscripciones[i] = listaSuscripciones.get(i).getIdSuscripcion();
        }
        return listaIdsSuscripciones;
    }

    /**
     * Consulta la información del ciclo y periodo actual
     *
     * @param idSuscripcion identificador de la suscripción
     * @return Información del ciclo periodo
     * @throws NegocioExcepcion No se encontró el ciclo
     * @throws PersistenciaExcepcion Error al ejecutar la sentencia
     */
    public CicloDTO consultarCiclo(Long idSuscripcion)
            throws NegocioExcepcion, PersistenciaExcepcion {
        return suscripcionDAO.consultarCiclo(idSuscripcion);
    }

    /**
     * Devuelve todas las suscripciones a las que pertenece un mismo recaudo
     *
     * NOTA: Se valida la prioridad de pago si es diferente de nulo significa
     * que hacen parte del mismo recaudo de lo contrario se debe hacer un
     * recaudo por cada empresa
     *
     * @param lista Listado de las suscripciones
     * @param configuracion configuración de la empresa recaudadora (Llanogas o
     * cusianagas)
     * @return
     */
    public List<SuscripcionDTO> consultarSuscripcionesPagoGas(List<SuscripcionDTO> lista, ConfiguracionDTO configuracion) {
        List<SuscripcionDTO> listaSuscripcion = new ArrayList();
        for (SuscripcionDTO suscripcion : lista) {
            if (suscripcion.getIdEmpresa() != configuracion.getEmpresa().getIdEmpresaSegunda()) {
                listaSuscripcion.add(suscripcion);
            }
        }
        return listaSuscripcion;
    }

    /**
     *
     * Consulta las suscripciones de una empresa en específico
     *
     * @param lista Lista de todas las suscripciones que pertenecen al convenio
     * @param idEmpresa
     * @return Devuelve la lista de las suscripciones que no tiene prioridad de
     * pago que significa que no tiene que estar en el mismo recaudo
     */
    public List<SuscripcionDTO> consultarSuscripcionesEmpresa(List<SuscripcionDTO> lista, int idEmpresa) {
        List<SuscripcionDTO> listaSuscripcion = new ArrayList();
        for (SuscripcionDTO suscripcion : lista) {
            if (suscripcion.getIdEmpresa() == idEmpresa) {
                listaSuscripcion.add(suscripcion);
            }
        }
        return listaSuscripcion;
    }

    public RespuestaDTO<String> consultarAutorizacionTratamientoDatos(ConfiguracionDTO configuracion)
            throws NegocioExcepcion, PersistenciaExcepcion {
        return new RespuestaDTO<>(EMensajes.Ok).setDatos(configuracion.getEmpresa().getUrlHabeasData());
    }

    public RespuestaDTO<String> consultarPoliticaTratamientoDatos(ConfiguracionDTO configuracion)
            throws NegocioExcepcion, PersistenciaExcepcion {
        return new RespuestaDTO<>(EMensajes.Ok).setDatos(configuracion.getEmpresa().getUrlPoliticaHabeas());
    }

}
