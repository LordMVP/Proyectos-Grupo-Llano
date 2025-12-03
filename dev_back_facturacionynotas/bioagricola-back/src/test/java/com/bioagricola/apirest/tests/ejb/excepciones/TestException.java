/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.bioagricola.apirest.tests.ejb.excepciones;

/**
 * Excepción lanzada cuando se produce en error en alguno de los tests automatizados.
 * 
 * @author GeneradorCRUD
 */
public class TestException extends RuntimeException {

    public TestException (String message) {
        super (message);
    }

    public TestException (Throwable cause) {
        super (cause);
    }

    public TestException (String message, Throwable cause) {
        super (message, cause);
    }
}
