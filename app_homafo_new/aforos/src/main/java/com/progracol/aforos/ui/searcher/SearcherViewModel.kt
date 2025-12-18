package com.progracol.aforos.ui.searcher

import android.util.Log
import androidx.lifecycle.*
import com.google.ar.sceneform.resources.ResourceRegistry
import com.progracol.aforos.common.VisitType
import com.progracol.core.database.BaseEntity
import com.progracol.core.database.entities.ParamBillingSegment
import com.progracol.core.database.entities.ParamCommercialActivity
import com.progracol.core.database.entities.Visit
import com.progracol.core.network.Resource
import com.progracol.core.repository.ANHRepository
import com.progracol.core.repository.AforoRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SearcherViewModel @Inject constructor(
    private val aforoRepository: AforoRepository,
    private val andRepository: ANHRepository
): ViewModel() {


    fun getBillingSegement() = liveData(Dispatchers.IO) { emit((aforoRepository.getBillingSegment()))}
    fun getCommercialActivities() = liveData(Dispatchers.IO) { emit(andRepository.getCommercialActivities()) }


    fun getVisitType(): List<VisitTypeData> {
        val visitTypes = mutableListOf<VisitTypeData>(VisitTypeData(code = "1", name = "ORDINARIO"),VisitTypeData(code = "2", name = "MULTIUSUARIO"))
        return visitTypes
    }


    fun search(businessName: String,
               caseNumber: String,
               userCode: String,
               visitType: String
               ) = liveData(Dispatchers.IO) {
        emit(Resource.loading(null))
        try {
            val visitsSearch = aforoRepository.getVisitSearch(businessName, caseNumber, userCode, visitType)
            emit(Resource.success(visitsSearch))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

}

data class VisitTypeData(override var code: String, override var name: String?): BaseEntity ()