package com.bioagricola.apirest.modelo.enums;


/**
 *  Tipo de filtro de los objetos de la clase InformacionFiltro, define el comparador
 * a utilizar en la condición que define el objeto.
 * 
 * @author GeneradorCRUD
 */
public enum TipoFiltro {
        LIKE(":LIKE:"), EXACTO("="), NOT_LIKE(":NOTLIKE:"), MAYOR(">"), MENOR("<"), MAYOR_O_IGUAL(">="), 
        MENOR_O_IGUAL("<="), DIFERENTE("!=");

        private final String idReducido;

        private TipoFiltro(String idReducido) {
            this.idReducido = idReducido;
        }                

        /**
         * @return  El id reducido del operador de comparación utilizado en las consultas
         */
        public String getIdReducido() {
            return this.idReducido;
        }

        /**
         * Consulta el TipoFiltro asociado al idReducido que se pasa como parámetro
         * @param idReducido El id reducido del operador de comparación utilizado en las consultas
         * @return Un tipo filtro
         */
        public TipoFiltro obtenerTipoFiltro(String idReducido){
            if(idReducido!=null){
                for(TipoFiltro tipoFiltro : TipoFiltro.values()){
                    if(tipoFiltro.getIdReducido().equals(idReducido)){
                        return tipoFiltro;
                    }
                }
                throw new IllegalArgumentException();
            }else{
                throw new NullPointerException();
            }                    
        }

}
