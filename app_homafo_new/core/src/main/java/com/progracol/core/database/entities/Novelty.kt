package com.progracol.core.database.entities

import androidx.annotation.NonNull
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "novelty")
data class Novelty(

    @NonNull @PrimaryKey(autoGenerate = false)
    var id: Long?,

    @ColumnInfo(name = "subscription_id" )
    var subscriptionId: String?,

    @ColumnInfo(name = "pqr" )
    var pqr: String?,

    @ColumnInfo(name = "novelty_visit" )
    var noveltyVisit: String?,

    @ColumnInfo(name = "novelty_invoice" )
    var noveltyInvoice: String?,

    @ColumnInfo(name = "novelty_type_request" )
    var noveltyTypeRequest: String?,

    @ColumnInfo(name = "novelty_result_type" )
    var noveltyResultType: String?,

    @ColumnInfo(name = "date" )
    var date: String?,

    @ColumnInfo(name = "status" )
    var status: String,

    @ColumnInfo(name = "note" )
    var note: String?

) {


    fun toRequestObject(): Map<String, Any?>  {
        return mapOf(
            "dsusPcodigo" to subscriptionId,
            "dsnovNovFecha" to date,
            "dsnovNumpqr" to pqr,
            "uniNovisita" to (noveltyVisit?.toInt() ?: 0),
            "uniNovfactura" to (noveltyInvoice?.toInt() ?: 0),
            "uniTipSolicitud" to (noveltyTypeRequest?.toInt() ?: 0),
            "uniNovedades" to noveltyResultType?.split(",")?.toList(),
            "dsnovObservaciones" to note
        )
    }

}
