package com.progracol.hya.ui.map.search.datasync;

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.network.Resource
import com.progracol.core.repository.ANHRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class MapDataSyncViewModel @Inject constructor(
        private val anhRepository: ANHRepository
): ViewModel() {

        var showResult = false
        var currentPage = 0
        var totalPages = 0

        //LISTA ACTUALIZACIONES SINCRONIZADAS SUSCRIPCION

        fun getListAstSyncSubscription(id: Long) = liveData {
                emit(Resource.loading(null))
                try {
                        val resp = anhRepository.getListActSyncSubscription(id,currentPage)
                        totalPages = resp.totalPages
                        emit(Resource.success(resp.content))
                        showResult = true
                } catch (exception: Exception) {
                        Log.e("error", exception.stackTraceToString())
                        emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
                }
        }

        fun next() {
                currentPage++
        }

        fun back() {
                currentPage--
        }

        fun clear() {
                showResult = false
                currentPage = 0
                totalPages = 0
        }

        fun getImagenesActualizacion(id: Long) = liveData {
                emit(Resource.loading(null))
                try {
                        val resp = anhRepository.getImagenesActualizacion(id)
                        emit(Resource.success(resp))
                } catch (exception: Exception) {
                        Log.e("error", exception.stackTraceToString())
                        emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
                }
        }
}
