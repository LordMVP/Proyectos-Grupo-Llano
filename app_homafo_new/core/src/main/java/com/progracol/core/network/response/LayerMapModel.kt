package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class LayerMapModel (
    @SerializedName("name") val name : String,
    @SerializedName("url") val url : String,
    @SerializedName("requiretoken") val requiretoken : String
)