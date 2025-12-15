package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "impneg_importacion_negativos_emsa", schema = "aseo")
public class ImportacionNegEMSA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "impneg_idregistro", nullable = false)
    private Long id;

    @Column(name = "impneg_nombre_archivo", nullable = false)
    private String filename;

    @Column(name = "impneg_estado", nullable = false)
    private String state;

    @Column(name = "impneg_fecha_registro", nullable = false)
    private Date creationDate;
    
    @Column(name = "impneg_fecha_archivo")
    private Date creationDateFile;

    @Transient
    private List<ImportacionNegTemp> tempDetails;

    @Transient
    private List<ImportacionNegDetalle> details;

    public ImportacionNegEMSA() {
    }

    public ImportacionNegEMSA(String filename, String state, Date creationDate) {
        this.filename = filename;
        this.state = state;
        this.creationDate = creationDate;
    }

    public ImportacionNegEMSA(String filename, String state, Date creationDate, Date creationDateFile) {
        this.filename = filename;
        this.state = state;
        this.creationDate = creationDate;
        this.creationDateFile = creationDateFile;
    }

    public Date getCreationDateFile() {
        return creationDateFile;
    }

    public void setCreationDateFile(Date creationDateFile) {
        this.creationDateFile = creationDateFile;
    }   

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public List<ImportacionNegDetalle> getDetails() {
        return details;
    }

    public void setDetails(List<ImportacionNegDetalle> details) {
        this.details = details;
    }

    public List<ImportacionNegTemp> getTempDetails() {
        return tempDetails;
    }

    public void setTempDetails(List<ImportacionNegTemp> tempDetails) {
        this.tempDetails = tempDetails;
    }
}
