package com.progracol.core.data

import com.google.gson.annotations.SerializedName

data class MenuOptions(

    @SerializedName("opcIderegistro")
    val idRegistro: Int,

    @SerializedName("opcNombre")
    val opcNombre: String,

    @SerializedName("opcDescripcion")
    val opcDescripcion: String,

    @SerializedName("prgIderegistro")
    val prgIderegistro: Any,

    @SerializedName("usuIderegistro")
    val usuIderegistro: Int

)