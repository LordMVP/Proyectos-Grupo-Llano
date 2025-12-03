package com.bioagricola.apirest.liquidacion.web.servicio.utils;

/**
 * Clase que establece los parametros de busqueda para el filtro especificacion (Specifications)
 */
public class SearchCriteria {

    /**
     * Nombre de la variable
     */
    private String variable;

    /**
     * Campo referencia( cuando hay relaciones entre entidades y se requiere una variable del objeto)
     */
    private String fieldRef;

    /**
     * Variable para definir operacion del filtro specification
     */
    private String operation;

    /**
     * Valor a coonsultar
     */
    private Object value;

    /**
     * Constructor de la clase
     * @param variable
     * @param operation
     * @param value
     */
    public SearchCriteria(String variable, String operation, Object value) {
        this.variable = variable;
        this.operation = operation;
        this.value = value;
    }

    /**
     * Constructor de la clase
     * @param variable
     * @param fieldRef
     * @param operation
     * @param value
     */
    public SearchCriteria(String variable, String fieldRef, String operation, Object value) {
        this.variable = variable;
        this.fieldRef = fieldRef;
        this.operation = operation;
        this.value = value;
    }

    /**
     * Getters y setters
     */

    public String getVariable() {
        return variable;
    }

    public void setVariable(String variable) {
        this.variable = variable;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public String getFieldRef() {
        return fieldRef;
    }

    public void setFieldRef(String fieldRef) {
        this.fieldRef = fieldRef;
    }
}
