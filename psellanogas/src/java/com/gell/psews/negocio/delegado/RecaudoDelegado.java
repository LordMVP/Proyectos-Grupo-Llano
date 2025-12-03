/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.delegado;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.constantes.ETipoRecaudo;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.dao.RecaudoDAO;
import com.gell.psews.persistencia.dto.CicloDTO;
import com.gell.psews.persistencia.dto.DetalleFacturaDTO;
import com.gell.psews.persistencia.dto.DetalleRecaudoDTO;
import com.gell.psews.persistencia.dto.DistribucionRecaudoDTO;
import com.gell.psews.persistencia.dto.FacturaDTO;
import com.gell.psews.persistencia.dto.InfoRecaudoDTO;
import com.gell.psews.persistencia.dto.RecaudoDTO;
import com.gell.psews.persistencia.dto.RecaudoWebDTO;
import com.gell.psews.persistencia.dto.SuscripcionDTO;
import com.gell.psews.persistencia.dto.UsuarioDTO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.persistencia.dto.pse.EmpresaDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Clase encargada de Gestionar y aplicar el recaudo
 *
 * @author lrey
 */
public class RecaudoDelegado {

    private final SuscripcionDelegado suscripcionDelegado;
    private final FacturaDelegado facturaDelegado;
    private final UsuarioDTO usuario;
    private final RecaudoDAO recaudoDAO;
    private final CicloDTO ciclo;
    private final ConfiguracionDTO configuracion;

    private Double valorRecaudosAplicados = 0D;
    private Double saldoRecaudo = 0D;
    private final RecaudoWebDTO recaudoWeb;

    public RecaudoDelegado(Connection cnn, UsuarioDTO usuario, ConfiguracionDTO configuracion, RecaudoWebDTO recaudoWeb)
            throws NegocioExcepcion, PersistenciaExcepcion {
        this.suscripcionDelegado = new SuscripcionDelegado(cnn);
        this.facturaDelegado = new FacturaDelegado(cnn);
        this.usuario = usuario;
        this.recaudoDAO = new RecaudoDAO(cnn);
        this.ciclo = suscripcionDelegado.consultarCiclo(usuario.getIdSuscripcion());
        this.configuracion = configuracion;
        this.recaudoWeb = recaudoWeb;
    }

    /**
     * Método encargado de procesar el pago de acuerdo a la empresa
     *
     * @throws PersistenciaExcepcion
     * @throws NegocioExcepcion
     */
    public void aplicarRecaudo()
            throws PersistenciaExcepcion, NegocioExcepcion {
        EmpresaDTO empresa = configuracion.getEmpresa();
        List<SuscripcionDTO> listaSuscripciones = suscripcionDelegado.getSuscripcionesConvenio(usuario.getIdSuscripcion());
                
        List<SuscripcionDTO> listaPago = suscripcionDelegado.consultarSuscripcionesPagoGas(listaSuscripciones, configuracion);
        procesarRecaudoConvenioGas(listaPago);
        
        /**
         * Si la lista de pago está vacía significa que el convenio no tiene
         * prioridad de pago y se pasa a procesar las suscripciones por empresa
         */
        if (listaPago.isEmpty()) {
            List<SuscripcionDTO> listaGas = suscripcionDelegado.consultarSuscripcionesEmpresa(listaSuscripciones, empresa.getIdEmpresaSegunda());
            procesarRecaudoIndependiente(listaGas, usuario.getValorGas(), empresa.getIdEmpresaPrincipal());
        }
        List<SuscripcionDTO> listaAseo = suscripcionDelegado.consultarSuscripcionesEmpresa(listaSuscripciones, empresa.getIdEmpresaSegunda());
        crearRecaudoConvenioAseo(listaAseo);
    }

    /**
     * Procesa el pago para la empresa de Bioagrícola
     *
     * @param listaSuscripciones
     * @throws PersistenciaExcepcion
     * @throws NegocioExcepcion
     */
    private void crearRecaudoConvenioAseo(List<SuscripcionDTO> listaSuscripciones)
            throws PersistenciaExcepcion, NegocioExcepcion {
        if (listaSuscripciones.isEmpty()) {
            return;
        }
        procesarRecaudoIndependiente(listaSuscripciones, usuario.getValorAseo(), configuracion.getEmpresa().getIdEmpresaSegunda());
    }

