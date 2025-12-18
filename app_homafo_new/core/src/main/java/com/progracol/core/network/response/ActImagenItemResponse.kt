package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class ActImagenItemResponse(
    @SerializedName("id")
    val id: Long,

    @SerializedName("imagen")
    val url: String,

    @SerializedName("tipo")
    val tipo: String
)