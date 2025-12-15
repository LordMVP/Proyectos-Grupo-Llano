package com.bioagricola.apirest.aprovechamiento.dto;

import java.util.List;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ConsolidationDto
 */
public class ConsolidationDto {
    List<PercentageUserDto> invoices;

    public List<PercentageUserDto> getInvoices() {
        return invoices;
    }

    public void setInvoices(List<PercentageUserDto> invoices) {
        this.invoices = invoices;
    }
}
