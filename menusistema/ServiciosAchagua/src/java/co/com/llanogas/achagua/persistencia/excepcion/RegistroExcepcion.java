/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.llanogas.achagua.persistencia.excepcion;

/**
 *
 * @author hrey
 */
public class RegistroExcepcion extends Exception {

    private int codigo;

    public RegistroExcepcion(int codigo, String message) {
        super(message);
        this.codigo = codigo;
    }

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

}
