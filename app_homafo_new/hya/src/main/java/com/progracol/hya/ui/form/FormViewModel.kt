package com.progracol.hya.ui.form

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.common.MediaStorageType
import com.progracol.core.common.UploadStatus
import com.progracol.core.database.entities.Novelty
import com.progracol.core.network.Resource
import com.progracol.core.repository.ANHRepository
import com.progracol.core.database.entities.SubscriptionDetail
import com.progracol.core.database.entities.Independence
import com.progracol.core.database.entities.Point
import com.progracol.core.repository.GalleryRepository

import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import java.util.*
import javax.inject.Inject

@HiltViewModel
class FormViewModel @Inject constructor(
    private val andRepository: ANHRepository,
    private val galleryRepository: GalleryRepository
): ViewModel() {

    var noveltyId: Long = 0

    var mediaStorageType: Int = -1

    var isOffline = false

    //Point
    var defaultPointId: Long? = null
    var defaultFechaEncuesta = ""
    var defaultColaborador = ""
    var defaultTypeDocument = ""
    var defaultDocument = ""
    var defaultPhone = ""
    var defaultEmail = ""
    var defaultZone = ""


    //SubscriptionDetail y Independence
    var defaultIdSuscripcion = ""
    var defaultSubscriptionCode = ""
    var defaultStratum = ""
    var defaultAddress = ""
    var defaultNeighborhood = ""
    var defaultCatastral = ""
    var defaultCatastralNacional = ""

    var defaultServiceEmsa = ""
    var defaultAlternateCodeEmsa = ""
    var defaultAlternateMeterEmsa = ""
    var defaultServiceGas = ""
    var defaultAlternateCodeGas = ""
    var defaultAlternateMeterGas = ""

    var defaultPropertyUse = ""
    var defaultName = ""
    var defaultLongitude = ""
    var defaultLatitude = ""

    var defaultTipoLiquidacion  = ""
    var defaultTipoFacturacion  = ""
    var defaultEstablecimiento = ""
    var defaultActividadComercial = ""
    var defaultObservacion = ""
    var defaultDeshabitado = ""
    var defaultAforado = ""
    var defaultDescuento_pap = ""

    // Subscription
    private var _subscriptionDetail: MutableLiveData<SubscriptionDetail> = MutableLiveData()
    val subscriptionDetail: LiveData<SubscriptionDetail> get() = _subscriptionDetail
    /*
        * 1 -> Database
        * 2 -> Offline
        * 3 -> Response
        * */
    var tipoSubscriptionDetail: Int? = null

    // Novelty
    private var _novelty: MutableLiveData<Novelty> = MutableLiveData()
    val novelty: LiveData<Novelty>
        get() = _novelty

    private var _novelties: MutableLiveData<List<Novelty>> = MutableLiveData()
    val novelties: LiveData<List<Novelty>>
        get() = _novelties

    // Independence
    private var _independence: MutableLiveData<Independence> = MutableLiveData()
    val independence: LiveData<Independence> get() = _independence
    /*
    * 1 -> Database
    * 2 -> Offline
    * 3 -> Response
    * */
    var tipoIndependence: Int? = null

    // Point
    private var _point: MutableLiveData<Point> = MutableLiveData()
    val point: LiveData<Point> get() = _point
    /*
    * 1 -> Database
    * 2 -> New
    * */
    var tipoPoint: Int? = null

    fun getUseType() = liveData(Dispatchers.IO) { emit(andRepository.getUseTypes()) }

    fun getSelectedUseType() = liveData(Dispatchers.IO) {
        if (defaultPropertyUse == "") {
            defaultPropertyUse = "null"
        }
        emit(andRepository.getUseTypeByName(defaultPropertyUse))
    }

    fun getCommercialActivities() = liveData(Dispatchers.IO) { emit(andRepository.getCommercialActivities()) }

    fun getSelectedCommercialActivity(actividad: String?) = liveData(Dispatchers.IO) {
        var busqueda = actividad
        if (busqueda == null) {
            if (defaultActividadComercial == "") {
                busqueda = "null"
            } else {
                busqueda = defaultActividadComercial
            }
        }

        emit(andRepository.getCommercialActivitiesByName(busqueda!!))
    }

    fun getPropertyConditions() = liveData(Dispatchers.IO) { emit(andRepository.getPropertyConditions()) }

    fun getLandCondition() = liveData(Dispatchers.IO) { emit( andRepository.getLiquidations()) }

    fun getSelectedSettlement() = liveData(Dispatchers.IO) {
        var busqueda = ""
        if (defaultTipoLiquidacion == "") {
            busqueda = "null"
        } else {
            busqueda = defaultTipoLiquidacion
        }
        emit(andRepository.getSettlementsByName(busqueda))
    }

    fun getTiposFacturacion() = liveData(Dispatchers.IO) { emit( andRepository.getTiposFacturacion()) }

    fun getSelectedFacturacion(facturacion: String) = liveData(Dispatchers.IO) {
        emit(andRepository.getFacturacionByName(facturacion))
    }

    fun getNeighborhoods() = liveData(Dispatchers.IO) { emit( andRepository.getNeighborhoods()) }

    fun getSelectedNeighborhood(barrio: String?) = liveData(Dispatchers.IO) {
        var busqueda = barrio
        if (busqueda == null) {
            if (defaultNeighborhood == "") {
                busqueda = "null"
            } else {
                busqueda = defaultNeighborhood
            }
        }

        emit(andRepository.getNeighborhoodByName(busqueda!!))
    }

    fun getCompanies() = liveData(Dispatchers.IO) { emit( andRepository.getCompanies()) }

    fun getMarcaciones() = liveData(Dispatchers.IO) { emit( andRepository.getMarcaciones()) }

    fun getStratums() = liveData(Dispatchers.IO) { emit(andRepository.getStratums()) }

    fun getSelectedStratum() = liveData(Dispatchers.IO) {
        if (defaultStratum == "") {
            defaultStratum = "null"
        }
        emit(andRepository.getStratumByName(defaultStratum.uppercase()))
    }

    /* Subscription Detail */

    suspend fun getSubscriptionDetailById() {
        Log.i("formViewModel-SubscriptionDetail", defaultSubscriptionCode)
        val subscriptionDetailDB = andRepository.getSubscriptionDetailDB(defaultSubscriptionCode)
        if (subscriptionDetailDB != null) {
            _subscriptionDetail.postValue(subscriptionDetailDB!!)
            tipoSubscriptionDetail = 1 //Database
        } else {
            if (isOffline) {
                _subscriptionDetail.postValue(
                    SubscriptionDetail(
                        id = null,
                        subscriptionId = defaultIdSuscripcion,
                        subscriptionCode = defaultSubscriptionCode,
                        facturacion = defaultTipoFacturacion,
                        name = defaultName,
                        document = defaultDocument,
                        phone = defaultPhone,
                        email = defaultEmail,
                        address = defaultAddress,
                        neighborhood = defaultNeighborhood,
                        propertyName = defaultEstablecimiento,
                        commercialActivity = defaultActividadComercial,
                        stratum = defaultStratum,
                        useType = defaultPropertyUse,
                        settlement = defaultTipoLiquidacion,
                        catastralCode = defaultCatastral,
                        catastralCodeNacional = defaultCatastralNacional,
                        serviceEmsa = defaultServiceEmsa,
                        alternateCodeEmsa = defaultAlternateCodeEmsa,
                        alternateMeterEmsa = defaultAlternateMeterEmsa,
                        serviceGas = defaultServiceGas,
                        alternateCodeGas = defaultAlternateCodeGas,
                        alternateMeterGas = defaultAlternateMeterGas,
                        deshabitado = 0,
                        descuento_pap = 0,
                        observacion = defaultObservacion,
                        longitude = defaultLongitude,
                        latitude = defaultLatitude,
                        status = UploadStatus.PENDING.status
                    )
                )
                tipoSubscriptionDetail = 2 //Offline
            } else {
                val response = andRepository.getSubscriptionDetail(defaultSubscriptionCode)
                Log.i("formViewModel-SubscriptionDetail", response.toString())
                response.id = null

                response.alternateCodeData?.forEach { item ->
                    if(item.empresa_alterna == "299"){
                        response.serviceEmsa = "SI"
                        response.alternateMeterEmsa = item.medidor_alterno
                        response.alternateCodeEmsa = item.codigo_alterno
                    }else {
                        if(item.empresa_alterna != "322") response.serviceEmsa = "NO"
                    }
                    if(item.empresa_alterna == "322"){
                        response.serviceGas = "SI"
                        response.alternateMeterGas = item.medidor_alterno
                        response.alternateCodeGas = item.codigo_alterno
                    }else {
                        if(item.empresa_alterna != "299") response.serviceGas = "NO"
                    }
                }

                response.deshabitado = response.conceptosLiquidacion?.firstOrNull{ it.orden == 1 && it.cosuEstado.equals("A") }?.uni_concepto?.toString()?.toIntOrNull()
                response.aforado = response.conceptosLiquidacion?.firstOrNull{ it.orden == 2 && it.cosuEstado.equals("A") }?.uni_concepto?.toString()?.toIntOrNull()
                response.descuento_pap = response.conceptosLiquidacion?.firstOrNull{ it.orden == 3 && it.cosuEstado.equals("A") }?.uni_concepto?.toString()?.toIntOrNull()

                response.neighborhoodData?.let {
                    response.neighborhood = it.key
                    defaultNeighborhood = it.value

                }
                response.settlementData?.let {
                    response.settlement = it.key
                }

                response.useTypeData?.let {
                    response.useType = it.key
                }
                response.commercialActivityData?.let {
                    response.commercialActivity = it.key
                }

                response.estratoData?.let {
                    response.stratum = it.key
                }

                response.facturacion = defaultTipoFacturacion
                _subscriptionDetail.postValue(response)
                tipoSubscriptionDetail = 3 //Response
            }
        }
    }

    fun saveSubscriptionDetail(subscriptionDetail: SubscriptionDetail) = liveData {
        mediaStorageType = MediaStorageType.HYA_DETAIL.ordinal
        emit(Resource.loading(true))
        try {
            andRepository.saveSubscriptionDetail(subscriptionDetail)
            _subscriptionDetail.postValue(subscriptionDetail)
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    /* Novelties */

    fun getNoveltyVisits() = liveData(Dispatchers.IO) { emit(andRepository.getNoveltyVisits()) }

    fun getNoveltyResultTypes() = liveData(Dispatchers.IO) { emit(andRepository.getNoveltyResultTypes()) }

    fun getNoveltyTypeRequests() = liveData(Dispatchers.IO) { emit(andRepository.getNoveltyTypeRequests()) }

    fun getNoveltyInvoices() = liveData(Dispatchers.IO) { emit(andRepository.getNoveltyInvoices()) }

    fun getNoveltiesBySubscriptionId() = liveData(Dispatchers.IO) {
        emit(Resource.loading(true))
        try {
            val response = andRepository.getNovelties(defaultSubscriptionCode)
            _novelties.postValue(response)
            emit(Resource.success(true))
        } catch (exception: Exception) {
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun newNovelty() {
        noveltyId = (10000..99999).random().toLong()
    }

    fun saveNovelty(novelty: Novelty) = liveData(Dispatchers.IO) {
        emit(Resource.loading(true))
        try {
            val newNoveltyId = andRepository.saveNovelty(novelty)
            //_novelty.postValue(null)
            _novelties.postValue(andRepository.getNovelties(defaultSubscriptionCode))
            galleryRepository.updateNoveltiesId(newNoveltyId, noveltyId)
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    /* Independence */
    suspend fun getIndependenceById() {
        val independenciaDB = andRepository.getIndependenceDB(defaultSubscriptionCode)
        if (independenciaDB != null) {
            _independence.postValue(independenciaDB!!)
            tipoIndependence = 1 //Database
        } else {
            if (isOffline) {
                _independence.postValue(
                    Independence(
                        id = null,
                        subscriptionCode = defaultSubscriptionCode,
                        fechaEncuesta = defaultFechaEncuesta,
                        colaborador = defaultColaborador,
                        facturacion = "",
                        name = defaultName,
                        document = defaultDocument,
                        phone = defaultPhone,
                        email = defaultEmail,
                        address = defaultAddress,
                        neighborhood = defaultNeighborhood,
                        propertyName = defaultEstablecimiento,
                        commercialActivity = defaultActividadComercial,
                        stratum = defaultStratum,
                        useType = defaultPropertyUse,
                        settlement = defaultTipoLiquidacion,
                        catastralCode = defaultCatastral,
                        catastralCodeNacional = defaultCatastralNacional,
                        serviceEmsa = "NO",
                        alternateCodeEmsa = "",
                        alternateMeterEmsa = "",
                        serviceGas = "NO",
                        alternateCodeGas = "",
                        alternateMeterGas = "",
                        deshabitado = null,
                        descuento_pap = null,
                        observacion = defaultObservacion,
                        longitude = defaultLongitude,
                        latitude = defaultLatitude,
                        status = UploadStatus.PENDING.status
                    )
                )
                tipoIndependence = 2 //Offline
            } else {
                val response = andRepository.getIndependeceDetail(defaultSubscriptionCode).apply {
                    id = null
                    neighborhoodData?.let {
                        neighborhood = it.key
                        defaultNeighborhood = it.value
                    }
                    settlementData?.let {
                        settlement = it.key
                    }
                    useTypeData?.let {
                        useType = it.key
                    }
                    commercialActivityData?.let {
                        commercialActivity = it.key
                    }

                    estratoData?.let {
                        stratum = it.key
                    }
                }
                _independence.postValue(response)
                tipoIndependence = 3 //Response
            }
        }
    }

    fun saveIndependence(independence: Independence) = liveData(Dispatchers.IO) {
        emit(Resource.loading(true))
        try {
            andRepository.saveIndependence(independence)
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun isEmptyGallery(mediaStorageType: MediaStorageType): Boolean = runBlocking {
        val photos = galleryRepository.getData(subscriptionId = defaultSubscriptionCode, noveltyId = noveltyId, 0, 0, mediaStorageType = mediaStorageType.ordinal)
        photos.isEmpty()
    }

    fun isIndependeceEmptyGallery(mediaStorageType: MediaStorageType): Boolean = runBlocking {
        val photos = galleryRepository.getData(subscriptionId = defaultSubscriptionCode, 0, 0, 0, mediaStorageType = mediaStorageType.ordinal)
        photos.isEmpty()
    }

    fun isPointEmptyGallery(pointId: Long,mediaStorageType: MediaStorageType): Boolean = runBlocking {
        val photos = galleryRepository.getData("", 0, 0, pointId, mediaStorageType = mediaStorageType.ordinal)
        photos.isEmpty()
    }

    /* Point */

    suspend fun getPointById() {
        Log.i("formViewModel-Point", defaultPointId.toString())
        val subscriptionDetailDB = andRepository.getPointDB(defaultPointId!!)
        if (subscriptionDetailDB != null) {
            _point.postValue(subscriptionDetailDB!!)
            tipoPoint = 1 //Database
        } else {
            /*_point.postValue(
                Point(
                    id = null,
                    fechaEncuesta = defaultFechaEncuesta,
                    colaborador = defaultColaborador,
                    facturacion = defaultTipoFacturacion,
                    name = defaultName,
                    typeDocument = defaultTypeDocument,
                    document = defaultDocument,
                    phone = defaultPhone,
                    email = defaultEmail,
                    address = defaultAddress,
                    zone = defaultZone,
                    neighborhood = defaultNeighborhood,
                    propertyName = defaultEstablecimiento,
                    commercialActivity = defaultActividadComercial,
                    stratum = defaultStratum,
                    useType = defaultPropertyUse,
                    settlement = defaultTipoLiquidacion,
                    catastralCode = defaultCatastral,
                    catastralCodeNacional = defaultCatastralNacional,
                    serviceEmsa = defaultServiceEmsa,
                    alternateCodeEmsa = defaultAlternateCodeEmsa,
                    alternateMeterEmsa = defaultAlternateMeterEmsa,
                    serviceGas = defaultServiceGas,
                    alternateCodeGas = defaultAlternateCodeGas,
                    alternateMeterGas = defaultAlternateMeterGas,
                    deshabitado = 0,
                    descuento_pap = 0,
                    observacion = defaultObservacion,
                    longitude = defaultLongitude,
                    latitude = defaultLatitude,
                    status = UploadStatus.PENDING.status
                )
            )*/
            tipoPoint = 2 //New
            throw Exception ("No se encontró un punto en base de datos.")
        }
    }

    fun savePoint(point: Point, pointIdOld: Long) = liveData(Dispatchers.IO) {
        emit(Resource.loading(true))
        try {
            val pointIdNew = andRepository.savePoint(point)
            galleryRepository.updatePointId(pointIdNew, pointIdOld)
            emit(Resource.success(pointIdNew))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }
}