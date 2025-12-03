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
public class FormaPagoRecaudoDTO {

    private long idFormaPagoRecaudo;
    private RecaudoDTO recaudo;

    public long getIdFormaPagoRecaudo() {
        return idFormaPagoRecaudo;
    }

    public void setIdFormaPagoRecaudo(long idFormaPagoRecaudo) {
        this.idFormaPagoRecaudo = idFormaPagoRecaudo;
    }

    public RecaudoDTO getRecaudo() {
        return recaudo;
    }

    public void setRecaudo(RecaudoDTO recaudo) {
        this.recaudo = recaudo;
    }

}
