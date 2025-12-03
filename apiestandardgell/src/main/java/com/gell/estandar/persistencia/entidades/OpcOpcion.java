package com.gell.estandar.persistencia.entidades;

import com.gell.estandar.persistencia.abstracto.Entidad;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import java.io.Serializable;
import java.util.List;

/**
 *
 * @author hrey
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OpcOpcion extends Entidad implements Serializable {

  private Integer opcIderegistro;
  private String opcNombre;
  private String opcDescripcion;
  private PrgPrograma prgIderegistro;
  private OpcOpcion opcIdepadre;
  private Integer usuIderegistro;
  private Integer opcTipo;
  private List<OpcOpcion> menuItem;

  public OpcOpcion()
  {
  }

  // <editor-fold defaultstate="collapsed" desc="GET-SET">
  public Integer getOpcIderegistro()
  {
    return opcIderegistro;
  }

  public OpcOpcion setOpcIderegistro(Integer opcIderegistro)
  {
    this.opcIderegistro = opcIderegistro;
    return this;
  }

  public String getOpcNombre()
  {
    return opcNombre;
  }

  public OpcOpcion setOpcNombre(String opcNombre)
  {
    this.opcNombre = opcNombre;
    return this;
  }

  public String getOpcDescripcion()
  {
    return opcDescripcion;
  }

  public OpcOpcion setOpcDescripcion(String opcDescripcion)
  {
    this.opcDescripcion = opcDescripcion;
    return this;
  }

  public PrgPrograma getPrgIderegistro()
  {
    return prgIderegistro;
  }

  public OpcOpcion setPrgIderegistro(PrgPrograma prgIderegistro)
  {
    this.prgIderegistro = prgIderegistro;
    return this;
  }

  public OpcOpcion getOpcIdepadre()
  {
    return opcIdepadre;
  }

  public OpcOpcion setOpcIdepadre(OpcOpcion opcIdepadre)
  {
    this.opcIdepadre = opcIdepadre;
    return this;
  }

  public Integer getUsuIderegistro()
  {
    return usuIderegistro;
  }

  public OpcOpcion setUsuIderegistro(Integer usuIderegistro)
  {
    this.usuIderegistro = usuIderegistro;
    return this;
  }

  public Integer getOpcTipo()
  {
    return opcTipo;
  }

  public OpcOpcion setOpcTipo(Integer opcTipo)
  {
    this.opcTipo = opcTipo;
    return this;
  }

  public List<OpcOpcion> getMenuItem()
  {
    return menuItem;
  }

  public OpcOpcion setMenuItem(List<OpcOpcion> menuItem)
  {
    this.menuItem = menuItem;
    return this;
  }

  // </editor-fold>
  @Override
  public OpcOpcion validar()
          throws AplicacionExcepcion
  {
    return this;
  }

}
