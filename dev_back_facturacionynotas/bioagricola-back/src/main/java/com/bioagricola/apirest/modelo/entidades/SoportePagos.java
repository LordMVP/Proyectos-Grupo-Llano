package com.bioagricola.apirest.modelo.entidades;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "sop_soportepagos", schema = "aseo")
public class SoportePagos {
    @Id
    @SequenceGenerator(name = "sq_sop_ideregistro", sequenceName = "sq_sop_ideregistro", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sq_sop_ideregistro")
    @Column(name = "sop_ideregistro")
    private Integer sopIderegistro;

    @Column(name = "sop_fecha_giro")
    private Date sopFechaGiro;

    @Column(name = "per_facturacion")
    private Integer perFacturacion;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "sop_fecharegistro")
    private Date sopFechaRegistro;

    @Column(name = "sop_observacion")
    private String sopObservacion;

    @Column(name = "sop_id_acta")
    private Integer sopIdActa;

    @Column(name = "maprc_ideregistr")
    private Integer maprcIderegistr;

    @Column(name = "sop_fecha_comite")
    private Date sopFechaComite;

}
