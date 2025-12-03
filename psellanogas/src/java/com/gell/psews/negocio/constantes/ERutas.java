/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.constantes;

/**
 *
 * @author lrey
 */
public class ERutas {

    public static final class Configuracion {

        public static final String CARGAR_CONFIGURACION = "/sistema/administracion/cargar";
        public static final String PROCESO_DETENER = "/sistema/administracion/detener";
        public static final String PROCESO_ENVIAR_CORREO = "/sistema/administracion/enviarcorreo";
    }

    public static final class Cliente {

        public static final String CONSULTAR_FACTURA = "/cliente/consultar";
        public static final String CONSULTAR_FACTURACONPAGOADICIONAL = "/cliente/consultar1";
        public static final String CONFIRMAR_PAGO = "/cliente/confirmarpago";
        public static final String PAGAR = "/cliente/pagar";
          public static final String PAGAR2 = "/cliente/pagar2";
        public static final String CONSULTAR_TRANSACCION = "/cliente/transaccion";
        public static final String CONSULTAR_AUTORIZACION_TRATAMIENTO = "/cliente/autorizacion";
        public static final String CONSULTAR_POLITICA_TRATAMIENTO = "/cliente/politica";
        

    }

}
