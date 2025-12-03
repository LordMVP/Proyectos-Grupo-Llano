package com.gell.estandar.persistencia.entidades;

import com.gell.estandar.persistencia.abstracto.Entidad;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import java.io.Serializable;

/**
 *
 * @author hrey
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PrgPrograma extends Entidad implements Serializable {

  private Integer prgIderegistro;
  private String prgNombre;
  private String prgLocaliza;
  private String prgAbreviatura;
  private String prgVersion;
  private String prgTipo;
  private Integer usuIderegistro;

  public PrgPrograma()
  {
  }

  // <editor-fold defaultstate="collapsed" desc="GET-SET">
  public Integer getPrgIderegistro()
  {
    return prgIderegistro;
  }

  public PrgPrograma setPrgIderegistro(Integer prgIderegistro)
  {
    this.prgIderegistro = prgIderegistro;
    return this;
  }

  public String getPrgNombre()
  {
    return prgNombre;
  }

  public PrgPrograma setPrgNombre(String prgNombre)
  {
    this.prgNombre = prgNombre;
    return this;
  }

  public String getPrgLocaliza()
  {
    return prgLocaliza;
  }

  public PrgPrograma setPrgLocaliza(String prgLocaliza)
  {
    this.prgLocaliza = prgLocaliza;
    return this;
  }

  public String getPrgAbreviatura()
  {
    return prgAbreviatura;
  }

  public PrgPrograma setPrgAbreviatura(String prgAbreviatura)
  {
    this.prgAbreviatura = prgAbreviatura;
    return this;
  }

  public String getPrgVersion()
  {
    return prgVersion;
  }

  public PrgPrograma setPrgVersion(String prgVersion)
  {
    this.prgVersion = prgVersion;
    return this;
  }

  public String getPrgTipo()
  {
    return prgTipo;
  }

  public PrgPrograma setPrgTipo(String prgTipo)
  {
    this.prgTipo = prgTipo;
    return this;
  }

  public Integer getUsuIderegistro()
  {
    return usuIderegistro;
  }

  public PrgPrograma setUsuIderegistro(Integer usuIderegistro)
  {
    this.usuIderegistro = usuIderegistro;
    return this;
  }

  // </editor-fold>
  @Override
  public PrgPrograma validar()
          throws AplicacionExcepcion
  {
    return this;
  }
}
