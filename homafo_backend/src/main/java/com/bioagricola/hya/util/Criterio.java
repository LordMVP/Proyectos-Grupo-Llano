package com.bioagricola.hya.util;

/**
 * Clase que establece los parametros de busqueda para el filtro especificacion (Specifications)
 */
public class Criterio {

    /**
     * Nombre de la variable
     */
    private String variable;

    /**
     * Campo referencia( cuando hay relaciones entre entidades y se requiere una variable del objeto)
     */
    private String camporef;

    /**
     * Variable para definir operacion del filtro specification
     */
    private String operacion;

    /**
     * Valor a consultar
     */
    private Object valor;

    /**
     * Constructor de la clase
     * @param variable
     * @param operacion
     * @param valor
     */
    public Criterio(String variable, String operacion, Object valor) {
        this.variable = variable;
        this.operacion = operacion;
        this.valor = valor;
    }

    /**
     * Constructor de la clase
     * @param variable
     * @param camporef
     * @param operacion
     * @param valor
     */
    public Criterio(String variable, String camporef, String operacion, Object valor) {
        this.variable = variable;
        this.camporef = camporef;
        this.operacion = operacion;
        this.valor = valor;
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

    public String getOperacion() {
        return operacion;
    }

    public void setOperacion(String operacion) {
        this.operacion = operacion;
    }

    public Object getValor() {
        return valor;
    }

    public void setValor(Object valor) {
        this.valor = valor;
    }

    public String getCamporef() {
        return camporef;
    }

    public void setCamporef(String camporef) {
        this.camporef = camporef;
    }
}
