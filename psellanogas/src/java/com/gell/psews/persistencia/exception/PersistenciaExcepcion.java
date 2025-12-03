/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.exception;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;

/**
 * Genera los mensajes que devuelve la base de datos personalizados
 *
 * @author lrey
 */
public class PersistenciaExcepcion extends AplicacionExcepcion {

    public PersistenciaExcepcion(EMensajes constante) {
        super(constante);
    }

    public PersistenciaExcepcion(EMensajes constante, String mensaje) {
        super(constante.getCodigo(), constante.getMensaje().replaceAll("__COMPLEMENTO__", mensaje));
    }

}
