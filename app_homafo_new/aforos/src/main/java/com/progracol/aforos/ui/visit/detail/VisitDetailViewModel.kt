package com.progracol.aforos.ui.visit.detail

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.common.MediaStorageType
import com.progracol.core.database.entities.MediaStorage
import com.progracol.core.database.entities.Visit
import com.progracol.core.database.entities.VisitConcept
import com.progracol.core.network.Resource
import com.progracol.core.repository.AforoRepository
import com.progracol.core.repository.GalleryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import javax.inject.Inject

@HiltViewModel
class VisitDetailViewModel @Inject constructor(
    private val aforoRepository: AforoRepository,
    private val galleryRepository: GalleryRepository
) : ViewModel() {

    lateinit var visit: Visit

    private var _visitConcepts: MutableLiveData<List<VisitConcept>> = MutableLiveData()
    val visitConcepts: LiveData<List<VisitConcept>>
        get() = _visitConcepts

    private var _photos: MutableLiveData<List<MediaStorage>> = MutableLiveData()
    val photos: LiveData<List<MediaStorage>>
        get() = _photos

    fun getAllVisitConcepts() = runBlocking {
        launch(Dispatchers.IO) {
            val visitConcepts = aforoRepository.getVisitConceptsByVisitId(visit.id ?: 0)
            _visitConcepts.postValue(visitConcepts)
            val photos = galleryRepository.getData(visitId = visit.id ?: 0, mediaStorageType = MediaStorageType.AFORO_COMPLETE_VISIT.ordinal)
            _photos.postValue(photos)
        }
    }

}