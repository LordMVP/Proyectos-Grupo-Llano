package com.gell.estandar.persistencia.entidades;

import com.gell.estandar.persistencia.abstracto.Entidad;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author hrey
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccAcceso extends Entidad implements Serializable {

  private Long accIderegistro;
  private Usuarios usuIderegistro;
  private Date accFecingreso;
  private Date accFecsalida;
  private String accEstado;
  private Integer empIderegistro;
  private Integer pfiIderegistro;
  private String accObservacion;

  public AccAcceso()
  {
  }

  // <editor-fold defaultstate="collapsed" desc="GET-SET">
  public Long getAccIderegistro()
  {
    return accIderegistro;
  }

  public AccAcceso setAccIderegistro(Long accIderegistro)
  {
    this.accIderegistro = accIderegistro;
    return this;
  }

  public Usuarios getUsuIderegistro()
  {
    return usuIderegistro;
  }

  public AccAcceso setUsuIderegistro(Usuarios usuIderegistro)
  {
    this.usuIderegistro = usuIderegistro;
    return this;
  }

  public Date getAccFecingreso()
  {
    return accFecingreso;
  }

  public AccAcceso setAccFecingreso(Date accFecingreso)
  {
    this.accFecingreso = accFecingreso;
    return this;
  }

  public Date getAccFecsalida()
  {
    return accFecsalida;
  }

  public AccAcceso setAccFecsalida(Date accFecsalida)
  {
    this.accFecsalida = accFecsalida;
    return this;
  }

  public String getAccEstado()
  {
    return accEstado;
  }

  public AccAcceso setAccEstado(String accEstado)
  {
    this.accEstado = accEstado;
    return this;
  }

  public Integer getEmpIderegistro()
  {
    return empIderegistro;
  }

  public AccAcceso setEmpIderegistro(Integer empIderegistro)
  {
    this.empIderegistro = empIderegistro;
    return this;
  }

  public Integer getPfiIderegistro()
  {
    return pfiIderegistro;
  }

  public AccAcceso setPfiIderegistro(Integer pfiIderegistro)
  {
    this.pfiIderegistro = pfiIderegistro;
    return this;
  }

  public String getAccObservacion()
  {
    return accObservacion;
  }

  public AccAcceso setAccObservacion(String accObservacion)
  {
    this.accObservacion = accObservacion;
    return this;
  }

  // </editor-fold>
  @Override
  public AccAcceso validar()
          throws AplicacionExcepcion
  {
    return this;
  }
}
