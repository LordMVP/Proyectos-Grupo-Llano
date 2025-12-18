package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class ActSyncSubscriptionResponse(
    @SerializedName("usuIderegistro")
    val idOperario: String,

    @SerializedName("actsusIderegistro")
    val idRegistro: String,

    @SerializedName("fechaEncuesta")
    val fechaEncuesta: String,

    @SerializedName("dsusIderegistro")
    val idSuscripcion: String,

    @SerializedName("dsusPcodigoAseo")
    val codigoAseo: String,

    @SerializedName("actsusEstado")
    val estado: String,

    @SerializedName("actsusTipo")
    val proceso: String,

    @SerializedName("observacion")
    val observacion: String
)