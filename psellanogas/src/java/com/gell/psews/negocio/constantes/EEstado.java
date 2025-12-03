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
public class EEstado {

    private EEstado() {

    }

    /**
     * Hace referencia a los estado de la tabla wrec_webrec-wrec_estado
     */
    public static final class RecaudoWeb {

        private RecaudoWeb() {
        }

        public static final String ENVIADO = "E";
        public static final String RECHAZADO = "R";
        public static final String DECLINADO = "D";
        public static final String PENDIENTE = "P";
        public static final String ERROR = "F";
    }

    /**
     * Hace referencia a los estado de la tabla dwre_detwebrec
     */
    public static final class DetalleRecaudoWeb {

        private DetalleRecaudoWeb() {

        }

        /**
         * Estado del campo dwre_estpago
         */
        public static final class Pago {

            public static final String PENDIENTE = "PENDIENTE";
            public static final String RECHAZADO = "RECHAZADO";
            public static final String OK = "OK";

            private Pago() {
            }

        }

        /**
         * Estado del campo dwre_estaplpago
         */
        public static final class Aplicacion {

            public static final String PENDIENTE = "PENDIENTE";
            public static final String RECAUDADO = "RECAUDADO";
            public static final String APLICADO_EXITOSAMENTE = "APLICADO_EXITOSAMENTE";
            public static final String ERROR_APLICACION = "ERROR_APLICACION";

            private Aplicacion() {
            }
        }

    }

    /**
     * Hace referencia a los estado de la tabla lwre_logwebrec-lwre_state
     */
    public static final class LogRecaudoWeb {

        public static final String CREATED = "CREATED";
        public static final String PENDING = "PENDING";
        public static final String FAILED = "FAILED";
        public static final String NOT_AUTHORIZED = "NOT_AUTHORIZED";
        public static final String OK = "OK";

        private LogRecaudoWeb() {
        }

    }

}
