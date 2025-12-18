package com.progracol.hya.ui.map.sync

import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.common.MediaStorageType
import com.progracol.core.common.UploadStatus
import com.progracol.core.database.entities.Independence
import com.progracol.core.database.entities.MediaStorage
import com.progracol.core.database.entities.Novelty
import com.progracol.core.database.entities.Point
import com.progracol.core.database.entities.SubscriptionDetail
import com.progracol.core.network.Resource
import com.progracol.core.repository.ANHRepository
import com.progracol.core.repository.GalleryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import java.io.File
import java.text.DateFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.inject.Inject

@HiltViewModel
class SyncViewModel @Inject constructor(
    private val anhRepository: ANHRepository,
    private val galleryRepository: GalleryRepository
) : ViewModel() {

    private var _subscription: MutableLiveData<List<SubscriptionDetail>> = MutableLiveData()
    val subscription: LiveData<List<SubscriptionDetail>> get() = _subscription

    private var _novelties: MutableLiveData<List<Novelty>> = MutableLiveData()
    val novelties: LiveData<List<Novelty>> get() = _novelties

    private var _independences: MutableLiveData<List<Independence>> = MutableLiveData()
    val independences: LiveData<List<Independence>> get() = _independences

    private var _points: MutableLiveData<List<Point>> = MutableLiveData()
    val points: LiveData<List<Point>> get() = _points

    fun loadPendingSubscriptionNoveltyIndependence() = runBlocking {
        launch(Dispatchers.IO) {
            val pendingSubscriptions = anhRepository.getPendingSubscriptions()
            _subscription.postValue(pendingSubscriptions)
            val pendingNovelties = anhRepository.getPendingNovelties()
            _novelties.postValue(pendingNovelties)
            val pendingIndependence = anhRepository.getPendingIndependences()
            _independences.postValue(pendingIndependence)
            val pendingPoint = anhRepository.getPendingPoints()
            _points.postValue(pendingPoint)
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    fun sync() = liveData {
        emit(Resource.loading(true))
        try {
            val subscriptionsDetail = anhRepository.getPendingSubscriptions()
            _subscription.postValue(subscriptionsDetail)
            subscriptionsDetail.forEach { subscription ->
                val imagenes = galleryRepository.getData(
                    subscriptionId = subscription.subscriptionCode ?: "",
                    mediaStorageType = MediaStorageType.HYA_DETAIL.ordinal
                )
                try {
                    anhRepository.updateSubscription(subscription.toRequestObject(), imagenes)
                    updateUploadedSubscription(subscription,imagenes)
                } catch (exception: Exception) {
                    Log.e("error", exception.stackTraceToString())
                    //emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
                }
            }
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            //emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }

       try {
            val independences = anhRepository.getPendingIndependences()
            _independences.postValue(independences)
            independences.forEach { independence ->
                try {
                    val imagenes = galleryRepository.getData(
                        subscriptionId = independence.subscriptionCode ?: "",
                        mediaStorageType = MediaStorageType.HYA_INDEPENDENCE.ordinal
                    )
                    anhRepository.updateIndependence(independence.toRequestObject(),imagenes)
                    updateUploadedIndependence(independence,imagenes)
                } catch (exception: Exception) {
                    Log.e("error", exception.stackTraceToString())
                    //emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
                }
            }

            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            //emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }

        try {
            val novelties = anhRepository.getPendingNovelties()
            _novelties.postValue(novelties)
            novelties.forEach { novelty ->
                try {
                    val photos = galleryRepository.getData(
                        subscriptionId = novelty.subscriptionId ?: "",
                        noveltyId = novelty.id ?: 0,
                        mediaStorageType = MediaStorageType.HYA_NOVELTY.ordinal
                    )

                    val initFormatDate =
                        DateTimeFormatter.ofPattern("dd-MM-yyyy", java.util.Locale.ENGLISH)
                    val convertToDate = LocalDate.parse(novelty.date, initFormatDate)
                    val toFormatDate = DateTimeFormatter.ofPattern("yyyy-MM-dd")
                    convertToDate.format(toFormatDate)
                    novelty.date = convertToDate.toString()

                    anhRepository.updateNovelty(novelty.toRequestObject(), photos)

                    updateUploadedNovelty(novelty)
                } catch (exception: Exception) {
                    Log.e("error", exception.stackTraceToString())
                    //emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
                }

            }
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            //emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }

        try {
            val points = anhRepository.getPendingPoints()
            _points.postValue(points)
            points.forEach { point ->
                try {
                    val imagenes = galleryRepository.getData(
                        pointId = point.id ?: 0,
                        mediaStorageType = MediaStorageType.HYA_POINT.ordinal
                    )
                    anhRepository.updatePoint(point.toRequestObject(),imagenes)
                    updateUploadedPoint(point,imagenes)
                } catch (exception: Exception) {
                    Log.e("error", exception.stackTraceToString())
                    //emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
                }
            }

            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.stackTraceToString())
            //emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }

    }

    private suspend fun updateUploadedSubscription(subscription: SubscriptionDetail, imagenes: List<MediaStorage>) {
        anhRepository.deleteSubscription(subscription.subscriptionCode ?: "")
        val data = _subscription.value ?: listOf()
        data.map {
            if (it.id == subscription.id)
                it.status = UploadStatus.UPLOADED.status
        }
        _subscription.postValue(data)
        if (imagenes != null && !imagenes.isEmpty()) {
            imagenes.forEach {item ->
                item.id?.let { galleryRepository.deleteById(it) }
                item.url?.let { deleteImageFromPath(it) }
            }
        } else {
            Log.i("ELIMINAR ACTUALIZACIÓN", "NO SE ENCONTRARON IMAGENES PARA ELIMINAR.")
        }
    }

    private suspend fun updateUploadedNovelty(novelty: Novelty) {
        anhRepository.deleteNovelty(novelty.id ?: 0)
        val data = _novelties.value ?: listOf()
        data.map {
            if (it.id == novelty.id)
                it.status = UploadStatus.UPLOADED.status
        }
        _novelties.postValue(data)
    }

    private suspend fun updateUploadedIndependence(independence: Independence, imagenes: List<MediaStorage>) {
        anhRepository.deleteIndependence(independence.id!!)
        val data = _independences.value ?: listOf()
        data.map {
            if (it.id == independence.id)
                it.status = UploadStatus.UPLOADED.status
        }
        _independences.postValue(data)
        if (imagenes != null && !imagenes.isEmpty()) {
            imagenes.forEach {item ->
                item.id?.let { galleryRepository.deleteById(it) }
                item.url?.let { deleteImageFromPath(it) }
            }
        } else {
            Log.i("ELIMINAR INDEPENDENCIA", "NO SE ENCONTRARON IMAGENES PARA ELIMINAR.")
        }
    }

    private suspend fun updateUploadedPoint(point: Point, imagenes: List<MediaStorage>) {
        anhRepository.deletePoint(point.id!!)
        val data = _points.value ?: listOf()
        data.map {
            if (it.id == point.id)
                it.status = UploadStatus.UPLOADED.status
        }
        _points.postValue(data)
        if (imagenes != null && !imagenes.isEmpty()) {
            imagenes.forEach {item ->
                item.id?.let { galleryRepository.deleteById(it) }
                item.url?.let { deleteImageFromPath(it) }
            }
        } else {
            Log.i("ELIMINAR PUNTO", "NO SE ENCONTRARON IMAGENES PARA ELIMINAR.")
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