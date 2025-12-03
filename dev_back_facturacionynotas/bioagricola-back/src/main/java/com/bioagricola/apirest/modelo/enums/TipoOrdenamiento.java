package com.bioagricola.apirest.modelo.enums;

/**
 * Tipo de filtro de los objetos de la clase InformacionOrdenamiento
 * 
 * @author GeneradorCRUD
 */
public enum TipoOrdenamiento {
    
        ASCENDENTE("ASC") , DESCENDENTE("DESC"), SIN_ORDENAR("SIN");

        private String idReducido;

        private TipoOrdenamiento(String idReducido) {
            this.idReducido = idReducido;
        }                        
        
        /**
         * @return  El id reducido del tipó de ordenamiento utilizado en las consultas
         */
        public String getIdReducido() {
            return this.idReducido;
        }
        
         /**
         * Consulta el TipoOrdenamiento asociado al idReducido que se pasa como parámetro
         * @param idReducido El id reducido del tipo de ordenamiento utilizado en las consultas
         * @return Un tipo de ordenamiento
         */
        public static TipoOrdenamiento obtenerTipoOrdenamiento(String idReducido){
            if(idReducido!=null){
                for(TipoOrdenamiento tipoOrdenamiento : TipoOrdenamiento.values()){
                    if(tipoOrdenamiento.getIdReducido().equals(idReducido)){
                        return tipoOrdenamiento;
                    }
                }
                throw new IllegalArgumentException();
            }else{
                throw new NullPointerException();
            }                    
        }

}