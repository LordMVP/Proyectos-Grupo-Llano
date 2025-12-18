package com.progracol.aforos.ui.visit.register

import android.util.Log
import androidx.lifecycle.*
import androidx.lifecycle.viewmodel.CreationExtras
import com.progracol.core.common.MediaStorageType
import com.progracol.core.database.entities.VisitConcept
import com.progracol.core.network.Resource
import com.progracol.core.database.entities.Visit
import com.progracol.core.repository.AforoRepository
import com.progracol.core.repository.GalleryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import javax.inject.Inject

@HiltViewModel
class RegisterVisitViewModel @Inject constructor(
    private val aforoRepository: AforoRepository,
    private val galleryRepository: GalleryRepository
) : ViewModel() {

    var visitId: Long = 0

    var subscriptionId: String = ""
    var pqr: String = ""
    var currentVolume = 0F
    var visitType = ""

   private var mediaStorageType: MediaStorageType = MediaStorageType.AFORO_COMPLETE_VISIT

    private var _visit: MutableLiveData<Visit> = MutableLiveData()
    val visit: LiveData<Visit>
        get() = _visit

    private var _visitConcepts: MutableLiveData<List<VisitConcept>> = MutableLiveData()
    val visitConcepts: LiveData<List<VisitConcept>>
        get() = _visitConcepts

    fun getContainerType() = liveData(Dispatchers.IO) {
        emit( aforoRepository.getContainerType())
    }

    fun getVisit(id: Long) = runBlocking {
        aforoRepository.getVisit(id)?.let {
            visitId = it.id!!
            _visit.postValue(it)
            val concepts = aforoRepository.getVisitConceptsByVisitId(it.id!!)
            _visitConcepts.postValue(concepts)
        }
    }

    fun addVisitConcept(concept: String, conceptCode: Int, quantity: Double, volume: Double, weight: Double, note: String) {
        val data = _visitConcepts.value ?: listOf()
        val concepts = data.toMutableList()
        var volumeConcept = volume
        if (visitType.uppercase() == "MULTIUSUARIO") volumeConcept = 0.0
        val concept = VisitConcept(
            id = if (concepts.isEmpty()) 1 else concepts.last().id?.plus(1),
            concept = concept,
            conceptCode = conceptCode,
            quantity = quantity,
            volume = volumeConcept,
            weight = weight,
            visitId = visitId,
            note = note
        )
        concepts.add(concept)
        _visitConcepts.postValue(concepts)
    }

    fun deleteVisitConcept(id: Long) = runBlocking {
        val data = _visitConcepts.value ?: listOf()
        val meters = data.filter { it.id != id }
        _visitConcepts.postValue(meters)
    }

    fun saveVisit(visit: Visit) = liveData {
        emit(Resource.loading(true))
        try {
            aforoRepository.updateVisit(visit)
            val visitConcepts = visitConcepts.value ?: listOf()
            visitConcepts.map {
                it.id = null
                it.visitId = visit.id
            }
            aforoRepository.saveVisitConcepts(visitConcepts)
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun checkVisit() = liveData{
        val photos = galleryRepository.getData(subscriptionId, noveltyId = 0, visitId, pointId = 0,mediaStorageType.ordinal)
        Log.e("photo visit", photos.toString())
        if (visitConcepts.value!!.isEmpty()) {
            emit(Resource.error(data = null, msg = "Debe añadir un concepto de visita"))
        } else if (photos.isEmpty()){
            emit(Resource.error(data = null, msg = "Debe añadir una fotografia."))
        } else {
            emit(Resource.loading(true))
            emit(Resource.success(true))
        }
    }







}