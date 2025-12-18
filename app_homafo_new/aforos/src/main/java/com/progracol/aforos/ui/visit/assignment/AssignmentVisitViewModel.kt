package com.progracol.aforos.ui.visit.assignment

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.network.Resource
import com.progracol.core.repository.ArcGISRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class AssignmentVisitViewModel @Inject constructor(
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