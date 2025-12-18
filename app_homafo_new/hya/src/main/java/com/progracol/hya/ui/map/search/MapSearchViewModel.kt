package com.progracol.hya.ui.map.search

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.database.entities.SubscriptionDetail
import com.progracol.core.network.Resource
import com.progracol.core.repository.ANHRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import javax.inject.Inject

@HiltViewModel
class MapSearchViewModel @Inject constructor(
    private val anhRepository: ANHRepository
): ViewModel() {

    var showResult = false
    var currentPage = 0
    var totalPages = 0

    fun getCompanies() = liveData(Dispatchers.IO) { emit( anhRepository.getCompanies()) }

    fun getNeighborhoods() = liveData(Dispatchers.IO) { emit( anhRepository.getNeighborhoods()) }

    fun getStates() = liveData(Dispatchers.IO) { emit( anhRepository.getStates()) }

    // SEARCH

    fun search(companyId: String?, meter: String?, codeCompany: String?, subscriptionId: String?, address: String?, neighborhood: String?, pqr: String?, state: String?) = liveData {
        emit(Resource.loading(null))
        try {

            val data = hashMapOf(
                "idempresa" to getDefaultValue(companyId),
                "medidor" to getDefaultValue(meter),
                "pcodigoalterna" to getDefaultValue(codeCompany),
                "pcodigobio" to getDefaultValue(subscriptionId),
                "direccion" to getDefaultValue(address),
                "idbarrio" to getDefaultValue(neighborhood),
                "numpqr" to getDefaultValue(pqr),
                "estado" to getDefaultValue(state)
            )
            val resp = anhRepository.search(currentPage, data = data)
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

    private fun getDefaultValue(value: String?) : String? {
        return value?.ifEmpty { null }
    }
}