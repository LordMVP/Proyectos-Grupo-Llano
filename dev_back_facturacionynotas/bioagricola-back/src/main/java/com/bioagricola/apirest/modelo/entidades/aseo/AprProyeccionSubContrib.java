package com.bioagricola.apirest.modelo.entidades.aseo;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "apr_proyeccion_sub_contrib", schema = "aseo")
public class AprProyeccionSubContrib {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer anio;

    private Short estrato;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal valor;

    @Column(name = "es_actual", nullable = false)
    private Boolean esActual = true;

    @Column(name = "fue_actualizado", nullable = false)
    private Boolean fueActualizado = false;

    @Column(name = "creado_por", nullable = false)
    private String creadoPor;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "actualizado_por")
    private String actualizadoPor;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
}