package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class ValidVisitResponse(
    @SerializedName("id_aforo")
    var id_aforo : Int,

    @SerializedName("id_visita")
    var id_visita : Int,

    @SerializedName("consecutivo_visita")
    var consecutivo_visita : Int,

    @SerializedName("estado")
    var estado : String,

    @SerializedName("origen")
    var origen : String
)
