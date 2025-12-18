package com.progracol.aforos.common

import com.google.gson.annotations.SerializedName

class MapDetail(

    @SerializedName("NOMBRE_CONTACTO")
    val contractName: String,

    @SerializedName("ESTABLISHMENT_NAME")
    val establishment: String,

    @SerializedName("COD_BIOAGRICOLA")
    val code: String,

    @SerializedName("CADASTRAL")
    val cadastral: String,

    @SerializedName("CATASTRAL_ANTERIOR")
    val lastCadastral: String,

    @SerializedName("TIPO_ACTIVIDAD")
    val activityType: String,

    @SerializedName("BARRIO")
    val neighborhood: String,

    @SerializedName("DIRECCION")
    val address: String,

    @SerializedName("ESTRATO")
    val stratum: String,

    @SerializedName("USO_PREDIO")
    val propertyUse: String,

    @SerializedName("CODIGO_EMSA")
    val codeEmsa: String,

    @SerializedName("CODIGO_LLANOGAS")
    val codeLlanoGas: String,

    @SerializedName("FACTURACION")
    val billCompany: String,

    @SerializedName("MED_GAS")
    val medGas: String,

    @SerializedName("MED_ENERGIA")
    val medEnergy: String,

    @SerializedName("NOMBRE_SUSCRIPTOR")
    val consumerName: String,

    @SerializedName("CreationDate")
    val creationDate: String,

    @SerializedName("latitude")
    val latitude: String,

    @SerializedName("longitude")
    val longitude: String

)