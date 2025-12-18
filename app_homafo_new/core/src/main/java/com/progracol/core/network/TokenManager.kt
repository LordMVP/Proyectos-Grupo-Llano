package com.progracol.core.network

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.progracol.core.data.AccessToken
import dagger.hilt.android.qualifiers.ApplicationContext
import java.util.*
import java.util.concurrent.TimeUnit
import javax.inject.Inject

class TokenManager @Inject constructor(
    @ApplicationContext val context: Context
) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)

    companion object {
        const val PREFERENCES_NAME = "llanogrande"
        const val ACCESS_TOKEN = "access_token"
    }

    /**
     * set save tokens
     * @param token
     */
    fun saveToken(token: AccessToken, selectedCompanyId: String? = null, selectedCompanyName: String? = null) {
        prefs.edit().putString("ACCESS_TOKEN", token.token).apply()
        prefs.edit().putString("COMPANY_CODE", selectedCompanyId).apply()
        prefs.edit().putString("COMPANY_NAME", selectedCompanyName).apply()
    }

    /**
     * remove token
     */
    fun deleteToken() {
        //prefs.edit().remove("ACCESS_TOKEN").apply();
        val settings = context.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)
        settings.edit().clear().commit()
    }

    /**
     * accessand refresh token
     */
    fun getToken(): AccessToken {
        val token = AccessToken()
        token.token = prefs.getString("ACCESS_TOKEN", "").toString()
        return token
    }

    fun setLastSync(date: String) {
        prefs.edit().putString("DATE_SYNC", date).apply()
    }

    fun getLastSync(): String {
        return prefs.getString("DATE_SYNC", "").toString()
    }

    fun getCompany(): String {
        return prefs.getString("COMPANY_NAME", "").toString()
    }

    fun saveCurrent(pqr: String) {
        prefs.edit().putString("PQR", pqr).apply()
    }

    fun getCurrent() : String {
        return prefs.getString("PQR", "").toString()
    }

    fun getArcGisToken() : String {
        val tokenExp = prefs.getString("ARCGIS_TOKEN_EXP", "").toString()
        if (tokenExp.isNotEmpty()) {
            val tokenExpDate = Date(tokenExp.toLong())
            val current = System.currentTimeMillis()
            val dif = current - tokenExpDate.time
            val diffInHours = TimeUnit.MILLISECONDS.toHours(dif)
            if (diffInHours > 24)
                return ""
            return prefs.getString("ARCGIS_TOKEN", "").toString()
        }
        return ""
    }

    fun saveArcGisToken(token: String) {
        Log.i("TokenManage", "saving token: $token")
        val current = System.currentTimeMillis() //1000
        prefs.edit().putString("ARCGIS_TOKEN", token).apply()
        prefs.edit().putString("ARCGIS_TOKEN_EXP", current.toString()).apply()
    }

}