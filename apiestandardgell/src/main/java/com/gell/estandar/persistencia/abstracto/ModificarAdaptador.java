/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.persistencia.abstracto;

import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.constante.EMensajeEstandar;
import java.sql.SQLException;

/**
 *
 * @author lrey
 */
public abstract class ModificarAdaptador {

  public void sinResultados()
          throws PersistenciaExcepcion
  {
  }

  public void error(SQLException ex)
          throws PersistenciaExcepcion
  {
    throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
  }

}
