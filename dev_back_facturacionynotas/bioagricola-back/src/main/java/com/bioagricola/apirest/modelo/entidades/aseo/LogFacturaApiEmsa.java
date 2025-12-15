package com.bioagricola.apirest.modelo.entidades.aseo;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import org.hibernate.annotations.CreationTimestamp;

/*
 * @author Yoner Silva
 */
@Data
@Entity
@Table(name = "log_factura_api_emsa", schema = "aseo")
public class LogFacturaApiEmsa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long log_ideregistro;
    
    @Column(name = "fecha", nullable = false)
    @CreationTimestamp
    private Timestamp fecha;

    @Column(name = "codigo_bio", length = 20)
    private String codigo_bio;

    @Column(name = "codigo_emsa", length = 20, nullable = false)
    private String codigo_emsa;

    @Column(name = "codigo_ean", length = 60)
    private String codigo_ean;
    
    @Column(name = "num_factura")
    private Long num_factura;
    
    @Column(name = "valor_anterior", precision = 20, scale = 7)
    private BigDecimal valor_anterior;

    @Column(name = "valor_generado", precision = 20, scale = 7)
    private BigDecimal valor_generado;

    @Column(name = "usu_ideregistro", nullable = false)
    private Long usu_ideregistro;
    
    @Column(name = "log_tipo", length = 10)
    private String log_tipo;
}