package com.progracol.core.repository

import com.progracol.core.database.dao.UserMapDao
import com.progracol.core.database.entities.UserMap
import javax.inject.Inject


class UserMapRepository @Inject constructor(
    private val userMapDao: UserMapDao,
) {

    suspend fun getUserMapById(id: Long) = userMapDao.getUserMap(id)

    suspend fun getUserMaps() = userMapDao.getUserMaps()

    suspend fun saveUserMap(userMap: UserMap) = userMapDao.insert(userMap)

    suspend fun deleteUserMap(id: Long) = userMapDao.deleteUserMap(id)

}