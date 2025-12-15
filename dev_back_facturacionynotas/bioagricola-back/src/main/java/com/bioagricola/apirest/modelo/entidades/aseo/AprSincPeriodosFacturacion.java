package com.bioagricola.apirest.modelo.entidades.aseo;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "apr_sinc_periodos_facturacion",schema = "aseo")
public class AprSincPeriodosFacturacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "per_ideregistro")
    private  Integer perIderegistro;
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_procesado")
    private EstadoProcesado estadoProcesado;
    @Column(name = "per_estado")
    private String perEstado;
    @Column(name = "fecha_registro")
    private Timestamp fechaRegistro;
}