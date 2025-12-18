package com.progracol.login.ui.recoverpassword

import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.progracol.core.network.Resource
import com.progracol.core.repository.LoginRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class RecoverPasswordViewModel @Inject
constructor(private val loginRepository: LoginRepository): ViewModel() {

    fun recoverPassword(email: String) = liveData {
        emit(Resource.loading(null))
        try {
            emit(Resource.success((loginRepository.recoverPassword(email))))
        } catch (throwable: Throwable) {
            /*when (throwable) {
                is HttpException -> {
                    val code = throwable.code()
                    if (code == 404) {
                        val errorResponse = Resource.convertErrorBody(throwable)
                        emit(
                            Resource.error(
                                data = null,
                                msg = errorResponse?.getString("message") ?: "Error Occurred!"
                            )
                        )
                    } else {
                        emit(
                            Resource.error(
                                data = null,
                                msg = throwable.message ?: "Error Occurred!"
                            )
                        )
                    }
                }
                else -> {
                    emit(Resource.error(data = null, msg = throwable.message ?: "Error Occurred!"))
                }
            }*/
        }
    }
}