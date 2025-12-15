package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "prl_liquidacionapro", schema = "aseo")
@NamedQuery(name = "PrlLiquidacionapro.findAll", query = "SELECT p FROM PrlLiquidacionapro p")
public class PrlLiquidacionapro implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prl_ideregistro")
    private Integer prlIderegistro;

    @Column(name = "prl_usu_ideregistro")
    private Integer prlUsuIderegistro;

    @Column(name = "prl_fecha_ejecucion")
    private Date prlFechaEjecucion;

    @Column(name = "prl_fecha_aprobacion")
    private Date prlFechaAprobacion;

    @Column(name = "prl_estado")
    private String prlEstado;
    
    @Column(name = "maprc_ideregistr")
    private Long maprcIderegistr;
    
    @Column(name = "prl_anio")
    private Integer prlAnio;

}