    /**
     * Procesa el pago para la empresa de GAS
     *
     * @param listaSuscripciones
     * @throws PersistenciaExcepcion
     * @throws NegocioExcepcion
     */
    private void procesarRecaudoConvenioGas(List<SuscripcionDTO> listaSuscripciones)
            throws PersistenciaExcepcion, NegocioExcepcion {
        if (listaSuscripciones.isEmpty()) {
            return;
        }
        saldoRecaudo = usuario.getValorGas();
        Long[] idsSuscripciones = SuscripcionDelegado.consultarIdsSuscripciones(listaSuscripciones);
        Double saldo = facturaDelegado.consultarSaldoFacturas(idsSuscripciones);
        /**
         * Se valida que el saldo de las facturas sean 0 y el saldo del recaudo
         * sea mayor a 0 y se procese a generar un anticipo
         */
        if (saldo == 0 && saldoRecaudo > 0) {
            procesarAnticipo(configuracion.getEmpresa().getIdEmpresaPrincipal(), saldo);
            return;
        }
        String tipoRecaudo = obtenerTipoRecaudo(saldo, usuario.getValorGas());
        /**
         * Si el tipo de recaudo es PAGO se procesa todas las suscripciones del
         * convenio
         */
        if (tipoRecaudo.equalsIgnoreCase(ETipoRecaudo.PAGO)) {
            procesarPagoGas(tipoRecaudo, listaSuscripciones, saldo);
            return;
        }
        /**
         * Si el tipo de recaudo es un abono se insertan recaudos diferentes por
         * cada suscripción
         */
        procesarRecaudoIndependiente(listaSuscripciones, usuario.getValorGas(), configuracion.getEmpresa().getIdEmpresaPrincipal());
    }

    /**
     * REgistra el pago en las diferentes tablas del recaudo
     *
     * @param tipoRecaudo
     * @param listaSuscripciones
     * @throws PersistenciaExcepcion
     * @throws NegocioExcepcion
     */
    private void procesarPagoGas(String tipoRecaudo, List<SuscripcionDTO> listaSuscripciones, Double valorRecaudoSuscripcion)
            throws PersistenciaExcepcion, NegocioExcepcion {
        if (usuario.getValorGas() <= 0) {
            return;
        }
        SuscripcionDTO suscripcionInicial = listaSuscripciones.get(0);
        InfoRecaudoDTO info = new InfoRecaudoDTO();
        info.setSuscripcion(suscripcionInicial);
        info.setIdConvenio(suscripcionInicial.getIdConvenio());
        info.setIdEmpresaRecaudadora(configuracion.getEmpresa().getIdEmpresaPrincipal());
        info.setTipoRecaudo(tipoRecaudo);
        info.setValor(valorRecaudoSuscripcion);
        RecaudoDTO recaudo = crearRecaudo(info);
        Double saldoSuscripcionAdicional = facturaDelegado.consultarSaldoFacturasAdicional(Integer.parseInt(usuario.getIdSuscripcion().toString()));
        System.out.println("El saldo adicional por pago adicional es " + saldoSuscripcionAdicional);

        for (SuscripcionDTO suscripcion : listaSuscripciones) {

            System.out.println("proceso gas idsuscriptor ......." + suscripcion.getIdSuscripcion());
            Double saldoSuscripcion = facturaDelegado.consultarSaldoFacturas(new Long[]{suscripcion.getIdSuscripcion()});
            System.out.println("Saldo = ......." + saldoSuscripcion);

            saldoSuscripcion = saldoSuscripcion + saldoSuscripcionAdicional;

            if (saldoSuscripcion == 0) {
                continue;
            }
            DistribucionRecaudoDTO distribucion = new DistribucionRecaudoDTO();
            distribucion.setValorRecaudo(saldoSuscripcion);
            distribucion.setSaldoRecaudo(0D);
            distribucion.setValorRecaudoAdicional(0D);
            distribucion.setSaldoRecaudoAdicional(0D);
            distribuirRecaudo(recaudo, suscripcion, distribucion);
            crearDetalleRecaudo(distribucion);

            facturaDelegado.estadodwra(Integer.parseInt(suscripcion.getIdSuscripcion().toString()));

        }
        procesarAnticipo(configuracion.getEmpresa().getIdEmpresaPrincipal(), saldoRecaudo);

    }

