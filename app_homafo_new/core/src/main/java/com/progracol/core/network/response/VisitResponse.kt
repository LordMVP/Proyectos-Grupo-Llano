package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class VisitResponse(
    @SerializedName("aforoId")
    var idAforo : Int,

    @SerializedName("nombreEstablecimiento")
    var nameEstablishment : String?,

    @SerializedName("claseAforo")
    var capacityClass : String,

    @SerializedName("tipoAforo")
    var capacityType : String,

    @SerializedName("fuente")
    var font : String,

    @SerializedName("suscripcion")
    var subscription : String,

    @SerializedName("visitasTotal")
    var totalVisits : String,

    @SerializedName("visitasRealizadas")
    var madeVisits : String,

    @SerializedName("fechaAsignacion")
    var assignmentDate : String,

    @SerializedName("codSusBio")
    var subscriptionCodeBio : String,

    @SerializedName("visitaId")
    var idVisit : Int,

    @SerializedName("visitaConsecutivo")
    var consecutiveVisit : Int,

    @SerializedName("radicado")
    var caseNumber : String?,

    @SerializedName("observacion")
    var observation : String?,

    @SerializedName("barrio")
    var neighborhood : String,

    @SerializedName("direccion")
    var address : String,

    @SerializedName("semana")
    var week : String,

    @SerializedName("image")
    var image : String?,

    @SerializedName("codSusMulti")
    var subscriptionCodeBioMulti : String?,
)
