package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "pro_propiedad", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
public class ProPropiedad {

	@Id
	 @GeneratedValue(strategy=GenerationType.IDENTITY)
	 @Column(name="pro_ideregistro", nullable=false)	
    private Long  proIderegistro ;  
    @NotNull
    @Column(name="pro_idepropieda", nullable=false, length=20)
    private String proIdepropieda ;

    @NotNull
    @Column(name="pro_estado", nullable=false, length=1)
    private String proEstado ;

    @NotNull
    @Column(name="pro_descripcion", nullable=false, length=30)
    private String proDescripcion ;

    @NotNull
    @Column(name="pro_direccion", nullable=false, length=200)
    private String proDireccion ;

    @NotNull
    @Column(name="ter_ideregistro", nullable=false)
    private Long  terIderegistro ;

    @NotNull
    @Column(name="uni_tippropieda", nullable=false)
    private Long uniTippropieda ;

    @NotNull
    @Column(name="est_tippropieda", nullable=false)
    private Long estTippropieda ;

    @NotNull
    @Column(name="pro_digitos", nullable=false)
    private Integer proDigitos ;

    @NotNull
    @Column(name="muba_sector", nullable=false)
    private Long mubaSector ;

    @NotNull
    @Column(name="pro_seccion", nullable=false)
    private Integer proSeccion ;

    @NotNull
    @Column(name="pro_manzana", nullable=false)
    private Integer proManzana ;

    @NotNull
    @Column(name="uni_municipio", nullable=false)
    private Long uniMunicipio ;

    @NotNull
    @Column(name="uni_barrio", nullable=false)
    private Long uniBarrio ;

    @NotNull
    @Column(name="pro_altriesgo", nullable=false, length=1)
    private String proAltriesgo ;


    @Column(name="pro_gpslatitud", length=40)
    private String proGpslatitud ;


    @Column(name="pro_gpsaltitud", length=40)
    private String proGpsaltitud ;


    @Column(name="pro_gpslongitud", length=40)
    private String proGpslongitud ;

    @NotNull
    @Column(name="pro_numcatastral", nullable=false, length=50)
    private String proNumcatastral ;

    @NotNull
    @Column(name="pro_zona", nullable=false, length=1)
    private String proZona ;

    @NotNull
    @Column(name="usu_ideregistro", nullable=false)
    private Long usuIderegistro ;


    @Column(name="uni_cmpdireccion")
    private Long uniCmpdireccion ;


    @Column(name="pro_resolcatastral", length=50)
    private String proResolcatastral ;


    @Column(name="pro_fecha")
    private Timestamp proFecha ;


    @Column(name="pro_numcatastralnacional", length=50)
    private String proNumcatastralnacional ;


    @Column(name="uni_tipovivienda")
    private Integer uniTipovivienda ;


    @Column(name="pro_nummatriculainmobiliaria", length=100)
    private String proNummatriculainmobiliaria ;


    @Type(type = "jsonb")
    @Column(name="uni_clasificacionvivienda", columnDefinition = "jsonb")
    private List<Map<String, Object>> uniClasificacionvivienda ;

    @Column(name="pro_idpadre")
    private Long proIdpadre ;

    @Column(name="pro_secuenciaindep")
    private Long proSecuenciaindep ;

    @Transient
    private String uniMunicipioNombre;

    @Transient
    private String uniBarrioNombre;

    @Transient
    private String uniCmpdireccionNombre ;

    @Transient
    private String tippropiedaNombre;

    @Transient
    private boolean hasSubscription;
}
