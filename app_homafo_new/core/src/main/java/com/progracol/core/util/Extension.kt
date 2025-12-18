package com.progracol.core.util

import com.progracol.core.database.entities.MediaStorage
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.util.regex.Pattern

fun String.isEmailValid(): Boolean {
    val expression = "^[\\w.-]+@([\\w\\-]+\\.)+[A-Z]{2,8}$"
    val pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE)
    val matcher = pattern.matcher(this)
    return matcher.matches()
}

fun List<MediaStorage>.toMultipartBody(): List<MultipartBody.Part> {
    val multipartBody: MutableList<MultipartBody.Part> = mutableListOf()
    this.forEach { photo ->
        val file = File(photo.url ?: "")
        multipartBody.add(
            MultipartBody.Part.createFormData("images",
                file.name,
                file.asRequestBody("image/jpeg".toMediaTypeOrNull()))
        )
    }
    return multipartBody
}