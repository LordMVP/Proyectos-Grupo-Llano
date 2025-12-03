/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.archivos.negocio.util;

import com.gell.estandar.dto.AuditoriaDTO;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 *
 * @author God
 */
public class SesionUtil {

  /**
   * Obtiene la información de la auditoria que está procesando la información
   * del usuario
   *
   * @return Aditoria con la información del usuario y empresa
   */
  public static AuditoriaDTO auditoria()
  {
    Object usuarioPrincipal = SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();
    if (usuarioPrincipal instanceof AuditoriaDTO) {
      return (AuditoriaDTO) usuarioPrincipal;
    }
    return new AuditoriaDTO();
  }
}
