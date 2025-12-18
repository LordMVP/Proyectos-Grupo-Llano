package com.progracol.core.repository

import com.progracol.core.network.APIClient
import javax.inject.Inject

class LoginRepository @Inject constructor(
    private val service: APIClient
) {

    suspend fun login(email: String, password: String,selectedCompany: String) = service.login(
        mapOf("username" to (email),
            "password" to (password),
            "idEmpresa" to (selectedCompany)
        )
    )

    suspend fun getCompanies() = service.getCompanies()

    suspend fun recoverPassword(email: String) = service.recoverPassword(
        hashMapOf("email" to email)
    )

    suspend fun getMenuOptions() = service.getMenuOptions()

}

