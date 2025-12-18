package com.progracol.login.ui.login

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.data.AccessToken
import com.progracol.core.network.Resource
import com.progracol.core.network.TokenManager
import com.progracol.core.repository.LoginRepository
import com.progracol.core.data.Company
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val loginRepository: LoginRepository,
    private val tokenManager: TokenManager
) : ViewModel() {

    private var _companiesLiveData: MutableLiveData<List<Company>> = MutableLiveData()
    val companiesLiveData: LiveData<List<Company>>
        get() = _companiesLiveData

    private lateinit var selectedCompany: Company

    fun isLogged() = tokenManager.getToken().token?.isNotBlank() ?: false

    fun setSelectedCompany(company: Company) {
        selectedCompany = company
    }

    fun getCompanies() = liveData {
        Log.e("Login", "getting companies1")
        emit(Resource.loading(null))
        try {
            Log.e("Login", "getting companies2")
            val companies =  loginRepository.getCompanies()
            Log.e("Login", loginRepository.toString())
            _companiesLiveData.postValue(companies)
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.localizedMessage)
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun login(email: String, password: String) = liveData {
        emit(Resource.loading(null))
        try {
            val token = loginRepository.login(email, password, selectedCompany.id)
            tokenManager.saveToken(token, selectedCompany.id, selectedCompany.displayName)
            emit(Resource.success(token))
        } catch (exception: Exception) {
            Log.e("error", exception.localizedMessage)
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

}