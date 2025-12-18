package com.progracol.hya.ui.homologationupdate

import android.util.Log
import androidx.lifecycle.*
import com.progracol.core.database.entities.UserMap
import com.progracol.core.domain.ArcGISUseCase
import com.progracol.core.domain.model.MapsItem
import com.progracol.core.network.Resource
import com.progracol.core.repository.UserMapRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject

@HiltViewModel
class HomologationAndUpdateViewModel @Inject constructor(
    private val arcGisUseCase: ArcGISUseCase,
    private val mapRepository: UserMapRepository
) : ViewModel() {

    //Map Item
    val arcgisMapItemModel = MutableLiveData<List<MapsItem>>()

    //User Maps List

    private lateinit var allMaps: List<UserMap>
    private var _userMaps: MutableLiveData<List<UserMap>> = MutableLiveData()
    val userMaps: LiveData<List<UserMap>> get() = _userMaps

    fun onCreate() {
        viewModelScope.launch {
            try {
                val result = arcGisUseCase()
                arcgisMapItemModel.postValue(result)
            } catch (exception: Exception) {
                Log.e(HomologationAndUpdateViewModel::class.simpleName, exception.stackTraceToString())
            }
        }
    }

    fun loadMaps() {
        viewModelScope.launch(Dispatchers.IO) {
            val resp = mapRepository.getUserMaps()
            allMaps = resp
            _userMaps.postValue(resp)
        }
    }

    fun deleteUserMap(userMap: UserMap) = liveData(Dispatchers.IO) {
        emit(Resource.loading(true))
        try{
            File(userMap.path!!).deleteRecursively()
            mapRepository.deleteUserMap(userMap.id ?: 0)
            val maps = mapRepository.getUserMaps()
            _userMaps.postValue(maps)
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e(this.javaClass.simpleName, exception.stackTraceToString())
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun filterMaps(query: String) {
        val result = allMaps.filter { (it.name ?: "").contains(query, true) }
        _userMaps.postValue(result)
    }

}