package com.progracol.hya.ui.map

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import androidx.lifecycle.viewModelScope
import com.esri.arcgisruntime.data.ServiceFeatureTable
import com.esri.arcgisruntime.geometry.Point
import com.esri.arcgisruntime.layers.FeatureLayer
import com.progracol.core.database.entities.MarkerPointMap
import com.progracol.core.database.entities.UserMap
import com.progracol.core.domain.model.FeatureLayerItem
import com.progracol.core.network.Resource
import com.progracol.core.repository.ArcGISRepository
import com.progracol.core.repository.MarkerPointMapRepository
import com.progracol.core.repository.UserMapRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MapViewModel @Inject constructor(
    private val arcGISRepository: ArcGISRepository,
    private val userMapRepository: UserMapRepository,
    private val markerPointMapRepository: MarkerPointMapRepository
) : ViewModel() {
    var mapIdPortal: String = ""
    var path: String = ""
    var mapName: String = ""

    //TOKEN ARCGIS
    private var _tokenArcgis: String? = null
    val tokenArcgis: String? get() = _tokenArcgis

    //CAPAS DEL MAPA ARCGIS
    private var _layersMap: MutableList<FeatureLayerItem> = mutableListOf()
    val layersMap: MutableList<FeatureLayerItem> get() = _layersMap

    suspend fun initMap() {
        if (_tokenArcgis == null) {
            _tokenArcgis = arcGISRepository.getToken()
        }

        if (_layersMap.isEmpty() == true) {
            for (item in arcGISRepository.getAllLayersMap()) {
                val layerItem = FeatureLayer(ServiceFeatureTable(item.url.replace("?token=", "")))
                _layersMap.add(FeatureLayerItem(item.name,false,layerItem))
            }
        }
    }

    fun saveUserMap(userMap: UserMap) = liveData {
        emit(Resource.loading(true))
        try {
            userMapRepository.saveUserMap(userMap)
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
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

class SharedViewModel : ViewModel() {
    //Ejecutar Funcion Compartidad, no se usa por ahora.
    var onPortalSelected: (() -> Unit)? = null

    val selectedCoordinates = MutableLiveData<Point>()
    var markerCoordinates: Point? = null
}

object MapRepository {
    var markerCoordinates: Point? = null
}