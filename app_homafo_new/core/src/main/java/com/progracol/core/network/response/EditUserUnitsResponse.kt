package com.progracol.core.network.response

import com.google.gson.annotations.SerializedName

data class EditUserUnitsResponse(
    @SerializedName("condsPredio")
    val conditionLand: List<UnitKeyValueResponse>,

    @SerializedName("tiposUso")
    val typesUse: List<UnitKeyValueResponse>,

    @SerializedName("actsComercial")
    val commercialActivities: List<UnitKeyValueResponse>,

    @SerializedName("liquidaciones")
    val settlement: List<UnitKeyValueResponse>,

    @SerializedName("marcacionLiquidacion")
    val marcacionLiquidacion: List<ConceptoLiqResponse>,

    @SerializedName("tipoFacturacion")
    val tipoFacturacion: List<TipoFacturacionResponse>,

    @SerializedName("estratos")
    val estratos: List<UnitKeyValueResponse>
)
