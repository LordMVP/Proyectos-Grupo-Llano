package com.progracol.core.domain.model

import com.progracol.core.network.response.MapArcGISModel

data class MapsItem(
    val name: String,
    val image: String,
    val mapId: String
)

fun MapArcGISModel.toDomain() = MapsItem(name = title, image = "", mapId = id)