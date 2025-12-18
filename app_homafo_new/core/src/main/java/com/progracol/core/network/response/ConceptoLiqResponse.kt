package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class ConceptoLiqResponse(
    @SerializedName("cosuIdregistr")
    val consu_idregistr: Int,

    @SerializedName("uniConcepto")
    val uni_concepto: Int,

    @SerializedName("orden")
    val orden: Int,

    @SerializedName("cosuEstado")
    val cosuEstado: String,

    @SerializedName("nombre")
    val nombre: String,
)