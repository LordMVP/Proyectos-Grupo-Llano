package com.bioagricola.apirest.modelo.utils;

import static com.bioagricola.apirest.modelo.utils.UtilConstantes.INT_PRIMITIVE;
import static com.bioagricola.apirest.modelo.utils.UtilConstantes.LONG_PRIMITIVE;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Parameter;
import javax.persistence.Query;

import com.bioagricola.apirest.modelo.excepciones.ReflectionException;

/**
 * Clase con utilidades que hacen uso de reflection.
 * 
 * @author GeneradorCRUD
 */
public class UtilReflection {        
    
    private static final org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger(UtilReflection.class.getName());
    
    private UtilReflection(){}
    
    /**
     * Devuelve el método get consultado por reflection del atributo que se 
     * pasa como parámetro en la clase del objeto objId
     * @param objId Instancia de la clase a analizar
     * @param nombreAtributo Nombre del atributo del cual se quiere consultar el get.
     * @return El metodo get correspondiente al atributo
     */
    public static Method consultarMetodoGetAtributo(Object objId, String nombreAtributo){
        
        Method metodo = null;
        try {
            String nombre = "get"+nombreAtributo.substring(0, 1).toUpperCase()+nombreAtributo.substring(1);
            metodo = objId.getClass().getMethod(nombre);         
        } catch (NoSuchMethodException | SecurityException ex) {
            logger.error(ex);
            throw new ReflectionException("El metodo get consultado para el atributo " + nombreAtributo + " no existe.");
        } 
        
        return metodo;
    }
    
    /**
     * Devuelve el atributo etiquetado con @EmbbededId de la clase que define una entidad que se pasa como parámetro
     * @param claseEntidad Clase de la entidad a consultar
     * @return El atributo etiqueta con @EmbbededId de la entidad
     */
    public static String consultarAtributoPKCompleja(Class claseEntidad){
        if(claseEntidad.isAnnotationPresent(Entity.class)){
            Field[] atributos = claseEntidad.getDeclaredFields();
            for (Field atributo : atributos) {
                if (atributo.isAnnotationPresent(EmbeddedId.class)) {
                    return atributo.getName();
                }
            }
        }
        throw new ReflectionException("El objeto consultado o no es una entidad o no tiene un atributo embeddedid");
    }
    
    /**
     * Identifica si la clase del objeto que se pasa como parámetro es una pk compuesta, es decir,
     * si está anotada con la etiqueta @Embbeded
     * @param idObj Instancia de la clase a analizar
     * @return Verdadero si el objeto está anotado con @Embbeded
     */
    public static boolean esPkCompleja(Object idObj){
        return idObj.getClass().isAnnotationPresent(Embeddable.class);
    }
    
    /**
     * Devuelve los atributos de la clase que se pasa como parametro
     * @param clase Clase a analizar
     * @return Lista de atributos no estáticos y privados de la clase
     */
    public static List<String> consultarAtributosClase(Class clase){
        List<String> atributosId = new ArrayList<>();       
        for(Field atributo: clase.getDeclaredFields()){
            if(Modifier.isPrivate(atributo.getModifiers()) && !Modifier.isStatic(atributo.getModifiers())){
                atributosId.add(atributo.getName());
            }            
        }
        return atributosId;
    }
    
    /**
     * Devuelve el nombre del atributo etiquetado con @Id de la entidad
     * que se pasa como parámetro.
     * @param claseEntidad Clase que define una entidad
     * @return El nombre del atributo identificador de la entidad
     */
    public static String consultarAtributoId(Class claseEntidad){
        if(claseEntidad.isAnnotationPresent(Entity.class)){
            Field[] atributos = claseEntidad.getDeclaredFields();
            for (Field atributo : atributos) {
                if (atributo.isAnnotationPresent(Id.class)) {
                    return atributo.getName();
                }
            }
        }
        
        throw new ReflectionException("El objeto consultado o no es una entidad o no tiene un atributo id");
    }   
    
     /**
     * Establece el valor del parametro en el query deado
     *
     * @param q Query jpql
     * @param p Parametro del query jpql a setear
     * @param value El valor a asignar al parámetro
     */
    public static void setParameter(Query q, Parameter p, String value) {
        Class c = p.getParameterType();
        if (value == null) {
            q.setParameter(p, value);
        } else if (c.equals(String.class)) {
            q.setParameter(p, value);
        } else if (c.equals(Integer.class)) {
            q.setParameter(p, new Integer(value));
        } else if(INT_PRIMITIVE.equals(c.toString())){
            q.setParameter(p, new Integer(value));
        }else if (c.equals(Boolean.class)) {
            q.setParameter(p, Boolean.parseBoolean(value));
        } else if (c.equals(Long.class)) {
            q.setParameter(p, Long.parseLong(value));
        } else if(LONG_PRIMITIVE.equals(c.toString())){
        	q.setParameter(p,  Long.parseLong(value));
        } else if(c.equals(BigInteger.class)){
        	q.setParameter(p,  new BigInteger(value));
        } else if(c.equals(BigDecimal.class)){
            q.setParameter(p,  new BigDecimal(value));
        } else if(c.equals(Object.class)){
            q.setParameter(p,  value);
        }else{
            throw new IllegalArgumentException("El valor especificado para el parámetro no se reconocio como un tipo java. Valor especificado: "+c.getName());
        }
    }
}
