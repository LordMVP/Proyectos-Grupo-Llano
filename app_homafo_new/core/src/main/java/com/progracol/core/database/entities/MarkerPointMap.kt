package com.progracol.core.database.entities

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDate
import javax.annotation.Nullable


@Entity(tableName = "marker_point_map")
data class MarkerPointMap(
    @PrimaryKey(autoGenerate = true) var id: Long? = null,

    @ColumnInfo(name = "name")
    var name: String?,

    @ColumnInfo(name = "longitude")
    var longitude: String?,

    @ColumnInfo(name = "latitude")
    var latitude: String?

)