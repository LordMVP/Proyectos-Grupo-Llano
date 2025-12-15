package com.bioagricola.apirest.modelo.entidades.aseo;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.exception.DataException;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "apr_dist_periodo_recaudo",schema = "aseo")
public class AprDistPeriodoRecaudo {

    @Id
    @Column(name = "rec_fecpago")
    private Date recFecpago;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoProcesado estado;

    @Column(name = "aprcons_ideregistr")
    private Long aprconsIderegistr;
}
