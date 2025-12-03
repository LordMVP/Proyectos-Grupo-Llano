/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.archivos.negocio.servicio;

import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.archivos.negocio.util.SesionUtil;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author god
 */
public class GenericoServicio {

  protected static final int NO_REGISTROS = 0;

  @Autowired
  protected DataSource dataSource;

  /**
   * Devuelve la información del usuario que está realizando la transacción
   *
   * @return Información del usuario
   */
  public AuditoriaDTO auditoria()
  {
    return SesionUtil.auditoria();
  }

}
