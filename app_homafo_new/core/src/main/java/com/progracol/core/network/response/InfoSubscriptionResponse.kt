package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class InfoSubscriptionResponse(
    @SerializedName("dsusIderegistr")
    val dsusIderegistr: String,

    @SerializedName("dsusPcodigo")
    val dsusPcodigo: String,

    @SerializedName("numCatastral")
    val numCatastral: String,

    @SerializedName("dsusAlterna")
    val dsusAlterna: AlternativeCompanayResponse,

    @SerializedName("nomCompleto")
    val nomCompleto: String,

    @SerializedName("proEstrato")
    val proEstrato: String,

    @SerializedName("proDireccion")
    val proDireccion: String,

    @SerializedName("nomEstablecimiento")
    val nomEstablecimiento: String,

    @SerializedName("estados")
    val statusSubscription: List<UnitKeyValueResponse>,

    @SerializedName("barrio")
    val barrio: UnitKeyValueResponse,

    @SerializedName("tipoUso")
    val useType: UnitKeyValueResponse,

    @SerializedName("liquidacion")
    val settlement: UnitKeyValueResponse,

    @SerializedName("condicionPredio")
    val conditionLand: UnitKeyValueResponse,

    @SerializedName("actividadComercial")
    val commercialActivity: UnitKeyValueResponse,

    @SerializedName("numCatastral30")
    val numCatastral30: String,

    @SerializedName("conceptosLiquidacion")
    val conceptosLiq: List<ConceptoLiqResponse>,

    @SerializedName("observacion")
    val observacion: String,
)
