package com.progracol.hya.ui.map.offline

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import androidx.lifecycle.viewModelScope
import com.progracol.core.common.MediaStorageType
import com.progracol.core.database.entities.Independence
import com.progracol.core.database.entities.MarkerPointMap
import com.progracol.core.database.entities.SubscriptionDetail
import com.progracol.core.network.Resource
import com.progracol.core.repository.ANHRepository
import com.progracol.core.repository.ArcGISRepository
import com.progracol.core.repository.GalleryRepository
import com.progracol.core.repository.MarkerPointMapRepository
import com.progracol.core.repository.UserMapRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import java.io.File
import javax.inject.Inject

@HiltViewModel
class OfflineMapViewModel @Inject constructor(
    private val userMapRepository: UserMapRepository,
    private val arcGISRepository: ArcGISRepository,
    private val markerPointMapRepository: MarkerPointMapRepository
) : ViewModel() {

    fun getMap(id: Long) = liveData {
        val userMap = userMapRepository.getUserMapById(id)
        emit(userMap)
    }

    fun getArgGisToken() = liveData {
        emit(Resource.loading(null))
        try {
            val token = arcGISRepository.getToken()
            emit(Resource.success(token))
        } catch (exception: Exception) {
            Log.e("error", exception.localizedMessage)
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun getMarkersPointMap() = liveData {
        emit(Resource.loading(null))
        try {
            emit(Resource.success(markerPointMapRepository.getMarkersPointMap()))
        } catch (exception: Exception) {
            Log.e("error", exception.localizedMessage)
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun saveMarkerPointMap(markerPoint: MarkerPointMap) = liveData {
        emit(Resource.loading(true))
        try {
            val id: Long = markerPointMapRepository.saveMarkerPointMap(markerPoint)
            emit(Resource.success(id))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun deleteMarkerPointMap(markerPoint: MarkerPointMap) = liveData {
        emit(Resource.loading(true))
        try {
            markerPoint?.id?.let { markerPointMapRepository.delete(it) }
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun deleteAllMarkerPointMap() = liveData {
        emit(Resource.loading(true))
        try {
            markerPointMapRepository.deleteAll()
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }
}