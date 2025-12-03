/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto;

import java.util.ArrayList;

/**
 *
 * @author USUARIO
 */
public class PagoAdicionalDTO {
    private String documento;
      private float saldo ;
      private String funcion;
      private String filtro;
      
      private Integer empresa;
      
      private int tipo;
      
      private String pagoObligatorio;
      private String ppa_ideregistro;
      private ArrayList<String> facturas;
      
      
      
      

    /**
     * @return the documento
     */
    public String getDocumento() {
        return documento;
    }

    /**
     * @param documento the documento to set
     */
    public void setDocumento(String documento) {
        this.documento = documento;
    }

    /**
     * @return the saldo
     */
    public float getSaldo() {
        return saldo;
    }

    /**
     * @param saldo the saldo to set
     */
    public void setSaldo(float saldo) {
        this.saldo = saldo;
    }

    /**
     * @return the pagoObligatorio
     */
    public String getPagoObligatorio() {
        return pagoObligatorio;
    }

    /**
     * @param pagoObligatorio the pagoObligatorio to set
     */
    public void setPagoObligatorio(String pagoObligatorio) {
        this.pagoObligatorio = pagoObligatorio;
    }

    /**
     * @return the funcion
     */
    public String getFuncion() {
        return funcion;
    }

    /**
     * @param funcion the funcion to set
     */
    public void setFuncion(String funcion) {
        this.funcion = funcion;
    }

    /**
     * @return the filtro
     */
    public String getFiltro() {
        return filtro;
    }

    /**
     * @param filtro the filtro to set
     */
    public void setFiltro(String filtro) {
        this.filtro = filtro;
    }

    /**
     * @return the facturas
     */
    public ArrayList<String> getFacturas() {
        return facturas;
    }

    /**
     * @param facturas the facturas to set
     */
    public void setFacturas(ArrayList<String> facturas) {
        this.facturas = facturas;
    }

    /**
     * @return the ppa_ideregistro
     */
    public String getPpa_ideregistro() {
        return ppa_ideregistro;
    }

    /**
     * @param ppa_ideregistro the ppa_ideregistro to set
     */
    public void setPpa_ideregistro(String ppa_ideregistro) {
        this.ppa_ideregistro = ppa_ideregistro;
    }

    public void setFacturas(String[] facturasSeleccionada) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    /**
     * @return the tipo
     */
    public int getTipo() {
        return tipo;
    }

    /**
     * @param tipo the tipo to set
     */
    public void setTipo(int tipo) {
        this.tipo = tipo;
    }

    /**
     * @return the empresa
     */
    public Integer getEmpresa() {
        return empresa;
    }

    /**
     * @param empresa the empresa to set
     */
    public void setEmpresa(Integer empresa) {
        this.empresa = empresa;
    }
    

}
