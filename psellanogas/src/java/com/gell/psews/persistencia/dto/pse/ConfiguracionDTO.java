/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto.pse;

/**
 *
 * @author spiwer
 */
public class ConfiguracionDTO
{

  private CorreoDTO correo;
  private DatosPSE datosPSE;
  private EmpresaDTO empresa;
  private InfoRecaudoDTO recaudo;
  private ProcesoDTO proceso;

  public CorreoDTO getCorreo()
  {
    return correo;
  }

  public ConfiguracionDTO setCorreo(CorreoDTO correo)
  {
    this.correo = correo;
    return this;
  }

  public DatosPSE getDatosPSE()
  {
    return datosPSE;
  }

  public ConfiguracionDTO setDatosPSE(DatosPSE datosPSE)
  {
    this.datosPSE = datosPSE;
    return this;
  }

  public EmpresaDTO getEmpresa()
  {
    return empresa;
  }

  public ConfiguracionDTO setEmpresa(EmpresaDTO empresa)
  {
    this.empresa = empresa;
    return this;
  }

  public InfoRecaudoDTO getRecaudo()
  {
    return recaudo;
  }

  public ConfiguracionDTO setRecaudo(InfoRecaudoDTO recaudo)
  {
    this.recaudo = recaudo;
    return this;
  }

  public ProcesoDTO getProceso()
  {
    return proceso;
  }

  public ConfiguracionDTO setProceso(ProcesoDTO proceso)
  {
    this.proceso = proceso;
    return this;
  }

}
