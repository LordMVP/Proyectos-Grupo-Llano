package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class AlternativeCompanayResponse(
    @SerializedName("idempresa")
    val empresa_alterna: String,

    @SerializedName("pcodigo")
    val codigo_alterno: String,

    @SerializedName("medidor")
    val medidor_alterno: String,
)