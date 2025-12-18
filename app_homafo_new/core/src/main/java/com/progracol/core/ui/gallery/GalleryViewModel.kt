package com.progracol.core.ui.gallery

import android.net.Uri
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.progracol.core.common.MediaStorageType
import com.progracol.core.database.entities.MediaStorage
import com.progracol.core.repository.GalleryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import javax.inject.Inject

@HiltViewModel
class GalleryViewModel @Inject constructor(
    private val galleryRepository: GalleryRepository
) : ViewModel() {

    var subscriptionId: String = ""
    var noveltyId: Long = 0
    var visitId: Long = 0
    var pointId: Long = 0
    var addNote: Boolean = false
    var maxPhotos: Int = 50
    var mediaStorageType: MediaStorageType = MediaStorageType.HYA_DETAIL

    private var _photosLiveData: MutableLiveData<List<MediaStorage>> = MutableLiveData()
    val photosLiveData: LiveData<List<MediaStorage>> get() = _photosLiveData

    fun loadPhotos() = runBlocking {
        launch(Dispatchers.IO) {
            val photos = galleryRepository.getData(subscriptionId, noveltyId, visitId, pointId, mediaStorageType.ordinal)
            _photosLiveData.postValue(photos)
        }
    }

    fun addPhoto(uri: Uri, note: String = "") = runBlocking {
        galleryRepository.insert(
            MediaStorage(
                id = null,
                subscriptionId = subscriptionId,
                noveltyId = noveltyId,
                visitId = visitId,
                pointId = pointId,
                url = uri.path,
                mediaStorageType = mediaStorageType.ordinal,
                note = note
            )
        )
        val photos = galleryRepository.getData(subscriptionId, noveltyId, visitId, pointId, mediaStorageType.ordinal)
        _photosLiveData.postValue(photos)
    }

    fun deletePhoto(mediaStorageEntity: MediaStorage) = runBlocking {
        mediaStorageEntity.id?.let {
            galleryRepository.deleteById(it)
            val photos = galleryRepository.getData(subscriptionId, noveltyId, visitId, pointId,mediaStorageType.ordinal)
            _photosLiveData.postValue(photos)
        }
    }

}