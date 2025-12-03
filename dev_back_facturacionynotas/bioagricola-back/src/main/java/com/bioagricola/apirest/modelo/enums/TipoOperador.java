package com.bioagricola.apirest.modelo.enums;

/**
 * Tipo de operadores de los objetos de la clase InformacionFiltro
 * 
 * @author GeneradorCRUD
 */
public enum TipoOperador {
        OR("|"), AND("&");

        private final String idReducido;

        private TipoOperador(String idReducido) {
            this.idReducido = idReducido;
        }

        /**
         * @return  El id reducido del operador de concatenación utilizado en las consultas
         */
        public String getIdReducido() {
            return this.idReducido;
        }

        /**
         * Consulta el TipoOperador asociado al idReducido que se pasa como parámetro
         * @param idReducido El id reducido del operador de concatenación utilizado en las consultas
         * @return Un tipo de operador de concatenación
         */
        public static TipoOperador obtenerTipoOperador(String idReducido){
            if(idReducido!=null){
                for(TipoOperador tipoOperador : TipoOperador.values()){
                    if(tipoOperador.getIdReducido().equals(idReducido)){
                        return tipoOperador;
                    }
                }
                throw new IllegalArgumentException();
            }else{
                throw new NullPointerException();
            }                    
        }

}