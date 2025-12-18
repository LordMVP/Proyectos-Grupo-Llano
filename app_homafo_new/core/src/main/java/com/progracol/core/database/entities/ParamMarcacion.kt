package com.progracol.core.database.entities

import androidx.annotation.NonNull
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.progracol.core.database.BaseEntity
import org.jetbrains.annotations.NotNull

@Entity(tableName = "param_marcacion")
data class ParamMarcacion(
    @NonNull @PrimaryKey(autoGenerate = false) override var code : String = "",
    @ColumnInfo(name = "name") override var name : String? = "",
    @ColumnInfo(name = "orden") var orden: Int
): BaseEntity()
