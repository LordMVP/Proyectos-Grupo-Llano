package com.progracol.core.repository

import android.util.Log
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.progracol.core.database.dao.*
import com.progracol.core.database.entities.*
import com.progracol.core.network.APIClient
import com.progracol.core.util.toMultipartBody
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody
import javax.inject.Inject

class ANHRepository @Inject constructor(
    private val service: APIClient,
    private val paramAlternativeCompanyDao: ParamAlternativeCompanyDao,
    private val paramCommercialActivityDao: ParamCommercialActivityDao,
    private val paramConditionsHouseDao: ParamConditionHouseDao,
    private val paramLiquidationDao: ParamLiquidationDao,
    private val paramTypeUseDao: ParamTypeUseDao,
    private val paramNeighborhoodDao: ParamNeighborhoodDao,
    private val paramNoveltyInvoiceDao: ParamNoveltyInvoiceDao,
    private val paramNoveltyResultTypeDao: ParamNoveltyResultTypeDao,
    private val paramNoveltyTypeRequestDao: ParamNoveltyTypeRequestDao,
    private val paramNoveltyVisitDao: ParamNoveltyVisitDao,
    private val paramStateDao: ParamStateDao,
    private val paramMarcacionDao: ParamMarcacionDao,
    private val paramFacturacionDao: ParamFacturacionDao,
    private val paramStratumDao: ParamStratumDao,

    private val independenceDao: IndependenceDao,
    private val pointDao: PointDao,

    private val noveltyDao: NoveltyDao,
    private val storageDao: MediaStorageDao,
    private val subscriptionDetailDao: SubscriptionDetailDao

) {

    /************ Subscription Detail *****************/

    suspend fun getStratums() = paramStratumDao.getAll()

    suspend fun getStratumByName(name: String) = paramStratumDao.getStratumByName(name)

    suspend fun getUseTypes() = paramTypeUseDao.getAll()

    suspend fun getUseTypeByName(name: String) = paramTypeUseDao.getTypeUseByName(name)

    suspend fun getCommercialActivities() = paramCommercialActivityDao.getAll()

    suspend fun getCommercialActivitiesByName(name: String) = paramCommercialActivityDao.getCommercialActivitiesByName(name)

    suspend fun getPropertyConditions() = paramConditionsHouseDao.getAll()

    suspend fun getLiquidations() = paramLiquidationDao.getAll()

    suspend fun getSettlementsByName(name: String) = paramLiquidationDao.getSettlementsByName(name)

    suspend fun getNeighborhoods() = paramNeighborhoodDao.getAll()

    suspend fun getNeighborhoodByName(name: String) = paramNeighborhoodDao.getNeighborhoodByName(name)

    suspend fun getStates() = paramStateDao.getAll()

    suspend fun getMarcaciones() = paramMarcacionDao.getAll()

    suspend fun getTiposFacturacion() = paramFacturacionDao.getAll()

    suspend fun getFacturacionByName(name: String) = paramFacturacionDao.getFacturacionByName(name)

    suspend fun getPendingSubscriptions() = subscriptionDetailDao.getPendingSubscriptions()

    suspend fun getSubscriptionDetailDB(code: String) = subscriptionDetailDao.getSubscriptionDetailByCode(code)

    suspend fun getIndependenceDB(code: String) = independenceDao.getBySubscriptionCode(code)

    suspend fun getPointDB(id: Long) = pointDao.getByPointId(id)

    suspend fun getSubscriptionDetail(code: String) = service.getSubscriptionDetailById(code)

    suspend fun getIndependeceDetail(code: String) = service.getIndependeceById(code)

    suspend fun saveSubscriptionDetail(subscriptionDetail: SubscriptionDetail) =
        subscriptionDetailDao.insertOrUpdate(subscriptionDetail)

    suspend fun updateSubscription(data: Map<String, Any?>, photos: List<MediaStorage>) {
        val gson = GsonBuilder().disableHtmlEscaping().setLenient().create()

        val jsonData = gson.toJson(data) // Convertir el mapa a JSON

        // Asegurar codificación UTF-8 en el RequestBody
        val requestBody = jsonData.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())

        // Crear el MultipartBody.Part para enviar el JSON
        val dataPart = MultipartBody.Part.createFormData("data", null, requestBody)

        service.uploadSubscription(
            dataPart,
            photos.toMultipartBody()
        )
    }

    suspend fun updateUploadedSubscription(id: Long) =
        subscriptionDetailDao.updateUploadedSubscription(id)

    suspend fun deleteSubscription(code: String) =
        subscriptionDetailDao.deleteSubscription(code)

    /************ Novelties *****************/

    suspend fun getNovelties(id: String) = noveltyDao.getAllNoveltiesBySubscriptionId(id)

    suspend fun getPendingNovelties() = noveltyDao.getPendingNovelties()

    suspend fun getNoveltyVisits() = paramNoveltyVisitDao.getAll()

    suspend fun getNoveltyResultTypes() = paramNoveltyResultTypeDao.getAll()

    suspend fun getNoveltyTypeRequests() = paramNoveltyTypeRequestDao.getAll()

    suspend fun getNoveltyInvoices() = paramNoveltyInvoiceDao.getAll()

    suspend fun saveNovelty(novelty: Novelty): Long {
        return noveltyDao.insertOrUpdate(novelty)
    }

    suspend fun updateNovelty(data: Map<String, Any?>, photos: List<MediaStorage>) {
        val gson = GsonBuilder().disableHtmlEscaping().setLenient().create()

        val jsonData = gson.toJson(data) // Convertir el mapa a JSON

        // Asegurar codificación UTF-8 en el RequestBody
        val requestBody = jsonData.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())

        // Crear el MultipartBody.Part para enviar el JSON
        val dataPart = MultipartBody.Part.createFormData("data", null, requestBody)

        service.uploadNovelty(
            dataPart,
            photos.toMultipartBody()
        )
    }

    suspend fun updateUploadedNovelty(id: Long) = noveltyDao.updateUploadedNovelty(id)

    suspend fun deleteNovelty(id: Long) =
        noveltyDao.deleteNovelty(id)

    /************ Independence *****************/

    suspend fun getCompanies() = paramAlternativeCompanyDao.getAll()

    suspend fun getPendingIndependences() = independenceDao.getPendingIndependences()

    suspend fun getIndependenceBySubscriptionId(code: String) = independenceDao.getBySubscriptionCode(code)

    suspend fun saveIndependence(independence: Independence) = independenceDao.insertOrUpdate(independence)

    suspend fun updateIndependence(data: Map<String, Any?>, photos: List<MediaStorage>) {
        val gson = GsonBuilder().disableHtmlEscaping().setLenient().create()

        val jsonData = gson.toJson(data) // Convertir el mapa a JSON

        // Asegurar codificación UTF-8 en el RequestBody
        val requestBody = jsonData.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())

        // Crear el MultipartBody.Part para enviar el JSON
        val dataPart = MultipartBody.Part.createFormData("data", null, requestBody)

        service.uploadIndependence(
            dataPart,
            photos.toMultipartBody()
        )
    }

    suspend fun updateUploadedIndependence(id: Long) = independenceDao.updateUploadedIndependence(id)

    suspend fun deleteIndependence(id: Long) =
        independenceDao.deleteIndependence(id)


    /************ Point *****************/

    suspend fun getPendingPoints() = pointDao.getPendingPoints()

    suspend fun getIndependenceByPointId(id: String) = pointDao.getByPointId(id.toLong())

    suspend fun savePoint(point: Point) : Long {
        return pointDao.insertOrUpdate(point)
    }

    suspend fun updatePoint(data: Map<String, Any?>, photos: List<MediaStorage>) {
        val gson = GsonBuilder().disableHtmlEscaping().setLenient().create()

        val jsonData = gson.toJson(data) // Convertir el mapa a JSON

        // Asegurar codificación UTF-8 en el RequestBody
        val requestBody = jsonData.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())

        // Crear el MultipartBody.Part para enviar el JSON
        val dataPart = MultipartBody.Part.createFormData("data", null, requestBody)

        service.uploadPoint(
            dataPart,
            photos.toMultipartBody()
        )
    }

    suspend fun updateUploadedPoint(id: Long) = pointDao.updateUploadedPoint(id)

    suspend fun deletePoint(id: Long) = pointDao.deletePoint(id)

    /************ Search *****************/

    suspend fun search(currentPage: Int, data: HashMap<String, String?>) = service.search(currentPage, data)

    suspend fun getListActSyncSubscription(idSubscription: Long,currentPage: Int) = service.getListActSyncSubscription(idSubscription,currentPage)

    suspend fun getImagenesActualizacion(idTmpActSus: Long) = service.getImagenesActualizacion(idTmpActSus)

    suspend fun getAlternativeCompanies() = service.getAlternativeCompanies()

    suspend fun getAllFilterMap(companyId: String, meter: String, codeAlterna: String, codeBio: String, address: String, neighborhood: String, pqr: String, status: String)
        = service.filterMap(hashMapOf(
            "idempresa" to companyId,
            "medidor" to meter,
            "pcodigoalterna" to codeAlterna,
            "pcodigobio" to codeBio,
            "direccion" to address,
            "idbarrio" to neighborhood,
            "numpqr" to pqr,
            "estado" to status
        ))


}