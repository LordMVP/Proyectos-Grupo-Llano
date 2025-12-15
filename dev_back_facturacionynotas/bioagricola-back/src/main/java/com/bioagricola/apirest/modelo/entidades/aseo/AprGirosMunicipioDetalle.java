package com.bioagricola.apirest.modelo.entidades.aseo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.math.BigDecimal;

@Data
@ToString(exclude = "girosMunicipio")
@Entity
@Table(name = "apr_giros_municipio_detalle", schema = "aseo")
public class AprGirosMunicipioDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "apr_giros_municipio_detalle_seq")
    @SequenceGenerator(name = "apr_giros_municipio_detalle_seq",
                      sequenceName = "aseo.apr_giros_municipio_detalle_id_detalle_seq",
                      allocationSize = 1)
    @Column(name = "id_detalle")
    private Integer idDetalle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_giro", nullable = false)
    @JsonBackReference
    private AprGirosMunicipio girosMunicipio;

    @Column(name = "mes_anio_pago", nullable = false)
    private Integer mesAnioPago; // Formato YYYYMM

    @Column(name = "valor_girado", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorGirado;
}