    private void procesarRecaudoIndependiente(List<SuscripcionDTO> listaSuscripciones, Double valorRecaudo, Integer idEmpresaRecaudadora)
            throws PersistenciaExcepcion, NegocioExcepcion {

        saldoRecaudo = valorRecaudo;
        valorRecaudosAplicados = 0D;
        Double saldoFacturas = 0D; 
        
        for (SuscripcionDTO suscripcion : listaSuscripciones) {
            if (saldoRecaudo <= 0) {
                break;
            }            
            System.out.println("proceso independiente idsuscriptor ......." + suscripcion.getIdSuscripcion());
            Double saldo = facturaDelegado.consultarSaldoFacturas(new Long[]{suscripcion.getIdSuscripcion()});
            Double saldotmp=saldo;//TEMPORAL
            System.out.println("Saldo = ......." + saldo + " Empresa "+idEmpresaRecaudadora);
            
            //Double saldoAdicional = facturaDelegado.consultarSaldoFacturasAdicional(Integer.parseInt(usuario.getIdSuscripcion().toString())); ORIGINAL
            Double saldoAdicional = facturaDelegado.consultarSaldoFacturasAdicional(suscripcion.getIdSuscripcion().intValue());
            System.out.println("El saldo adicional por pago adicional es " + saldoAdicional );

            saldo = saldo + saldoAdicional;
            
            String tipoRecaudo = obtenerTipoRecaudo(saldo, saldoRecaudo);
            Double valorRecaudoSuscripcion = (saldo > saldoRecaudo) ? saldoRecaudo : saldo;
            /**
             * Se valida si el usuario ya no tiene facturas con saldo y se
             * continua con el otro usuario
             */
            if (valorRecaudoSuscripcion <= 0 && saldoAdicional <= 0) {
                continue;
            }
            
            System.out.println("valor saldo adicional"+saldoAdicional + "emp:"+idEmpresaRecaudadora+  "conv"+suscripcion.getIdConvenio());
            InfoRecaudoDTO info = new InfoRecaudoDTO();
            info.setSuscripcion(suscripcion);
            info.setIdConvenio(suscripcion.getIdConvenio());
            info.setIdEmpresaRecaudadora(idEmpresaRecaudadora);
            info.setTipoRecaudo(tipoRecaudo);
            info.setValor(valorRecaudoSuscripcion);
            RecaudoDTO recaudoDTO = crearRecaudo(info);
            DistribucionRecaudoDTO distribucionRecaudoDTO = new DistribucionRecaudoDTO();
            distribucionRecaudoDTO.setValorRecaudo(valorRecaudoSuscripcion); 
            distribucionRecaudoDTO.setValorRecaudoAdicional(saldoAdicional);
            distribucionRecaudoDTO.setSaldoRecaudo(0D); 
            distribucionRecaudoDTO.setSaldoRecaudoAdicional(0D);
            distribuirRecaudo(recaudoDTO, suscripcion, distribucionRecaudoDTO);
            crearDetalleRecaudo(distribucionRecaudoDTO);
            saldoFacturas += saldo;
            facturaDelegado.estadodwra(Integer.parseInt(suscripcion.getIdSuscripcion().toString()));
        }
        if (saldoRecaudo <= 0 && valorRecaudo - valorRecaudosAplicados ==0 ) {
            return;
        }
        /*
        Se adiciona este control toda vez que si por alguna razon el valor recaudado de Bioagricola queda con saldo de recaudo pendiente por aplicar 
        este pueda ser procesado como anticipo ,para lo cual se obtiene evaluando si la empresa recaudadora conincide con la empresa del convenio de PSE de homologacion en 
        este caso la empresa Segunda es la empresa de aseo , el saldoRecaudo se reconstruye toda vez que este se pierde porque dentro de la creacación de la aplicacion del recaudo 
        este toma el valor que se crea para la distribucion que tiende a ser el saldo de las facturas y en esta instancia despues de aplicarse si no surgieron notas que modifiquen el saldo 
        de las facturas este valor se vuelve 0 , pero no necesariamente este valor es el que se recaudo originalmente y refleja el saldo que haya quedo del pago despues de ser aplicado .
           
        */
        if ( idEmpresaRecaudadora == configuracion.getEmpresa().getIdEmpresaSegunda())
           saldoRecaudo = valorRecaudo - valorRecaudosAplicados ; 
        
        procesarAnticipo(idEmpresaRecaudadora, saldoFacturas);
    }

