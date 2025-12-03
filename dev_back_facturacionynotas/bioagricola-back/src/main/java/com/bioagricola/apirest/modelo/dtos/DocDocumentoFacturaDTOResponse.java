package com.bioagricola.apirest.modelo.dtos;

import java.util.HashMap;
import java.util.Map;

/**
 * @author nagredo
 * @project dev_back_facturacionynotas
 * @class DocDocumentoFacturaDTOResponse
 */
public class DocDocumentoFacturaDTOResponse {
    private Long year;
    private String status;
    private String alternateCompany;
    private String period;
    private Long idFatherInvoice;
    private Long parentDocument;
    private String noteDocument;
    private String typeDocument;
    private Long note;
    private Double parentFeeValue;
    private Double valueNote;
    private Double valueFinal;
    private String reasonNote;
    private String observationNote;
    private Map<String, Double> documentDetail;

    public DocDocumentoFacturaDTOResponse() {
        this.documentDetail = new HashMap<>();
    }

    public Long getYear() {
        return year;
    }

    public void setYear(Long year) {
        this.year = year;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAlternateCompany() {
        return alternateCompany;
    }

    public void setAlternateCompany(String alternateCompany) {
        this.alternateCompany = alternateCompany;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Long getIdFatherInvoice() {
        return idFatherInvoice;
    }

    public void setIdFatherInvoice(Long idFatherInvoice) {
        this.idFatherInvoice = idFatherInvoice;
    }

    public Long getParentDocument() {
        return parentDocument;
    }

    public void setParentDocument(Long parentDocument) {
        this.parentDocument = parentDocument;
    }

    public String getNoteDocument() {
        return noteDocument;
    }

    public void setNoteDocument(String noteDocument) {
        this.noteDocument = noteDocument;
    }

    public String getTypeDocument() {
        return typeDocument;
    }

    public void setTypeDocument(String typeDocument) {
        this.typeDocument = typeDocument;
    }

    public Long getNote() {
        return note;
    }

    public void setNote(Long note) {
        this.note = note;
    }

    public Double getParentFeeValue() {
        return parentFeeValue;
    }

    public void setParentFeeValue(Double parentFeeValue) {
        this.parentFeeValue = parentFeeValue;
    }

    public Double getValueNote() {
        return valueNote;
    }

    public void setValueNote(Double valueNote) {
        this.valueNote = valueNote;
    }

    public Double getValueFinal() {
        return valueFinal;
    }

    public void setValueFinal(Double valueFinal) {
        this.valueFinal = valueFinal;
    }

    public String getReasonNote() {
        return reasonNote;
    }

    public void setReasonNote(String reasonNote) {
        this.reasonNote = reasonNote;
    }

    public String getObservationNote() {
        return observationNote;
    }

    public void setObservationNote(String observationNote) {
        this.observationNote = observationNote;
    }

    public Map<String, Double> getDocumentDetail() {
        return documentDetail;
    }

    public void setDocumentDetail(Map<String, Double> documentDetail) {
        this.documentDetail = documentDetail;
    }
}
