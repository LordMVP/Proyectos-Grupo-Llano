package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class TipoFacturacionResponse(
    @SerializedName("nombre")
    val nombre: String,

    @SerializedName("color")
    val color: String,

    @SerializedName("orden")
    val orden: String,
)