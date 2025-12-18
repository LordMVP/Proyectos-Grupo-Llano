package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class UnitKeyValueResponseVolume(
    @SerializedName("vol")
    val vol: String,

    @SerializedName("llave")
    val key: String,

    @SerializedName("valor")
    val value: String
)
