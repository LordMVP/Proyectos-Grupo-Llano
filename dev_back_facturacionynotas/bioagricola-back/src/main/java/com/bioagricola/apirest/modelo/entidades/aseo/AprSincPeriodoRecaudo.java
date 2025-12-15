package com.bioagricola.apirest.modelo.entidades.aseo;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "apr_sinc_periodo_recaudo",schema = "aseo")
public class AprSincPeriodoRecaudo {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "fecha_pago")
    private Date fechaPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoProcesado estado;
}