    private void distribuirRecaudo(RecaudoDTO recaudo, SuscripcionDTO suscripcion, DistribucionRecaudoDTO distribucion) {
        distribucion.setRecaudo(recaudo);
        distribucion.setIdDistribucionConvenio(suscripcion.getIdDistribucionConvenio());
        distribucion.setIdSuscripcion(suscripcion.getIdSuscripcion());
        distribucion.setIdPeriodo(ciclo.getIdPeriodo());
        distribucion.setIdCiclo(ciclo.getIdCiclo());
        distribucion.setIdEmpresa(suscripcion.getIdEmpresa());
        distribucion.setAnio(ciclo.getAnio());
        long idUsuario = configuracion.getRecaudo().getUsuario();
        distribucion.setIdUsuario(idUsuario);
        distribucion.setVersion(1);

        recaudoDAO.insertarDistribucion(distribucion);

    }

    private String obtenerTipoRecaudo(Double saldo, Double valorRecaudo) {
        if (saldo <= valorRecaudo) {
            return ETipoRecaudo.PAGO;
        }
        return ETipoRecaudo.ABONO;
    }

    private String obtenerTipoAnticipo(Double saldoFacturas) {
        if (saldoFacturas == 0 && valorRecaudosAplicados == 0) {
            return ETipoRecaudo.ANTICIPO_PAGO_DOBLE;
        }
        return ETipoRecaudo.ANTICIPO_SALDO;
    }

    /**
     *
     * @param info
     * @return
     * @throws PersistenciaExcepcion
     * @throws NegocioExcepcion
     */
    private RecaudoDTO crearRecaudo(InfoRecaudoDTO info)
            throws PersistenciaExcepcion, NegocioExcepcion {
        com.gell.psews.persistencia.dto.pse.InfoRecaudoDTO infoRecaudo = configuracion.getRecaudo();
        String estado = info.getEstado() == null ? "A" : info.getEstado();
        Integer idEmpresaRecaudadora = info.getIdEmpresaRecaudadora();
        SuscripcionDTO suscripcion = info.getSuscripcion();
        /**
         * Se consulta el documento y el tipo de documento apartir de la
         * suscripción y tipo de recaudo (Abono,Pago,Anticipo,Anticipo saldo a
         * favor,Anticipo pago doble)
         */
        Long idDocumento = consultarDocumentoRecaudo(info.getTipoRecaudo(), info.getSuscripcion().getIdSuscripcion(), info.getEstado());
        RecaudoDTO recaudo = new RecaudoDTO();
        recaudo.setIdEmpresa(idEmpresaRecaudadora);
        recaudo.setIdConvenio(info.getIdConvenio());
        recaudo.setIdSuscriptor(suscripcion.getIdSuscriptor());
        recaudo.setIdDocumento(idDocumento);
        recaudo.setFecha(new Date());
        
        /**
         * Si el estado del recaudo es diferente de null significa que se va a
         * registrar un anticipo y por tal motivo no lleva fecha de aplicación
         */
        recaudo.setFechaAplicado(info.getEstado() != null ? null : new Date());
        recaudo.setFechaPago(new Date());
        recaudo.setEstado(estado);
        recaudo.setValorAjuste(0D);
        recaudo.setValorCambio(0D);
        recaudo.setValorPagado(info.getValor());
        recaudo.setValorReal(info.getValor());
        long idOficina =  idEmpresaRecaudadora == 317 ? infoRecaudo.getOficinaaseo() :  infoRecaudo.getOficina() ;
        System.out.println("Municipio:"+idOficina);
        recaudo.setIdMunicipio(idOficina);
        recaudo.setIdTercero(suscripcion.getIdTercero());
        recaudo.setVersion(1);
        long idUsuario = infoRecaudo.getUsuario();
        recaudo.setIdUsuario(idUsuario);
        recaudo.setIdMedioPago(recaudoWeb.getMedioPago());
        recaudoDAO.insertarRecaudo(recaudo);
        recaudoDAO.insertarFormasRecaudo(recaudo, configuracion);
        recaudoDAO.insertarRecaudoFactura(recaudo.getIdRecaudo());
        return recaudo;
    }

