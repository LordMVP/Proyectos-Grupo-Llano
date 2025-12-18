package com.progracol.core.domain.model

import com.esri.arcgisruntime.layers.FeatureLayer

data class FeatureLayerItem(
    val name: String,
    var checked: Boolean,
    val feature: FeatureLayer
)