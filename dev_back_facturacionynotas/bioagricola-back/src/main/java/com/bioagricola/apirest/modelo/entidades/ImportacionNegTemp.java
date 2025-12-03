package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "impneg_importacion_negativos_tmp", schema = "aseo",
        uniqueConstraints = {@UniqueConstraint(name = "impneg_importacion_negativos_tmp_un", columnNames = {"impneg_cliente", "impneg_fecha_grabacion", "impneg_valor_pago"})})
public class ImportacionNegTemp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "impnegtmp_idregistro", nullable = false)
    private Long id;

    @Column(name = "impneg_anio", nullable = false)
    private Integer year;

    @Column(name = "impneg_mes", nullable = false)
    private Integer month;

    @Column(name = "impneg_concepto", nullable = false)
    private String concept;

    @Column(name = "impneg_cliente", nullable = false)
    private String client;

    @Column(name = "impneg_fecha_grabacion", nullable = false)
    private Date recordingDate;

    @Column(name = "impneg_banco", nullable = false)
    private String bank;

    @Column(name = "impneg_extacto", nullable = false)
    private String extract;

    @Column(name = "impneg_valor_pago", nullable = false)
    private Double paid;

    @Column(name = "impneg_idregistro")
    private Long idParent;

    public ImportacionNegTemp() {
    }

    public ImportacionNegTemp(Integer year, Integer month, String concept, String client, Date recordingDate, String bank, String extract, Double paid, Long idParent) {
        this.year = year;
        this.month = month;
        this.concept = concept;
        this.client = client;
        this.recordingDate = recordingDate;
        this.bank = bank;
        this.extract = extract;
        this.paid = paid;
        this.idParent = idParent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public String getClient() {
        return client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public String getConcept() {
        return concept;
    }

    public void setConcept(String concept) {
        this.concept = concept;
    }

    public Date getRecordingDate() {
        return recordingDate;
    }

    public void setRecordingDate(Date recordingDate) {
        this.recordingDate = recordingDate;
    }

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public String getExtract() {
        return extract;
    }

    public void setExtract(String extract) {
        this.extract = extract;
    }

    public Double getPaid() {
        return paid;
    }

    public void setPaid(Double paid) {
        this.paid = paid;
    }

    public Long getIdParent() {
        return idParent;
    }

    public void setIdParent(Long id) {
        this.idParent = id;
    }
}
