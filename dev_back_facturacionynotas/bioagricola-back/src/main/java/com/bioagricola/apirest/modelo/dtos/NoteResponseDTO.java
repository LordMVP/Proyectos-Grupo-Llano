package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;
import java.util.Date;

public class NoteResponseDTO {
    private int quantity;
    private BigDecimal total;
    private String concept;
    private Date appliedDate;

    public NoteResponseDTO(int quantity, BigDecimal total, String concept, Date appliedDate) {
        this.quantity = quantity;
        this.total = total;
        this.concept = concept;
        this.appliedDate = appliedDate;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getConcept() {
        return concept;
    }

    public void setConcept(String concept) {
        this.concept = concept;
    }

    public Date getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(Date appliedDate) {
        this.appliedDate = appliedDate;
    }
}
