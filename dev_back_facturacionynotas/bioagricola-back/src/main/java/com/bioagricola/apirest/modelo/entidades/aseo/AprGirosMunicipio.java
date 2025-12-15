package com.bioagricola.apirest.modelo.entidades.aseo;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@ToString(exclude = "detalles")
@Entity
@Table(name = "apr_giros_municipio", schema = "aseo")
public class AprGirosMunicipio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_giro")
    private Integer idGiro;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDate fechaPago;

    @Column(name = "total_giro_municipio", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalGiroMunicipio;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "fecha_edicion")
    private LocalDateTime fechaEdicion = LocalDateTime.now();

    @Column(name = "usuario_registro", length = 50)
    private String usuarioRegistro;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @OneToMany(mappedBy = "girosMunicipio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<AprGirosMunicipioDetalle> detalles;

}
