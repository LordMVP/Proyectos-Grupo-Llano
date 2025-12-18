package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.progracol.core.database.entities.UserMap


@Dao
interface UserMapDao {

    @Query("SELECT * FROM user_map WHERE id = :id")
    suspend fun getUserMap(id: Long): UserMap?

    @Query("SELECT * FROM user_map")
    suspend fun getUserMaps(): List<UserMap>

    @Insert
    suspend fun insert(map: UserMap)

    @Query("DELETE FROM user_map WHERE id = :id")
    fun deleteUserMap(id: Long)
}