package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "cont_contactotercero", catalog = SchemaConstants.ASEO, schema = SchemaConstants.ASEO)
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class ContContactotercero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cont_ideregistro", nullable = false)
    private Long contIderegistro;

    @ManyToOne
    @NonNull
    @JoinColumn(name = "ter_ideregistro", referencedColumnName = "ter_ideregistro", nullable = false)
    private TerTercero terTercero;

    @ManyToOne
    @NonNull
    @JoinColumn(name = "uni_tipcontactotercero", referencedColumnName = "uni_ideregistro", nullable = false)
    private UniUnidad uniUnidad;

    @NonNull
    @Column(name = "cont_valor", nullable = false)
    private String contValor;
}
