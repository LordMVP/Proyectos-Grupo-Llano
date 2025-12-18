package com.progracol.core.network

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import okhttp3.Interceptor
import okhttp3.Response
import okio.IOException
import java.net.InetSocketAddress
import java.net.Socket
import javax.inject.Inject

class AuthInterceptor @Inject constructor(
    private val tokenManager: TokenManager
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val requestBuilder = chain.request().newBuilder()

        // If token has been saved, add it to the request
        tokenManager.getToken().token?.let {
            if(!it.equals("MENTIRA")){
                requestBuilder.addHeader("Authorization", it)
            }
        }

        return chain.proceed(requestBuilder.build())
    }
}