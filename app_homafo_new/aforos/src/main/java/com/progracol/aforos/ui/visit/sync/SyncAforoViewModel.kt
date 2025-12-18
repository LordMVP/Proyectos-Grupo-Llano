package com.progracol.aforos.ui.visit.sync

import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.aforos.common.VisitStatus
import com.progracol.aforos.common.VisitType
import com.progracol.core.common.MediaStorageType
import com.progracol.core.common.UploadStatus
import com.progracol.core.database.entities.Visit
import com.progracol.core.network.Resource
import com.progracol.core.repository.AforoRepository
import com.progracol.core.repository.GalleryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import javax.inject.Inject

@HiltViewModel
class SyncAforoViewModel @Inject constructor(
    private val aforoRepository: AforoRepository,
    private val galleryRepository: GalleryRepository
) : ViewModel() {

    private var _canceledVisit: MutableLiveData<List<Visit>> = MutableLiveData()
    val canceledVisit: LiveData<List<Visit>> get() = _canceledVisit

    private var _completeVisit: MutableLiveData<List<Visit>> = MutableLiveData()
    val completeVisit: LiveData<List<Visit>> get() = _completeVisit

    fun loadPendingVisits() = runBlocking {
        launch(Dispatchers.IO) {

            val timeNow = DateTimeFormatter
                .ofPattern("yyyy-MM-dd 00:00:00")
                .withZone(ZoneId.of("America/Bogota"))
                .format(Instant.now())

            val completeVisits = aforoRepository.getCompleteVisits()
            _completeVisit.postValue(
                completeVisits.filter { it.updatedTime == null || getTimestamp(it.updatedTime) > getTimestamp(timeNow) }
            )

            val canceledVisits = aforoRepository.getCanceledVisits()
            _canceledVisit.postValue(
                canceledVisits.filter { it.updatedTime == null || getTimestamp(it.updatedTime) > getTimestamp(timeNow) }
            )
        }
    }

    private fun getTimestamp(date: String?): Long {
        if (date.isNullOrEmpty()) return 0L
        return SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date)?.time ?: 0L
    }

    fun sync() = liveData {
        emit(Resource.loading(true))

        // --- 🔹 CONTADORES INDEPENDIENTES ---
        var totalComplete = 0
        var completeSuccess = 0
        var completeFailed = 0

        // --- 🔹 PROCESO DE VISITAS COMPLETAS ---
        val completeVisits = aforoRepository.getCompleteVisits()
        for (visit in completeVisits) {
            totalComplete++
            try {
                val photos = galleryRepository.getData(
                    visitId = visit.id ?: 0,
                    mediaStorageType = MediaStorageType.AFORO_COMPLETE_VISIT.ordinal
                )

                val visitConcepts = aforoRepository.getVisitConceptsByVisitId(visit.id ?: 0)
                val visitConceptsObj = visitConcepts.map { it.toVisitConceptObject() }.toMutableList()
                val photosObj = photos.map { it.toPhotoObject() }.toMutableList()

                aforoRepository.uploadCompleteVisit(
                    visit.toCompleteRequestObject(visitConceptsObj, photosObj),
                    photos
                )

                updateUploadedCompleteVisit(visit)
                completeSuccess++

            } catch (exception: Exception) {
                Log.e("SYNC_ERROR", "Error al subir visita completa [${visit.id}]: ${exception.message}")

                try {
                    val respuesta = aforoRepository.validar_visita(visit.aforoId, visit.visitId)
                    when (respuesta.estado) {
                        VisitStatus.TRAMITADO.status -> {
                            Log.w("SYNC_WARNING", "Visita ${visit.id} ya estaba tramitada, se marca como sincronizada.")
                            updateUploadedCompleteVisit(visit)
                            completeSuccess++
                        }
                        else -> {
                            Log.e("SYNC_ERROR", "Visita ${visit.id} no se pudo sincronizar. Estado actual: ${respuesta.estado}")
                            completeFailed++
                        }
                    }
                } catch (validationError: Exception) {
                    Log.e("SYNC_VALIDATION_ERROR", "Error validando visita ${visit.id}: ${validationError.message}")
                    completeFailed++
                }
            }
        }

        var totalCanceled = 0
        var canceledSuccess = 0
        var canceledFailed = 0

        // --- 🔹 PROCESO DE VISITAS CANCELADAS ---
        val canceledVisits = aforoRepository.getCanceledVisits()
        for (visit in canceledVisits) {
            totalCanceled++
            try {
                val photos = galleryRepository.getData(
                    visitId = visit.id ?: 0,
                    mediaStorageType = MediaStorageType.AFORO_CANCELED_VISIT.ordinal
                )

                val photosObj = photos.map { it.toPhotoObject() }.toMutableList()
                aforoRepository.uploadCancelVisit(visit.toCancelRequestObject(photosObj), photos)
                updateUploadedCancelVisit(visit)
                canceledSuccess++

            } catch (exception: Exception) {
                Log.e("SYNC_ERROR", "Error al subir visita cancelada [${visit.id}]: ${exception.message}")

                try {
                    val respuesta = aforoRepository.validar_visita(visit.aforoId, visit.visitId)
                    when (respuesta.estado) {
                        VisitStatus.CANCELADO.status -> {
                            Log.w("SYNC_WARNING", "Visita cancelada ${visit.id} ya estaba cargada, se marca como sincronizada.")
                            updateUploadedCancelVisit(visit)
                            canceledSuccess++
                        }
                        else -> {
                            Log.e("SYNC_ERROR", "Visita cancelada ${visit.id} no se pudo sincronizar. Estado: ${respuesta.estado}")
                            canceledFailed++
                        }
                    }
                } catch (validationError: Exception) {
                    Log.e("SYNC_VALIDATION_ERROR", "Error validando visita cancelada ${visit.id}: ${validationError.message}")
                    canceledFailed++
                }
            }
        }

        val totalVisits = totalComplete + totalCanceled
        val totalSuccess = completeSuccess + canceledSuccess
        val totalFailed = completeFailed + canceledFailed

        val message = buildString {
            appendLine("🔄 Resumen de sincronización:")
            appendLine("--------------------------------------------------")
            appendLine("Visitas completas → Total: $totalComplete | Éxito: $completeSuccess | Fallidas: $completeFailed")
            appendLine("Visitas canceladas → Total: $totalCanceled | Éxito: $canceledSuccess | Fallidas: $canceledFailed")
            appendLine("--------------------------------------------------")
            append("Resultado total: $totalSuccess de $totalVisits sincronizadas correctamente.")
        }

        if (totalFailed == 0) {
            emit(Resource.success(message))
        } else {
            emit(Resource.error(data = null, msg = message))
        }
    }

    private suspend fun updateUploadedCompleteVisit(visit: Visit) {
        aforoRepository.updateUploadedVisit(visit.id!!, VisitType.VISIT_UPLOADED.status)
        val data = _completeVisit.value ?: listOf()
        data.map {
            if (it.id == visit.id) {
                it.status = VisitType.VISIT_UPLOADED.status
                it.updatedTime = System.currentTimeMillis().toString()
            }
        }
        _completeVisit.postValue(data)
    }

    private suspend fun updateUploadedCancelVisit(visit: Visit) {
        aforoRepository.updateUploadedVisit(visit.id!!, VisitType.VISIT_UPLOADED.status)
        val data = _canceledVisit.value ?: listOf()
        data.map {
            if (it.id == visit.id) {
                it.status = VisitType.VISIT_UPLOADED.status
                it.updatedTime = System.currentTimeMillis().toString()
            }
        }
        _canceledVisit.postValue(data)
    }


}