    private Long consultarDocumentoRecaudo(String tipoRecaudo, Long idSuscripcion, String estado)
            throws PersistenciaExcepcion, NegocioExcepcion {
        if (estado != null) {
            return recaudoDAO.consultarDocumentoRecaudo(tipoRecaudo, idSuscripcion);
        }
        return recaudoDAO.consultarDocumentoRecaudo(tipoRecaudo);
    }

    private void crearDetalleRecaudo(DistribucionRecaudoDTO distribucion)
            throws PersistenciaExcepcion, NegocioExcepcion {
        RecaudoDTO recaudo = distribucion.getRecaudo();
        DetalleRecaudoDTO detalleRecaudo = new DetalleRecaudoDTO();
        detalleRecaudo.setRecaudo(recaudo);
        ArrayList<FacturaDTO> listaFacturaAdicional = new ArrayList<FacturaDTO>();

        /**
         * Se toma la fecha del servidor
         */
        detalleRecaudo.setFecha(new Date());
        detalleRecaudo.setVersion(1);
        detalleRecaudo.setIdUsuario(distribucion.getIdUsuario());
        detalleRecaudo.setDistribucionRecaudo(distribucion);
        detalleRecaudo.setIdDocumento(recaudo.getIdDocumento());
        detalleRecaudo.setIdCiclo(ciclo.getIdCiclo());
        detalleRecaudo.setIdPeriodo(ciclo.getIdPeriodo());
        detalleRecaudo.setAnio(ciclo.getAnio());
        detalleRecaudo.setVersion(1);
        List<FacturaDTO> listaFacturas = facturaDelegado.consultarFacturasConSaldo(distribucion.getIdSuscripcion(),distribucion.getIdEmpresa().toString());
        if(distribucion.getValorRecaudo() > 0 && listaFacturas.size() > 0){
            //List<FacturaDTO> listaFacturas = facturaDelegado.consultarFacturasConSaldo(distribucion.getIdSuscripcion(),distribucion.getIdEmpresa().toString());
            
            saldoRecaudo=distribucion.getValorRecaudo();
            System.out.println("se agregara las siguientes facturas");

            for (FacturaDTO listaFactura : listaFacturas) {
                System.out.println(listaFactura.getIdFactura());
            }

        for (FacturaDTO factura : listaFacturas) {
            detalleRecaudo.setIdFactura(factura.getIdFactura());
            detalleRecaudo.setIdTipoDocumento(factura.getIdTipoDocumento());
            List<DetalleFacturaDTO> listaDetalle = facturaDelegado.consultarDetallesConSaldo(factura.getIdFactura());

            for (DetalleFacturaDTO detalleFactura : listaDetalle) {
                LogUtil.error("facturasID:"+detalleFactura.getFactura().getIdFactura());
                if (saldoRecaudo <= 0) {
                    System.out.println("TERMINANDO EJECUCION");
                    break;
                }
                Double saldoDetalle = detalleFactura.getSaldo();
                Double valorDetale = (saldoDetalle < saldoRecaudo) ? saldoDetalle : saldoRecaudo;
                detalleRecaudo.setIdDetalleFactura(detalleFactura.getIdDetalleFactura());
                detalleRecaudo.setValorReal(valorDetale);
                detalleRecaudo.setValorTotal(valorDetale);
                valorRecaudosAplicados += valorDetale;
                saldoRecaudo -= valorDetale;
             recaudoDAO.insertarDetalleRecaudo(detalleRecaudo);
            }
            /**
             * Se actualiza el saldo a las facturas afectadas
             */
            facturaDelegado.conciliarFactura(factura);
            }        
        }
        LogUtil.error("valor Adicional"+distribucion.getValorRecaudoAdicional());
        if(distribucion.getValorRecaudoAdicional() > 0 ){
        List<FacturaDTO> listaFacturasG = facturaDelegado.consultarFacturasConSaldoCarteraG(distribucion.getIdSuscripcion(),distribucion.getIdEmpresa().toString());
        saldoRecaudo= distribucion.getValorRecaudoAdicional()!=null ? distribucion.getValorRecaudoAdicional() : 0D;
        
        System.out.println("se agregara las siguientes facturas CARTERA G");

        for (FacturaDTO listaFactura : listaFacturasG) {
            System.out.println(listaFactura.getIdFactura());
        }

        for (FacturaDTO factura : listaFacturasG) {
            detalleRecaudo.setIdFactura(factura.getIdFactura());
            detalleRecaudo.setIdTipoDocumento(factura.getIdTipoDocumento());
            List<DetalleFacturaDTO> listaDetalle = facturaDelegado.consultarDetallesConSaldo(factura.getIdFactura());

            for (DetalleFacturaDTO detalleFactura : listaDetalle) {
                if (saldoRecaudo <= 0) {
                    break;
                }
                Double saldoDetalle = detalleFactura.getSaldo();
                Double valorDetale = (saldoDetalle < saldoRecaudo) ? saldoDetalle : saldoRecaudo;
                detalleRecaudo.setIdDetalleFactura(detalleFactura.getIdDetalleFactura());
                detalleRecaudo.setValorReal(valorDetale);
                detalleRecaudo.setValorTotal(valorDetale);
                valorRecaudosAplicados += valorDetale;
                saldoRecaudo -= valorDetale;
                System.out.println("APLICAR RECUADO: "+valorDetale);
                recaudoDAO.insertarDetalleRecaudo(detalleRecaudo);
                System.out.println("APLICADO RECUADO");
            }
            /**
             * Se actualiza el saldo a las facturas afectadas
             */
            facturaDelegado.conciliarFactura(factura);
        }
        
        }
    }

