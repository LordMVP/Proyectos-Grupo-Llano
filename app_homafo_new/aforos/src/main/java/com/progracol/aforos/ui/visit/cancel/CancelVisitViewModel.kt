package com.progracol.aforos.ui.visit.cancel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.common.MediaStorageType
import com.progracol.core.network.Resource
import com.progracol.core.repository.AforoRepository
import com.progracol.core.repository.GalleryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class CancelVisitViewModel @Inject constructor(
    private val aforoRepository: AforoRepository,
    private val galleryRepository: GalleryRepository
) : ViewModel() {

    var visitId: Long = 0
    var note: String = ""
    private var mediaStorageType: MediaStorageType = MediaStorageType.AFORO_CANCELED_VISIT

    fun cancelVisit() = liveData {
        val photos = galleryRepository.getData("", noveltyId = 0, visitId, 0,mediaStorageType.ordinal)
        Log.e("photo visit", photos.toString())
        try {
            if (photos.isEmpty()){
                emit(Resource.error(data = null, msg = "Debe añadir una fotografia."))
            } else {
                emit(Resource.loading(true))
                aforoRepository.cancelVisit(visitId, note)
                emit(Resource.success(true))
            }
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }
}