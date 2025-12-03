package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import uk.co.jemos.podam.annotations.PodamExclude;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "ter_tercero", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class TerTercero{

	@Id
	 @GeneratedValue(strategy=GenerationType.IDENTITY)
	 @Column(name="ter_ideregistro", nullable=false)	
    private Long  terIderegistro ;  
    @NotNull
    @Column(name="ter_documento", nullable=false, length=20)
    private String terDocumento ;

    @NotNull
    @Column(name="ter_nombre", nullable=false, length=50)
    private String terNombre ;

    @NotNull
    @Column(name="ter_apellido", nullable=false, length=50)
    private String terApellido ;

    @NotNull
    @Column(name="ter_nomcompleto", nullable=false, length=101)
    private String terNomcompleto ;

    @NotNull
    @Column(name="ter_sexo", nullable=false, length=1)
    private String terSexo ;

    @NotNull
    @Column(name="ter_telcelular", nullable=false, length=20)
    private String terTelcelular ;

    @NotNull
    @Column(name="ter_telfijo", nullable=false, length=20)
    private String terTelfijo ;

    @NotNull
    @Column(name="est_tiptercero", nullable=false)
    private Long estTiptercero ;

    @NotNull
    @Column(name="uni_tiptercero", nullable=false)
    private Long uniTiptercero ;


    @Column(name="ter_correo", length=250)
    private String terCorreo ;

    @NotNull
    @Column(name="usu_ideregistro", nullable=false)
    private Long usuIderegistro ;


    @Column(name="ciudad_cod", length=5)
    private String ciudadCod ;


    @Column(name="ter_docexpedicion")
    private Timestamp terDocexpedicion ;

    @NotNull
    @Column(name="uni_tipidentifica", nullable=false)
    private Long uniTipidentifica ;


    @Column(name="ter_fecnacimiento")
    private Timestamp terFecnacimiento ;


    @Column(name="ter_digverificacion")
    private Integer terDigverificacion ;


    @Type(type = "jsonb")
    @Column(name="ter_infoadicional", columnDefinition = "jsonb")
    private Map<String, Object> terInfoadicional ;

    @OneToMany(mappedBy = "terTercerodsusDetsuscripTerIderegistroFkey", fetch = FetchType.LAZY)
    @PodamExclude
    @JsonIgnore
    private List<DsusDetsuscrip> dsusDetsuscripTerIderegistroFkeyes;
	
}
