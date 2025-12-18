package com.progracol.core.database.entities

import androidx.annotation.NonNull
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.progracol.core.database.BaseEntity

@Entity(tableName = "param_capacity_concept")
data class ParamCapacityConcept(
    @NonNull @PrimaryKey(autoGenerate = false) override var code: String = "",
    @ColumnInfo(name = "name") override var name: String? = ""
) : BaseEntity()