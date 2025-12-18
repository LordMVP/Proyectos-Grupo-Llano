package com.progracol.core.database.entities

import androidx.annotation.NonNull
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Ignore
import androidx.room.PrimaryKey

@Entity(tableName = "visit_concept")
data class VisitConcept(

    @NonNull @PrimaryKey(autoGenerate = false)
    var id: Long?,

    @ColumnInfo(name = "concept" )
    var concept: String? = null,

    @ColumnInfo(name = "concept_code" )
    var conceptCode: Int? = null,

    @ColumnInfo(name = "quantity" )
    var quantity: Double? = null,

    @ColumnInfo(name = "volume" )
    var volume: Double? = null,

    @ColumnInfo(name = "weight" )
    var weight: Double? = null,

    @ColumnInfo(name = "visit_id")
    var visitId: Long? = null,

    @ColumnInfo(name = "observation" )
    var note: String? = null,

)
{
    @Ignore
    fun toVisitConceptObject(): Map<String, Any?> {
        return mapOf(
            "uniConceptoId" to conceptCode,
            "dcvaCantidadconcepto" to quantity,
            "dcvaVolumenaforo" to volume,
            "dcvaObservaciones" to note,
            "dcvaPesoaforo" to weight
        )
    }

}
