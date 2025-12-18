package com.progracol.core.database.entities

import android.util.Log
import androidx.annotation.NonNull
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName

@Entity(tableName = "point")
data class Point (

    @NonNull @PrimaryKey(autoGenerate = false)
    var id: Long?,

    @ColumnInfo(name = "fecha_encuesta" )
    var fechaEncuesta: String? = null,

    @ColumnInfo(name = "colaborador" )
    var colaborador: String? = null,

    @ColumnInfo(name = "facturacion")
    var facturacion: String? = null,

    @ColumnInfo(name = "name" )
    var name: String? = null,

    @ColumnInfo(name = "type_document" )
    var typeDocument: String? = null,

    @ColumnInfo(name = "document" )
    var document: String? = null,

    @ColumnInfo(name = "phone" )
    var phone: String? = null,

    @ColumnInfo(name = "email" )
    var email: String? = null,

    @ColumnInfo(name = "address" )
    var address: String? = null,

    @ColumnInfo(name = "zone" )
    var zone: String? = null,

    @ColumnInfo(name = "neighborhood" )
    var neighborhood: String? = null,

    @ColumnInfo(name = "property_name")
    var propertyName: String? = null,

    @ColumnInfo(name = "commercial_activity")
    var commercialActivity: String? = null,

    @ColumnInfo(name = "stratum")
    var stratum: String? = null,

    @ColumnInfo(name = "use_type" )
    var useType: String? = null,

    @ColumnInfo(name = "settlement")
    var settlement: String? = null,

    @ColumnInfo(name = "catastral_code" )
    val catastralCode: String? = "",

    @ColumnInfo(name = "catastral_code_30" )
    val catastralCodeNacional: String? = "",

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

    @ColumnInfo(name = "deshabitado" )
    var deshabitado: Int? = null,

    @ColumnInfo(name = "descuento_pap" )
    var descuento_pap: Int? = null,

    @ColumnInfo(name = "observacion" )
    var observacion: String? = null,

    @ColumnInfo(name = "longitude" )
    var longitude: String? = null,

    @ColumnInfo(name = "latitude" )
    var latitude: String? = null,

    @ColumnInfo(name = "status" )
    var status: String?,

) {

    fun toRequestObject(): Map<String, Any?> {
        return mapOf(
            "dsusPcodigo" to null,
            "fechaEncuesta" to fechaEncuesta,
            "usuIderegistro" to colaborador,
            "facturacion" to facturacion,
            "terNombre" to name,
            "terTipoDocumento" to typeDocument,
            "terDocumento" to document,
            "terTelcelular" to phone,
            "terCorreo" to email,
            "proDireccion" to address,
            "proZona" to zone,
            "uniBarrio" to neighborhood?.toInt(),
            "uniComplemento" to 4362,
            "nomEstablecimiento" to propertyName,
            "uniActcomercial" to commercialActivity?.toInt(),
            "uniCondspredio" to listOf<String>(),
            "proCatestrato" to stratum,
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
                "aforado" to null,
                "descuento_pap" to descuento_pap
            ),
            "observacion" to observacion,
            "longitud" to longitude,
            "latitud" to latitude,
            "actsusTipo" to "Punto",
        )
    }

}
