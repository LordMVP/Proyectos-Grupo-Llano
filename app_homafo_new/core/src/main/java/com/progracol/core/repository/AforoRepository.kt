package com.progracol.core.repository

import android.util.Log
import com.google.gson.Gson
import com.progracol.core.common.MediaStorageType
import com.progracol.core.database.dao.*
import com.progracol.core.database.entities.MediaStorage
import com.progracol.core.database.entities.Visit
import com.progracol.core.database.entities.VisitConcept
import com.progracol.core.network.APIClient
import com.progracol.core.util.toMultipartBody
import okhttp3.MultipartBody
import javax.inject.Inject

class AforoRepository @Inject constructor(
    private val service: APIClient,
    private val visitDao: VisitDao,
    private val mediaStorageDao: MediaStorageDao,
    private val visitConceptDao: VisitConceptDao,
    private val paramContainerTypeDao: ParamContainerTypeDao,
    private val paramBillingSegmentDao: ParamBillingSegmentDao
) {

    suspend fun getCompleteVisits() = visitDao.getCompleteVisits()

    suspend fun getPendingVisits() = visitDao.getPendingVisits()

    suspend fun getCanceledVisits(): List<Visit> {
        return visitDao.getCanceledVisits().map { visit ->
            visit.photo = mediaStorageDao.getData(visitId = visit.id ?: 0, mediaStorageType = MediaStorageType.AFORO_CANCELED_VISIT.ordinal)
                .firstOrNull()
            visit
        }
    }

    suspend fun getUploadedVisits() = visitDao.getUploadedVisits()

    suspend fun getBillingSegment() = paramBillingSegmentDao.getAll()

    suspend fun uploadCompleteVisit(data: Map<String, Any?>, photos: List<MediaStorage>) {
        service.uploadCompleteVisit(
            MultipartBody.Part.createFormData("data", Gson().toJson(data)),
            photos.toMultipartBody()
        )
    }

    suspend fun uploadCancelVisit(data: Map<String, Any?>, photos: List<MediaStorage>) {
        service.uploadCancelVisit(
            MultipartBody.Part.createFormData("data", Gson().toJson(data)),
            photos.toMultipartBody()
        )
    }

    suspend fun updateUploadedVisit(id: Long, status: String) = visitDao.updateUploadedVisit(id, status)

    suspend fun validar_visita(id_aforo: Int, id_visita: Int) = service.validar_visita(id_aforo, id_visita)

    /************ Register Visit *****************/

    suspend fun getVisits() = service.getVisits()

    suspend fun getVisitsDB() = visitDao.getVisits()

    suspend fun getVisit(id: Long) = visitDao.getVisit(id)

    suspend fun getVisitConceptsByVisitId(id: Long) = visitConceptDao.getVisitConceptByVisitId(id)

    suspend fun getContainerType() = paramContainerTypeDao.getAll()

    suspend fun updateVisit(visit: Visit) = visitDao.update(visit)

    suspend fun cancelVisit(id: Long, note: String) = visitDao.cancelVisit(id, note)

    suspend fun saveVisitConcepts(visitConcepts: List<VisitConcept>) = visitConceptDao.insertAll(visitConcepts)

    suspend fun saveVisits(visits: List<Visit>) = visitDao.insertAll(visits)

    suspend fun getVisitSearch(businessName: String, caseNumber: String, userCode: String, visitType: String) = visitDao.getVisitSearch(businessName,caseNumber,userCode, visitType)
}