package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class ArcGisTokenResponse(
    @SerializedName("token") val token : String,
)
