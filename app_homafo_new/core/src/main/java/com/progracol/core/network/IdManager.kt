package com.progracol.core.network

import android.content.Context
import android.content.SharedPreferences
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class IdManager @Inject constructor(
    @ApplicationContext val context: Context
) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object{
        const val PREFS_NAME = "grandellano"
    }

    /**
     * set save id
     * @param id
     */
    fun saveId(id: Int){
        prefs.edit().putInt("ACCESS_ID", id).apply()
    }

    /**
     * remove id
     */
    fun deleteId() {
        prefs.edit().remove("ACCESS_ID").apply()
    }

    /**
     * accessand refresh id
     */
    fun getId(): Int {
        return prefs.getInt("ACCESS_ID", 0)
    }
}