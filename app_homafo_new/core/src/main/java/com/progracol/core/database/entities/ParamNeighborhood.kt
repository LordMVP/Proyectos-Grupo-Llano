package com.progracol.core.database.entities

import androidx.annotation.NonNull
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.progracol.core.database.BaseEntity

@Entity(tableName = "param_neighborhood")
data class ParamNeighborhood(
    @NonNull @PrimaryKey(autoGenerate = false) override var code: String = "",
    @ColumnInfo(name = "name") override var name : String? = ""
) : BaseEntity()