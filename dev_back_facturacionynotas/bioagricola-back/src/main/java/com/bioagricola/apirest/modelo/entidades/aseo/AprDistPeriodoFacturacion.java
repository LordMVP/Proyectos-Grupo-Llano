package com.bioagricola.apirest.modelo.entidades.aseo;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "apr_dist_periodo_facturacion",schema = "aseo")
public class AprDistPeriodoFacturacion {

    @Id
    @Column(name = "per_facturacion")
    private Integer perFacturacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoProcesado estado;


    @Column(name = "aprcons_ideregistr")
    private Long aprconsIderegistr;
}
