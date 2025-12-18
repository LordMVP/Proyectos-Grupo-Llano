package com.progracol.core.domain.model

import com.progracol.core.network.response.LayerMapModel

data class LayersItem(
    val name: String,
    val url: String,
    val requiretoken: String
)

fun LayerMapModel.toDomain() = LayersItem(name = name, url = url, requiretoken = requiretoken)