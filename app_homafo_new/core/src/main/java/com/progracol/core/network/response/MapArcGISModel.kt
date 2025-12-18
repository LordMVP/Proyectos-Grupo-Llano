package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class MapArcGISModel (
    @SerializedName("id") val id : String,
    @SerializedName("title") val title : String,
    @SerializedName("image") val image : String
)