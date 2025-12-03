package com.bioagricola.apirest.modelo.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * Utilidades de conversión entre objetos o listas.
 * 
 * @author GeneradorCRUD
 */
public class UtilOperaciones {
    
    private UtilOperaciones(){}
    
    /**
     * Convierte una lista de objetos a una lista de su representación en String
     * @param objetos Lista de objetos a convertir a String
     * @return Lista de cadena de caracteres. La lista es vacia si la lista del parametro no 
     * contiene objetos o es nula.
     */
    public static List<String> convertirListaObjetosAString(List<Object> objetos){
        List<String> lista = new ArrayList<>();
        if(objetos!=null && !objetos.isEmpty()){
            for(Object objeto : objetos){
                lista.add(objeto.toString());
            }
        }
        
        return lista;
        
    }
}
