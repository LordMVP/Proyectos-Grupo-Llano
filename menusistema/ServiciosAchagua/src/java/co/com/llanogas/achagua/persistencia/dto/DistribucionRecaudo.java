/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.llanogas.achagua.persistencia.dto;

/**
 *
 * @author hrey
 */
public class DistribucionRecaudo {

    private RecaudoDTO recaudo;
    private long idCiclo;
    private long idPeriodo;
    private long idDistribucionRecaudo;

    public RecaudoDTO getRecaudo() {
        return recaudo;
    }

    public void setRecaudo(RecaudoDTO recaudo) {
        this.recaudo = recaudo;
    }

    public long getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(long idCiclo) {
        this.idCiclo = idCiclo;
    }

    public long getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(long idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    public long getIdDistribucionRecaudo() {
        return idDistribucionRecaudo;
    }

    public void setIdDistribucionRecaudo(long idDistribucionRecaudo) {
        this.idDistribucionRecaudo = idDistribucionRecaudo;
    }

}
