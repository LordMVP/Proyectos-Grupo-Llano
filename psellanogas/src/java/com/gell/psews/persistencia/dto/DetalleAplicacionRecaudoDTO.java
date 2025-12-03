/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto;

/**
 *
 * @author USUARIO
 */
public class DetalleAplicacionRecaudoDTO {
    
private int   dwre_ideregistro;
private int   uni_aplicarecaudo;
private double dwra_valor;
private int ppa_ideregistro;
private String   dwra_idfacturas; // id facturas
private String   dwra_idfacturasd; // id del detalle d facturas
private String  dwra_estaplicacion;

    /**
     * @return the dwre_ideregistro
     */
    public int getDwre_ideregistro() {
        return dwre_ideregistro;
    }

    /**
     * @param dwre_ideregistro the dwre_ideregistro to set
     */
    public void setDwre_ideregistro(int dwre_ideregistro) {
        this.dwre_ideregistro = dwre_ideregistro;
    }

    /**
     * @return the uni_aplicarecaudo
     */
    public int getUni_aplicarecaudo() {
        return uni_aplicarecaudo;
    }

    /**
     * @param uni_aplicarecaudo the uni_aplicarecaudo to set
     */
    public void setUni_aplicarecaudo(int uni_aplicarecaudo) {
        this.uni_aplicarecaudo = uni_aplicarecaudo;
    }

    /**
     * @return the dwra_valor
     */
    public double getDwra_valor() {
        return dwra_valor;
    }

    /**
     * @param dwra_valor the dwra_valor to set
     */
    public void setDwra_valor(double dwra_valor) {
        this.dwra_valor = dwra_valor;
    }

    /**
     * @return the ppa_ideregistro
     */
    public int getPpa_ideregistro() {
        return ppa_ideregistro;
    }

    /**
     * @param ppa_ideregistro the ppa_ideregistro to set
     */
    public void setPpa_ideregistro(int ppa_ideregistro) {
        this.ppa_ideregistro = ppa_ideregistro;
    }

    /**
     * @return the dwra_idfacturas
     */
    public String getDwra_idfacturas() {
        return dwra_idfacturas;
    }

    /**
     * @param dwra_idfacturas the dwra_idfacturas to set
     */
    public void setDwra_idfacturas(String dwra_idfacturas) {
        this.dwra_idfacturas = dwra_idfacturas;
    }

    /**
     * @return the dwra_estaplicacion
     */
    public String getDwra_estaplicacion() {
        return dwra_estaplicacion;
    }

    /**
     * @param dwra_estaplicacion the dwra_estaplicacion to set
     */
    public void setDwra_estaplicacion(String dwra_estaplicacion) {
        this.dwra_estaplicacion = dwra_estaplicacion;
    }

    /**
     * @return the dwra_idfacturasd
     */
    public String getDwra_idfacturasd() {
        return dwra_idfacturasd;
    }

    /**
     * @param dwra_idfacturasd the dwra_idfacturasd to set
     */
    public void setDwra_idfacturasd(String dwra_idfacturasd) {
        this.dwra_idfacturasd = dwra_idfacturasd;
    }


    
}
