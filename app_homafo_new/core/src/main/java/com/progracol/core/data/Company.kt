package com.progracol.core.data

import com.google.gson.annotations.SerializedName

data class Company(

    @SerializedName("empresaId")
    val id: String,

    @SerializedName("empresaNombre")
    override val displayName: String

) : ModelDisplayName