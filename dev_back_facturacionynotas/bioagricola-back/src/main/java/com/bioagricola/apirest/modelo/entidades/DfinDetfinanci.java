package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "dfin_detfinanci")
public class DfinDetfinanci implements Serializable {

    @Id
    @Column(name="dfin_ideregistr")
    private Long dfinIderegistr;

    @Column(name="fin_ideregistro")
    private Long finIderegistro;

    @Column(name="dfac_ideregistr")
    private Long dfacIderegistr;

    @Column(name="fac_ideregistro")
    private Long facIderegistro;

    public Long getDfinIderegistr() {
        return dfinIderegistr;
    }

    public void setDfinIderegistr(Long dfinIderegistr) {
        this.dfinIderegistr = dfinIderegistr;
    }

    public Long getFinIderegistro() {
        return finIderegistro;
    }

    public void setFinIderegistro(Long finIderegistro) {
        this.finIderegistro = finIderegistro;
    }

    public Long getDfacIderegistr() {
        return dfacIderegistr;
    }

    public void setDfacIderegistr(Long dfacIderegistr) {
        this.dfacIderegistr = dfacIderegistr;
    }

    public Long getFacIderegistro() {
        return facIderegistro;
    }

    public void setFacIderegistro(Long facIderegistro) {
        this.facIderegistro = facIderegistro;
    }
}
