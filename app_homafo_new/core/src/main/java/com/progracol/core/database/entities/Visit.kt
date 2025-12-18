package com.progracol.core.database.entities

import androidx.annotation.NonNull
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Ignore
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName

@Entity(tableName = "visit")
data class Visit(

    @NonNull @PrimaryKey(autoGenerate = false) var id : Long?,

    @SerializedName("nameEstablishment")
    @ColumnInfo(name = "establishment")
    var establishment: String? = "",

    @SerializedName("capacityClass")
    @ColumnInfo(name = "visit_class")
    var visitClass: String = "",

    @SerializedName("capacityType")
    @ColumnInfo(name = "visit_type")
    var visitType: String = "",

    @SerializedName("font")
    @ColumnInfo(name = "font")
    var font: String = "",

    @SerializedName("subscription")
    @ColumnInfo(name = "subscription")
    var subscription: String = "",

    @SerializedName("totalVisits")
    @ColumnInfo(name = "total_visit")
    var totalVisits: String = "",

    @SerializedName("madeVisits")
    @ColumnInfo(name = "total_made_visit")
    var madeVisits: String = "",

    @SerializedName("assignmentDate")
    @ColumnInfo(name = "assignment_date")
    var assignmentDate: String = "",

    @SerializedName("subscriptionCodeBio")
    @ColumnInfo(name = "user_code")
    var userCode: String = "",

    @SerializedName("idAforo")
    @ColumnInfo(name = "aforo_id")
    var aforoId: Int = 0,

    @SerializedName("idVisit")
    @ColumnInfo(name = "visit_id")
    var visitId: Int = 0,

    @SerializedName("consecutiveVisit")
    @ColumnInfo(name = "consecutive_visit")
    var consecutiveVisit: Int = 0,

    @SerializedName("caseNumber")
    @ColumnInfo(name = "case_number")
    var caseNumber: String? = "",

    @SerializedName("observation")
    @ColumnInfo(name = "note")
    var note: String? = "",

    @ColumnInfo(name = "neighborhood")
    var neighborhood: String = "",

    @ColumnInfo(name = "address")
    var address: String = "",

    @ColumnInfo(name = "week")
    var week: String = "",

    @ColumnInfo(name = "status")
    var status: String = "",

    @ColumnInfo(name = "updated_time")
    var updatedTime: String? = null,

    @ColumnInfo(name = "cancel_note")
    var cancelNote: String = "",

    @ColumnInfo(name = "file_number")
    var fileNumber: String = "",

    @ColumnInfo(name = "consumer_signature")
    var consumerSignature: String = "",

    @ColumnInfo(name = "consumer_name")
    var consumerName: String = "",

    @ColumnInfo(name = "user_signature")
    var userSignature: String = "",

    @SerializedName("subscriptionCodeBioMulti")
    @ColumnInfo(name = "user_code_multi")
    var userCodeMulti: String = "",


) {

    @Ignore
    var photo: MediaStorage? = null



    fun toCompleteRequestObject(visitConceptObj:  MutableList<Map<String, Any?>>,
                                photosDetailObj:  MutableList<Map<String, Any?>>): Map<String, Any?> {
        return mapOf(
            "visitaId" to visitId,
            "detallesVisita" to visitConceptObj,
            "observacionVisita" to note,
            "detalleImagen" to photosDetailObj
        )
    }

    fun toCancelRequestObject(photosDetailObj:  MutableList<Map<String, Any?>>): Map<String, Any?> {
        return mapOf(
            "visitaId" to visitId,
            "detallesVisita" to listOf<Map<String, Any?>>(),
            "observacionVisita" to cancelNote,
            "detalleImagen" to photosDetailObj,
        )
    }

}