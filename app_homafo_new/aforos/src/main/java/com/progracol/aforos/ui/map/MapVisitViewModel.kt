package com.progracol.aforos.ui.map

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.network.Resource
import com.progracol.core.repository.ArcGISRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class MapVisitViewModel @Inject constructor(
    private val arcGISRepository: ArcGISRepository
) : ViewModel() {

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
}