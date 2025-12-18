package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class NoveltyParamResponse(

    @SerializedName("novedadesVisita")
    val noveltyVisits: List<UnitKeyValueResponse>,

    @SerializedName("novedadesFactura")
    val noveltyInvoices: List<UnitKeyValueResponse>,

    @SerializedName("tipoSolicitud")
    val typeRequests: List<UnitKeyValueResponse>,

    @SerializedName("seleccione")
    val resultTypes: List<UnitKeyValueResponse>

)
