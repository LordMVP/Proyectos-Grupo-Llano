package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class UnitFilterResponse(
    @SerializedName("empresasAlternas")
    val companyAlternative: List<UnitKeyValueResponse>,

    @SerializedName("estados")
    val statusSubscription: List<UnitKeyValueResponse>
)
