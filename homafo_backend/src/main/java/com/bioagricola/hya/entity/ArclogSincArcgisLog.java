package com.bioagricola.hya.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "arclog_sincarcgislog", catalog= SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArclogSincArcgisLog {

    @Id
    @Column(name = "objectid", nullable = false)
    private Integer objectid;

    @Column(name = "codbioagricola")
    private String codbioagricola;

    @Column(name = "success")
    private Boolean success;

    @Column(name = "synchronized_at", columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    private LocalDateTime synchronizedAt;

}
