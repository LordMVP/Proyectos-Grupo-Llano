package com.progracol.core.database.entities

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDate
import javax.annotation.Nullable


@Entity(tableName = "user_map")
data class UserMap(
    @PrimaryKey(autoGenerate = true) var id: Long? = null,

    @ColumnInfo(name = "name")
    var name: String?,

    @ColumnInfo(name = "path")
    var path: String?,

    @ColumnInfo(name = "date")
    var date: String?,


    )