/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.delegado;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.dao.FacturaDAO;
import com.gell.psews.persistencia.dto.DetalleFacturaDTO;
import com.gell.psews.persistencia.dto.FacturaDTO;
import com.gell.psews.persistencia.dto.InfoDetalleFacturaDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Clase encargada de gestionar las facturas
 *
 * @author lrey
 */
public class FacturaDelegado {

    private final FacturaDAO facturaDAO;

    public FacturaDelegado(Connection cnn) {
        this.facturaDAO = new FacturaDAO(cnn);
    }
    
    
            
            
     
            
            
            
            
   
    

    /**
     * Consulta las facturas con saldo
     *
     * @param idSuscripcion identificador de la suscripción
     * @return lista de facturas
     * @throws PersistenciaExcepcion
     * @throws NegocioExcepcion Si la suscripción no tiene facturas con saldo
     */
    public List<FacturaDTO> consultarFacturasConSaldo(Long idSuscripcion,String empresa) throws PersistenciaExcepcion, NegocioExcepcion {
        List<FacturaDTO> lista = facturaDAO.consultarFacturasConSaldo(idSuscripcion, empresa);
        /*if (lista.isEmpty()) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_SIN_SALDO); PROCESO DEBE CONTINUAR A CARTERA G
        }*/
        return lista;
    }
    
        /**
     * Consulta las facturas con saldo Cartera G
     *
     * @param idSuscripcion identificador de la suscripción
     * @return lista de facturas
     * @throws PersistenciaExcepcion
     * @throws NegocioExcepcion Si la suscripción no tiene facturas con saldo
     */
    public List<FacturaDTO> consultarFacturasConSaldoCarteraG(Long idSuscripcion,String empresa) throws PersistenciaExcepcion, NegocioExcepcion {
        List<FacturaDTO> lista = facturaDAO.consultarFacturasConSaldoG(idSuscripcion, empresa);
        LogUtil.error("LIstfacti:"+lista.size());
        if (lista.isEmpty()) {
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_SIN_SALDO);
        }
        return lista;
    }
    
    
    
     
    
    

    /**
     * Se consulta el valor a pagar de las facturas
     *
     * @param idsSuscripciones arreglo con los identificadores de las
     * suscripciones
     * @return Saldo de todas las facturas de las suscripciones
     * @throws PersistenciaExcepcion
     */
    public Double consultarSaldoFacturas(Long[] idsSuscripciones) throws PersistenciaExcepcion {
        return facturaDAO.consultarSaldoFacturas(idsSuscripciones);
    }
    
      /**
     * Se consulta el valor a pagar de las facturas adicionales
     *
     * @param idsSuscripciones arreglo con los identificadores de las
     * suscripciones
     * @return Saldo de todas las facturas de las suscripciones
     * @throws PersistenciaExcepcion
     */
    public Double consultarSaldoFacturasAdicional(Integer idsSuscripciones) throws PersistenciaExcepcion {
        return facturaDAO.consultarSaldoFacturasAdicional(idsSuscripciones);
    }
    
    public void estadodwra(Integer idsSuscripciones) throws PersistenciaExcepcion {
         facturaDAO.estadodwra(idsSuscripciones);
    }

    /**
     * Consulta los detalles con saldos de las facturas
     *
     * @param idFactura Identificador de la factura
     * @return
     * @throws PersistenciaExcepcion
     */
    public List<DetalleFacturaDTO> consultarDetallesConSaldo(Long idFactura) throws PersistenciaExcepcion {
        return facturaDAO.consultarDetallesConSaldo(idFactura);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
   
    /**
     * Método encargado de consultar los detalles de la factura, notas y
     * detalles del recaudo para dejar la factura consistente
     *
     * @param factura
     * @throws PersistenciaExcepcion
     * @throws NegocioExcepcion
     */
    public void conciliarFactura(FacturaDTO factura) throws PersistenciaExcepcion, NegocioExcepcion {
        List<InfoDetalleFacturaDTO> lista = facturaDAO.consultarDetallesFacturasConciliado(factura);
        Double valorFactura = 0D;
        Double saldoFactura = 0D;
        for (InfoDetalleFacturaDTO infoDetalle : lista) {
            System.out.println("DETALLE FACTURA:"+infoDetalle.getConcepto().toString() + " -- "+ infoDetalle.getValor() + " -- "+infoDetalle.getValorPagado());
            Double saldo = infoDetalle.getValor() - infoDetalle.getValorPagado();
            if (saldo < 0) {
                throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_DETALLE_FACTURA_NEGATIVO);
            }
            saldoFactura += saldo;
            valorFactura += infoDetalle.getValor();
            System.out.println("VALOR FACTURA:"+valorFactura);
            facturaDAO.actualizarDetalleFactura(infoDetalle);
            System.out.println("FACTURA:"+infoDetalle.getIdDetalleFactura()+" --ACTUALIZADO");
        }
        factura.setValorReal(valorFactura);
        factura.setSaldo(saldoFactura);
        facturaDAO.actualizarFactura(factura);
    }

}
