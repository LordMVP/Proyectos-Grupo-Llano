package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class SearchSubscriptionResponse(

    @SerializedName("ternombre")
    val userName: String? = null,

    @SerializedName("dsusid")
    val idSubscription: Long? = null,

    @SerializedName("pcodigo")
    val userCode: String? = null,

    @SerializedName("estado")
    val state: String? = null,

    @SerializedName("direccion")
    val address: String? = null,

    @SerializedName("longitude")
    val longitude: String? = null,

    @SerializedName("latitude")
    val latitude: String? = null,

    @SerializedName("facturacion")
    val facturacion: String? = null,
)
