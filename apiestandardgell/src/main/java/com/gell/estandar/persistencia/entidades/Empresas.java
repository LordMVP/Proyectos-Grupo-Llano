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
public class Empresas extends Entidad implements Serializable,Cloneable {

  private String empresaCod;
  private String empresaNom;
  private String empresaSlo;
  private String empresaImg;
  private String empresaCodsed;
  private String empresaCodsuc;
  private String empresaIndemp;
  private String empresaIdefac;
  private Integer empresaSevemp;
  private Long terIdegenerico;
  private String empresaCodfssri;

  public Empresas()
  {
  }

  // <editor-fold defaultstate="collapsed" desc="GET-SET">
  public String getEmpresaCod()
  {
    return empresaCod;
  }

  public Empresas setEmpresaCod(String empresaCod)
  {
    this.empresaCod = empresaCod;
    return this;
  }

  public String getEmpresaNom()
  {
    return empresaNom;
  }

  public Empresas setEmpresaNom(String empresaNom)
  {
    this.empresaNom = empresaNom;
    return this;
  }

  public String getEmpresaSlo()
  {
    return empresaSlo;
  }

  public Empresas setEmpresaSlo(String empresaSlo)
  {
    this.empresaSlo = empresaSlo;
    return this;
  }

  public String getEmpresaImg()
  {
    return empresaImg;
  }

  public Empresas setEmpresaImg(String empresaImg)
  {
    this.empresaImg = empresaImg;
    return this;
  }

  public String getEmpresaCodsed()
  {
    return empresaCodsed;
  }

  public Empresas setEmpresaCodsed(String empresaCodsed)
  {
    this.empresaCodsed = empresaCodsed;
    return this;
  }

  public String getEmpresaCodsuc()
  {
    return empresaCodsuc;
  }

  public Empresas setEmpresaCodsuc(String empresaCodsuc)
  {
    this.empresaCodsuc = empresaCodsuc;
    return this;
  }

  public String getEmpresaIndemp()
  {
    return empresaIndemp;
  }

  public Empresas setEmpresaIndemp(String empresaIndemp)
  {
    this.empresaIndemp = empresaIndemp;
    return this;
  }

  public String getEmpresaIdefac()
  {
    return empresaIdefac;
  }

  public Empresas setEmpresaIdefac(String empresaIdefac)
  {
    this.empresaIdefac = empresaIdefac;
    return this;
  }

  public Integer getEmpresaSevemp()
  {
    return empresaSevemp;
  }

  public Empresas setEmpresaSevemp(Integer empresaSevemp)
  {
    this.empresaSevemp = empresaSevemp;
    return this;
  }

  public Long getTerIdegenerico()
  {
    return terIdegenerico;
  }

  public Empresas setTerIdegenerico(Long terIdegenerico)
  {
    this.terIdegenerico = terIdegenerico;
    return this;
  }

  public String getEmpresaCodfssri()
  {
    return empresaCodfssri;
  }

  public Empresas setEmpresaCodfssri(String empresaCodfssri)
  {
    this.empresaCodfssri = empresaCodfssri;
    return this;
  }
  //</editor-fold>

  @Override
  public Empresas validar()
          throws AplicacionExcepcion
  {
    return this;
  }

}
