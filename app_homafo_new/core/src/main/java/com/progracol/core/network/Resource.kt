package com.progracol.core.network

import org.json.JSONObject
import retrofit2.HttpException

data class Resource<out T>(val status: Status, val data: T?, val message: String?) {

    enum class Status {
        LOADING,
        SUCCESS,
        ERROR
    }

    companion object {
        fun <T> success(data: T?): Resource<T> {
            return Resource(Status.SUCCESS, data, null)
        }

        fun <T> error(msg: String, data: T?): Resource<T> {
            return Resource(Status.ERROR, data, msg)
        }

        fun <T> loading(data: T?): Resource<T> {
            return Resource(Status.LOADING, data, null)
        }

        fun convertErrorBody(throwable: HttpException): JSONObject? {
            return try {
                return JSONObject(throwable.response()!!.errorBody()!!.string())
            } catch (exception: Exception) {
                null
            }
        }
    }
}
