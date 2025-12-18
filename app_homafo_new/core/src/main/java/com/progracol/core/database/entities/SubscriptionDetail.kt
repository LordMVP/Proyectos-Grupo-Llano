package com.progracol.core.database.entities

import androidx.annotation.NonNull
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Ignore
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import com.progracol.core.network.response.AlternativeCompanayResponse
import com.progracol.core.network.response.ConceptoLiqResponse
import com.progracol.core.network.response.UnitKeyValueResponse

@Entity(tableName = "subscription_detail")
data class SubscriptionDetail(

    @NonNull @PrimaryKey(autoGenerate = false)
    var id: Long?,

    @SerializedName("dsusIderegistr")
    @ColumnInfo(name = "subscription_id" )
    var subscriptionId: String?,

    @SerializedName("dsusPcodigo")
    @ColumnInfo(name = "subscription_code" )
    val subscriptionCode: String?,

    @SerializedName("nomCompleto")
    @ColumnInfo(name = "name" )
    var name: String? = null,

    @ColumnInfo(name = "document" )
    var document: String? = null,

    @ColumnInfo(name = "phone" )
    var phone: String? = null,

    @ColumnInfo(name = "email" )
    var email: String? = null,

    @SerializedName("proDireccion")
    @ColumnInfo(name = "address" )
    var address: String? = null,

    @ColumnInfo(name = "neighborhood" )
    var neighborhood: String? = null,

    @SerializedName("proEstrato")
    @ColumnInfo(name = "stratum" )
    var stratum: String? = null,

    @ColumnInfo(name = "use_type")
    var useType: String? = null,

    @ColumnInfo(name = "settlement")
    var settlement: String? = null,

    @SerializedName("numCatastral")
    @ColumnInfo(name = "catastral_code" )
    val catastralCode: String? = "",

    @SerializedName("numCatastral30")
    @ColumnInfo(name = "catastral_code_30" )
    val catastralCodeNacional: String? = "",

    @SerializedName("facturacion")
    @ColumnInfo(name = "facturacion" )
    var facturacion: String? = null,

    @ColumnInfo(name = "service_emsa")
    var serviceEmsa: String = "",

    @ColumnInfo(name = "alternate_code_emsa")
    var alternateCodeEmsa: String = "",

    @ColumnInfo(name = "alternate_meter_emsa")
    var alternateMeterEmsa: String = "",

    @ColumnInfo(name = "service_gas")
    var serviceGas: String = "",

    @ColumnInfo(name = "alternate_code_gas")
    var alternateCodeGas: String = "",

    @ColumnInfo(name = "alternate_meter_gas")
    var alternateMeterGas: String = "",

    @ColumnInfo(name = "property_condition")
    var propertyCondition: String = "",

    @SerializedName("nomEstablecimiento")
    @ColumnInfo(name = "property_name" )
    var propertyName: String? = null,

    @ColumnInfo(name = "commercial_activity")
    var commercialActivity: String? = null,

    @SerializedName("observacion")
    @ColumnInfo(name = "observacion" )
    var observacion: String? = null,

    @ColumnInfo(name = "status" )
    var status: String = "",

    @ColumnInfo(name = "longitude" )
    var longitude: String? = null,

    @ColumnInfo(name = "latitude" )
    var latitude: String? = null,

    @ColumnInfo(name = "deshabitado" )
    var deshabitado: Int? = null,

    @ColumnInfo(name = "aforado" )
    var aforado: Int? = null,

    @ColumnInfo(name = "descuento_pap" )
    var descuento_pap: Int? = null,
) {

    @SerializedName("dsusAlterna")
    @Ignore
    val alternateCodeData: List<AlternativeCompanayResponse>? = null

    @SerializedName("estados")
    @Ignore
    val statusSubscriptionData: List<UnitKeyValueResponse>? = null

    @SerializedName("barrio")
    @Ignore
    val neighborhoodData: UnitKeyValueResponse? = null

    @SerializedName("tipoUso")
    @Ignore
    val useTypeData: UnitKeyValueResponse? = null

    @SerializedName("estrato")
    @Ignore
    val estratoData: UnitKeyValueResponse? = null

    @SerializedName("liquidacion")
    @Ignore
    val settlementData: UnitKeyValueResponse? = null

    @SerializedName("condicionPredio")
    @Ignore
    val propertyConditionData: List<UnitKeyValueResponse>? = null

    @SerializedName("actividadComercial")
    @Ignore
    val commercialActivityData: UnitKeyValueResponse? = null

    @SerializedName("conceptosLiquidacion")
    @Ignore
    val conceptosLiquidacion: List<ConceptoLiqResponse>? = null

    fun toRequestObject(): Map<String, Any?> {
        return mapOf(
            "dsusPcodigo" to subscriptionCode,
            "fechaEncuesta" to null,
            "usuIderegistro" to null,
            "facturacion" to facturacion,
            "terNombre" to name,
            "terDocumento" to document,
            "terTelcelular" to phone,
            "terCorreo" to email,
            "proDireccion" to address,
            "uniBarrio" to neighborhood?.toInt(),
            "uniComplemento" to 4362,
            "nomEstablecimiento" to propertyName,
            "uniActcomercial" to commercialActivity?.toInt(),
            "uniCondspredio" to propertyCondition.split(",").toList(),
            "proCatestrato" to stratum?.toInt(),
            "uniTipusosus" to useType?.toInt(),
            "uniLiquidacion" to settlement?.toInt(),
            "proNumcatastral" to catastralCode,
            "proNumcatastralnacional" to catastralCodeNacional,
            "actsusAlterna" to  listOf(
                mapOf(
                    "servicio_alterno" to if (serviceEmsa == "SI") "EMSA" else "",
                    "medidor_alterno" to alternateMeterEmsa,
                    "codigo_alterno" to alternateCodeEmsa
                ),
                mapOf(
                    "servicio_alterno" to if (serviceGas == "SI") "GAS" else "",
                    "medidor_alterno" to alternateMeterGas,
                    "codigo_alterno" to alternateCodeGas
                )
            ),
            "conLiquidacion" to mapOf(
                "deshabitado" to deshabitado,
                "aforado" to aforado,
                "descuento_pap" to descuento_pap
            ),
            "observacion" to observacion,
            "longitud" to longitude,
            "latitud" to latitude,
            "actsusTipo" to "Actualizacion",
        )
    }

}
