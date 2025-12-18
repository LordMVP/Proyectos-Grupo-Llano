package com.progracol.hya.ui.map.search.datasync;

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import androidx.lifecycle.viewModelScope
import com.progracol.core.common.MediaStorageType
import com.progracol.core.database.entities.Independence
import com.progracol.core.database.entities.SubscriptionDetail
import com.progracol.core.network.Resource
import com.progracol.core.repository.ANHRepository
import com.progracol.core.repository.GalleryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import java.io.File
import javax.inject.Inject

@HiltViewModel
class MapDataPendingViewModel @Inject constructor(
    private val anhRepository: ANHRepository,
    private val galleryRepository: GalleryRepository
): ViewModel() {

    private var _actualizacionesPendientes: MutableLiveData<List<SubscriptionDetail>> = MutableLiveData()
    val actualizacionesPendientesList: LiveData<List<SubscriptionDetail>> get() = _actualizacionesPendientes

    private var _independenciasPendientes: MutableLiveData<List<Independence>> = MutableLiveData()
    val independenciasPendientesList: LiveData<List<Independence>> get() = _independenciasPendientes

    private var _puntosPendientes: MutableLiveData<List<com.progracol.core.database.entities.Point>> = MutableLiveData()
    val puntosPendientesList: LiveData<List<com.progracol.core.database.entities.Point>> get() = _puntosPendientes

    fun loadActPending() {
        viewModelScope.launch(Dispatchers.IO) {
            val subscriptionsDetail = anhRepository.getPendingSubscriptions()
            _actualizacionesPendientes.postValue(subscriptionsDetail)
        }
    }

    fun loadIndPending() {
        viewModelScope.launch(Dispatchers.IO) {
            val independences = anhRepository.getPendingIndependences()
            _independenciasPendientes.postValue(independences)
        }
    }

    fun loadPointPending() {
        viewModelScope.launch(Dispatchers.IO) {
            val points = anhRepository.getPendingPoints()
            _puntosPendientes.postValue(points)
        }
    }

    suspend fun deleteActualizacion(actualizacion: SubscriptionDetail) = runBlocking {
        try {
            anhRepository.deleteSubscription(actualizacion.subscriptionCode.toString())
            val imagenes = galleryRepository.getData(actualizacion.subscriptionCode.toString(),0,0,0, MediaStorageType.HYA_DETAIL.ordinal)
            if (imagenes != null && !imagenes.isEmpty()) {
                imagenes.forEach {item ->
                    item.id?.let { galleryRepository.deleteById(it) }
                    item.url?.let { deleteImageFromPath(it) }
                }
            } else {
                Log.i("ELIMINAR ACTUALIZACIÓN", "NO SE ENCONTRARON IMAGENES PARA ELIMINAR.")
            }
            //galleryRepository.deleteByParameters(actualizacion.subscriptionCode.toString(),0,0,0, MediaStorageType.HYA_DETAIL.ordinal)
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
        }
    }

    suspend fun deleteIndependencia(independencia: Independence) {
        try {
            independencia.id?.let { anhRepository.deleteIndependence(it) }
            val imagenes = galleryRepository.getData(independencia.subscriptionCode.toString(),0,0,0, MediaStorageType.HYA_INDEPENDENCE.ordinal)
            if (imagenes != null && !imagenes.isEmpty()) {
                imagenes.forEach {item ->
                    item.id?.let { galleryRepository.deleteById(it) }
                    item.url?.let { deleteImageFromPath(it) }
                }
            } else {
                Log.i("ELIMINAR INDEPENDENCIA", "NO SE ENCONTRARON IMAGENES PARA ELIMINAR.")
            }
            //galleryRepository.deleteByParameters(independencia.subscriptionId.toString(),0,0,0, MediaStorageType.HYA_INDEPENDENCE.ordinal)
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
        }
    }

    suspend fun deletePoint(punto: com.progracol.core.database.entities.Point) {
        try {
            punto.id?.let { anhRepository.deletePoint(it) }
            punto.id?.let {
                val imagenes = galleryRepository.getData("",0,0,it, MediaStorageType.HYA_POINT.ordinal)
                if (imagenes != null && !imagenes.isEmpty()) {
                    imagenes.forEach {item ->
                        item.id?.let { galleryRepository.deleteById(it) }
                        item.url?.let { deleteImageFromPath(it) }
                    }
                } else {
                    Log.i("ELIMINAR PUNTO", "NO SE ENCONTRARON IMAGENES PARA ELIMINAR.")
                }
                //galleryRepository.deleteByParameters("",0,0,it, MediaStorageType.HYA_POINT.ordinal)
            }
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
        }
    }

    private fun deleteImageFromPath(path: String): Boolean {
        val file = File(path)
        return if (file.exists()) {
            file.delete()
        } else {
            false
        }
    }
}
