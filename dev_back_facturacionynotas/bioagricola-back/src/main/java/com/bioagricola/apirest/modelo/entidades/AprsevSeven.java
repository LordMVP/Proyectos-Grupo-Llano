package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 *
 * @author Yoner Silva
 */
@Entity
@Table(name="aprsev_seven", schema="aseo")
@Data
public class AprsevSeven implements Serializable {
            
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aprsev_ideregistro")
    private Long aprsev_ideregistro;
    
    @Column(name = "mes")
    private Integer mes;
    
    @Column(name = "ano")
    private Integer ano;
    
    @Column(name = "valor_proyectado_aprov")
    private BigDecimal valor_proyectado_aprov;
    
    @Column(name = "valor_ejecutado_aprov")
    private BigDecimal valor_ejecutado_aprov;
    
    @Column(name = "valor_proyectado_iat")
    private BigDecimal valor_proyectado_iat;
    
    @Column(name = "valor_ejecutado_iat")
    private BigDecimal valor_ejecutado_iat;
    
    @Column(name = "create_at")
    @CreationTimestamp
    private Timestamp create_at;
    
    @Column(name = "update_at")
    @UpdateTimestamp
    private Timestamp update_at;
    
    @Column(name = "emp_ideregistro")
    private Integer emp_ideregistro;
}
