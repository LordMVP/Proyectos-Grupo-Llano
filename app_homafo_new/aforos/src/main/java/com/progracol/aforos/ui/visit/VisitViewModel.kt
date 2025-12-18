package com.progracol.aforos.ui.visit

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import androidx.lifecycle.viewModelScope
import com.progracol.aforos.common.VisitType
import com.progracol.core.database.entities.Visit
import com.progracol.core.domain.ArcGISUseCase
import com.progracol.core.domain.model.MapsItem
import com.progracol.core.network.Resource
import com.progracol.core.repository.AforoRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class VisitViewModel @Inject constructor(
    private val arcGisUseCase: ArcGISUseCase,
    private val aforoRepository: AforoRepository
) : ViewModel() {

    //Map Item
    val arcgisMapItemModel = MutableLiveData<List<MapsItem>>()

    var totalVisits: List<Visit> = mutableListOf()

    private var _visitLiveData: MutableLiveData<List<Visit>> = MutableLiveData()
    val visitLiveData: LiveData<List<Visit>> get() = _visitLiveData

    fun onCreate() {
        viewModelScope.launch {
            try {
                val result = arcGisUseCase()
                arcgisMapItemModel.postValue(result)
            } catch (exception: Exception) {
                Log.e(VisitViewModel::class.simpleName, exception.stackTraceToString())
            }
        }
    }

    fun getVisit(visitType: VisitType) = liveData {
        emit(Resource.loading(null))
        try {
            val visits =
                when(visitType) {
                    VisitType.VISIT_COMPLETE -> aforoRepository.getCompleteVisits()
                    VisitType.VISIT_PENDING -> aforoRepository.getPendingVisits()
                    VisitType.VISIT_CANCELED -> aforoRepository.getCanceledVisits()
                    VisitType.VISIT_UPLOADED -> aforoRepository.getUploadedVisits()
                    VisitType.ASSING_VISIT -> aforoRepository.getPendingVisits()
                    else -> listOf()
                }
            totalVisits = visits
            _visitLiveData.postValue(visits)
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.localizedMessage)
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun downloadVisits() = liveData(Dispatchers.IO) {
        emit(Resource.loading(null))
        try {
            val visitResp = aforoRepository.getVisits()

            val visitsDB = aforoRepository.getVisitsDB()
            val visits: MutableList<Visit> = mutableListOf()
            visitResp.forEach { visit ->
                val savedVisit = visitsDB.find { sv ->  sv.visitId == visit.idVisit }
                if (savedVisit == null) {
                    visits.add(
                        Visit(
                            null,
                            visit.nameEstablishment,
                            visit.capacityClass,
                            visit.capacityType,
                            visit.font,
                            visit.subscription,
                            visit.totalVisits,
                            visit.madeVisits,
                            visit.assignmentDate,
                            visit.subscriptionCodeBio,
                            visit.idAforo,
                            visit.idVisit,
                            visit.consecutiveVisit,
                            visit.caseNumber,
                            visit.observation,
                            visit.neighborhood,
                            visit.address,
                            visit.week,
                            VisitType.VISIT_PENDING.status,
                            userCodeMulti = visit.subscriptionCodeBioMulti ?: ""
                        )
                    )
                }
            }
            if (visits.isNotEmpty()) aforoRepository.saveVisits(visits)

            val pendingVisits = aforoRepository.getPendingVisits()
            _visitLiveData.postValue(pendingVisits)
            emit(Resource.success(visits.count()))
        } catch (exception: Exception) {
            Log.e("error", exception.localizedMessage)
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }
}