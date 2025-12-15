package com.bioagricola.apirest.aprovechamiento.dto;

import java.util.List;

public class ValueChangeDto <T> {
    private List<T> objectChange;
    private Double grandTotal;
    private Long idThirdParty;
    private String use; // aprovechador
    private String nit;

    public String getNit() {
        return nit;
    }

    public void setNit(String nit) {
        this.nit = nit;
    }

    public Double getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(Double grandTotal) {
        this.grandTotal = grandTotal;
    }

    public Long getIdThirdParty() {
        return idThirdParty;
    }

    public void setIdThirdParty(Long idThirdParty) {
        this.idThirdParty = idThirdParty;
    }

    public String getUse() {
        return use;
    }

    public void setUse(String use) {
        this.use = use;
    }

    public List<T> getObjectChange() {
        return objectChange;
    }

    public void setObjectChange(List<T> objectChange) {
        this.objectChange = objectChange;
    }
}
