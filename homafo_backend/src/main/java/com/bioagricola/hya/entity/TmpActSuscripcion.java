package com.bioagricola.hya.entity;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.hya.dto.AlternaDto;
import com.bioagricola.hya.dto.ConLiquidacionDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.gell.estandar.dto.ArchivoDTO;
import com.vladmihalcea.hibernate.type.json.JsonType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import org.springframework.format.annotation.DateTimeFormat;


import javax.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@TypeDefs({
        @TypeDef(name = "json", typeClass = JsonType.class)
})

@Entity
@Table(name = "tmp_actsus_actsuscripcion", catalog= SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class TmpActSuscripcion {

    @Id
    @Column(name="actsus_ideregistro")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long actsusIderegistro;

    @Transient
    private String dsusPcodigo;

    @Column(name="dsus_ideregistro")
    private Long dsusIderegistro;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne
    @JoinColumn(name = "dsus_ideregistro", referencedColumnName = "dsus_ideregistr", insertable = false, updatable = false)
    private DsusDetsuscrip dsusDetsuscrip;
    
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @Column(name = "fecha_encuesta")
    private LocalDate fechaEncuesta;
    
    @Column(name="usu_ideregistro")
    private Long usuIderegistro;
    
    @Column(name="facturacion")
    private String facturacion;
    
    @Column(name="ter_nombre")
    private String terNombre;
    
    @Column(name="ter_tipodocumento")
    private String terTipoDocumento;
    
    @Column(name="ter_documento")
    private String terDocumento;
    
    @Column(name="ter_telcelular")
    private String terTelcelular;
    
    @Column(name="ter_correo")
    private String terCorreo;
    
    @Column(name="pro_direccion")
    private String proDireccion;
    
    @Column(name="pro_zona")
    private String proZona;
    
    @Column(name="muba_sector")
    private Long mubaSector;
    
    @Column(name="pro_seccion")
    private Integer proSeccion;
    
    @Column(name="pro_manzana")
    private Integer proManzana;

    @Column(name="uni_barrio")
    private Long uniBarrio;

    @Column(name="uni_complemento")
    private Long uniComplemento;
    
    @Column(name="nom_establecimiento")
    private String nomEstablecimiento;
    
    @Column(name="uni_actcomercial")
    private Long uniActcomercial;
    
    @Type(type = "json")
    @Column(name = "uni_condspredio", columnDefinition = "jsonb")
    private List<Long> uniCondspredio;
    
    @Column(name="pro_catestrato")
    private Integer proCatestrato;
    
    @Column(name="uni_tipusosus")
    private Long uniTipusosus;

    @Column(name="uni_liquidacion")
    private Long uniLiquidacion;

    @Column(name="pro_numcatastral")
    private String proNumcatastral;
    
    @Column(name="pro_numcatastralnacional")
    private String proNumcatastralnacional;
    
    @Type(type = "json")
    @Column(name = "actsus_alterna", columnDefinition = "jsonb")
    private List<AlternaDto> actsusAlterna;
    
    @Column(name="con_liquidacion")
    @Type(type = "json")
    private ConLiquidacionDto conLiquidacion;
    
    @Column(name="observacion")
    private String observacion;
    
    @Column(name="longitud")
    private String longitud;

    @Column(name="latitud")
    private String latitud;
    
    @Column(name="punto_arcgis")
    private String puntoArcgis;

    @Column(name="actsus_tipo")
    private String actsusTipo;

    @Column(name="actsus_estado")
    private Character actsusEstado;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Column(name="actsus_fecha")
    private LocalDateTime actsusFecha;

    @Type(type = "json")
    @Column(name = "actsus_imagenesaz", columnDefinition = "jsonb")
    private List<ArchivoDTO> actsusImagenesaz;

    @Transient
    private String responseApprove;
    
}
