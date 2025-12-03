package com.bioagricola.hya.entity;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
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
@Table(name = "tmp_dsnov_dsusnovedad", catalog= SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class TmpDsusNovedad {

    @Id
    @Column(name="dsnov_ideregistro")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dsnovIderegistro;

    @Transient
    private String dsusPcodigo;

    @Column(name="dsus_ideregistro")
    private Long dsusIderegistro;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne
    @JoinColumn(name = "dsus_ideregistro", referencedColumnName = "dsus_ideregistr", insertable = false, updatable = false)
    private DsusDetsuscrip dsusDetsuscrip;

    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Column(name="dsnov_novfecha")
    private LocalDate dsnovNovFecha;

    @Column(name="dsnov_numpqr")
    private String dsnovNumpqr;

    @Column(name="uni_novisita")
    private Long uniNovisita;

    @Column(name="uni_novfactura")
    private Long uniNovfactura;

    @Column(name="uni_tipsolicitud")
    private Long uniTipSolicitud;

    @Type(type = "json")
    @Column(name = "uni_novedades", columnDefinition = "jsonb")
    private List<Long> uniNovedades;

    @Column(name="dsnov_observaciones")
    private String dsnovObservaciones;

    @Column(name="usu_ideregistro")
    private Long usuIderegistro;

    @Type(type = "json")
    @Column(name = "dsnov_imagenesaz", columnDefinition = "jsonb")
    private List<ArchivoDTO> dsnovImagenesAz;

    @Column(name="dsnov_estado")
    private Character dsnovEstado;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Column(name="dsnov_fecha")
    private LocalDateTime dsnovFecha;

}
