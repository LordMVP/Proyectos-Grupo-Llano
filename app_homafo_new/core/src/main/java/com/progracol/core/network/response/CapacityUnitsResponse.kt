package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class CapacityUnitsResponse(
    @SerializedName("segmentoFac")
    val invoiceSegment : List<UnitKeyValueResponse>,

    @SerializedName("tiposRecipiente")
    val containerTypes : List<UnitKeyValueResponseVolume>,

    @SerializedName("tiposAforo")
    val typeOfCapacity : List<UnitKeyValueResponse>

)