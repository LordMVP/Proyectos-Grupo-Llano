package com.bioagricola.apirest.modelo.dtos.payload;

import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_facturacionynotas
 * @class FacFacturaPayload
 */
public class FacFacturaPayload {
    Date dateInit;
    Date dateEnd;
    Long dsusId;
    String codBefore;
    Long numInvoice;

    public FacFacturaPayload() {
    }

    public FacFacturaPayload(Date dateInit, Date dateEnd, Long dsusId, String codBefore, Long numInvoice) {
        this.dateInit = dateInit;
        this.dateEnd = dateEnd;
        this.dsusId = dsusId;
        this.codBefore = codBefore;
        this.numInvoice = numInvoice;
    }

    public Date getDateInit() {
        return dateInit;
    }

    public void setDateInit(Date dateInit) {
        this.dateInit = dateInit;
    }

    public Date getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(Date dateEnd) {
        this.dateEnd = dateEnd;
    }

    public Long getDsusId() {
        return dsusId;
    }

    public void setDsusId(Long dsusId) {
        this.dsusId = dsusId;
    }

    public String getCodBefore() {
        return codBefore;
    }

    public void setCodBefore(String codBefore) {
        this.codBefore = codBefore;
    }

    public Long getNumInvoice() {
        return numInvoice;
    }

    public void setNumInvoice(Long numInvoice) {
        this.numInvoice = numInvoice;
    }
}