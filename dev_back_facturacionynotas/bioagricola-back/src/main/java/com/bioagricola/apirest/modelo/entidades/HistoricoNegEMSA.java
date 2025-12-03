package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name = "histneg_historico_negativos_emsa", schema = "aseo")
public class HistoricoNegEMSA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "histneg_idregistro", nullable = false)
    private Long id;

    @Column(name = "histneg_nombre_archivo", nullable = false)
    private String filename;

    @Column(name = "histneg_estado", nullable = false)
    private String state;

    @Column(name = "histneg_fecha_registro", nullable = false)
    private Date creationDate;

    @Column(name = "histneg_fecha_auditoria", nullable = false)
    private Date auditDate;

    public HistoricoNegEMSA() {
    }

    public HistoricoNegEMSA(String filename, String state, Date creationDate) {
        this.filename = filename;
        this.state = state;
        this.creationDate = creationDate;
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

    public Date getAuditDate() {
        return auditDate;
    }

    public void setAuditDate(Date auditDate) {
        this.auditDate = auditDate;
    }
}
