package com.progracol.hya.data

import com.google.gson.annotations.SerializedName

class MapDetail(

    @SerializedName("ID_SUSCRIPCION")
    val idSuscripcion: String,

    @SerializedName("NOMBRE_CONTACTO")
    val contractName: String,

    @SerializedName("NOMBRE_ESTABLECIMIENTO")
    val establishment: String,

    @SerializedName("COD_BIOAGRICOLA")
    val code: String,

    @SerializedName("CATASTRAL_ANTERIOR")
    val catastralAnterior: String,

    @SerializedName("CODIGO_CATASTRAL_30")
    val catastralNacional: String,

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

    @SerializedName("TIPO_LIQUIDACION")
    val tipoLiquidacion: String,

    @SerializedName("FACTURACION")
    val billCompany: String,

    @SerializedName("SERVICIO_ENERGIA")
    val servicioEnergia: String,

    @SerializedName("MED_ENERGIA")
    val medEnergy: String,

    @SerializedName("CODIGO_EMSA")
    val codeEmsa: String,

    @SerializedName("SERVICIO_GAS")
    val servicioGas: String,

    @SerializedName("CODIGO_LLANOGAS")
    val codeLlanoGas: String,

    @SerializedName("MED_GAS")
    val medGas: String,

    @SerializedName("NOMBRE_SUSCRIPTOR")
    val consumerName: String,

    @SerializedName("DESOCUPADO")
    val desocupado: String,

    @SerializedName("AFORADO")
    val aforado: String,

    @SerializedName("DESCUENTO_PAP")
    val descuentoPap: String,

    @SerializedName("OBSERVACION")
    val observacion: String,

    @SerializedName("CreationDate")
    val creationDate: String,

    @SerializedName("latitude")
    val latitude: String,

    @SerializedName("longitude")
    val longitude: String
)