    private SuscripcionDTO obtenerSuscripcionPorEmpresa(Integer idEmpresaRecaudadora)
            throws NegocioExcepcion, PersistenciaExcepcion {
        List<SuscripcionDTO> listaSuscripciones = suscripcionDelegado.getSuscripcionesConvenio(usuario.getIdSuscripcion());
        for (SuscripcionDTO suscripcion : listaSuscripciones) {
            if (Objects.equals(suscripcion.getIdEmpresa(), idEmpresaRecaudadora)) {
                return suscripcion;
            }
        }
        throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_SUSCRIPCION_INICIAL_NO_ENCONTRADA, " idEmpresaRecaudadora: " + idEmpresaRecaudadora);
    }

    /**
     * Método encargado de generar los anticipos de la empresa en la que se
     * incia el pago
     *
     * @param listaSuscripciones
     * @param idEmpresaRecaudadora
     * @param saldoFacturas
     * @throws NegocioExcepcion
     * @throws PersistenciaExcepcion
     */
    private void procesarAnticipo(Integer idEmpresaRecaudadora, Double saldoFacturas)
            throws NegocioExcepcion, PersistenciaExcepcion {
        if (saldoRecaudo <= 0) {
            return;
        }
        String tipoRecaudo = obtenerTipoAnticipo(saldoFacturas);
        SuscripcionDTO suscripcion = obtenerSuscripcionPorEmpresa(idEmpresaRecaudadora);
        InfoRecaudoDTO infoRecaudo = new InfoRecaudoDTO();
        infoRecaudo.setIdConvenio(suscripcion.getIdConvenio());
        infoRecaudo.setIdEmpresaRecaudadora(idEmpresaRecaudadora);
        infoRecaudo.setSuscripcion(suscripcion);
        infoRecaudo.setTipoRecaudo(tipoRecaudo);
        infoRecaudo.setValor(saldoRecaudo);
        infoRecaudo.setEstado("G");
        RecaudoDTO recaudo = crearRecaudo(infoRecaudo);
        DistribucionRecaudoDTO distribucionRecaudoDTO = new DistribucionRecaudoDTO();
        distribucionRecaudoDTO.setValorRecaudo(saldoRecaudo);
        distribucionRecaudoDTO.setSaldoRecaudo(saldoRecaudo);
        distribucionRecaudoDTO.setValorRecaudoAdicional(0D);
        distribucionRecaudoDTO.setSaldoRecaudoAdicional(0D);
        long idTipoDocumento = recaudoDAO.consultaTipoDocumentoSuscripcion(suscripcion.getIdSuscripcion());
        distribucionRecaudoDTO.setIdTipoDocumento(idTipoDocumento);
        distribuirRecaudo(recaudo, suscripcion, distribucionRecaudoDTO);
    }

}
