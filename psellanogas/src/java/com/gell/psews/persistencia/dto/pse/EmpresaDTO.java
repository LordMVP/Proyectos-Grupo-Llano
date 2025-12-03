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
public class EmpresaDTO
{

  /**
   * Identificador de seven para la empresa de llanogas o la empresa de cusiana
   */
  private int idEmpresaPrincipal;
  /**
   * nit de la empresa principal (Llanogas o cusiana)
   */
  private String nitEmpresaPrincipal;

  private String urlHabeasData;
  
  private String urlPoliticaHabeas;

  private int idEmpresaSegunda;
  private String nitEmpresaSegunda;

  public int getIdEmpresaPrincipal()
  {
    return idEmpresaPrincipal;
  }

  public EmpresaDTO setIdEmpresaPrincipal(int idEmpresaPrincipal)
  {
    this.idEmpresaPrincipal = idEmpresaPrincipal;
    return this;
  }

  public String getNitEmpresaPrincipal()
  {
    return nitEmpresaPrincipal;

  }

  public EmpresaDTO setNitEmpresaPrincipal(String nitEmpresaPrincipal)
  {
    this.nitEmpresaPrincipal = nitEmpresaPrincipal;
    return this;
  }

  public String getUrlHabeasData()
  {
    return urlHabeasData;
  }

  public EmpresaDTO setUrlHabeasData(String urlHabeasData)
  {
    this.urlHabeasData = urlHabeasData;
    return this;
  }

  public String getUrlPoliticaHabeas() {
    return urlPoliticaHabeas;
  }

  public void setUrlPoliticaHabeas(String urlPoliticaHabeas) {
    this.urlPoliticaHabeas = urlPoliticaHabeas;
  }

  public int getIdEmpresaSegunda()
  {
    return idEmpresaSegunda;
  }

  public EmpresaDTO setIdEmpresaSegunda(int idEmpresaSegunda)
  {
    this.idEmpresaSegunda = idEmpresaSegunda;
    return this;
  }

  public String getNitEmpresaSegunda()
  {
    return nitEmpresaSegunda;
  }

  public EmpresaDTO setNitEmpresaSegunda(String nitEmpresaSegunda)
  {
    this.nitEmpresaSegunda = nitEmpresaSegunda;
    return this;
  }

}
