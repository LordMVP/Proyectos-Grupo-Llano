package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamContainerType

@Dao
abstract class ParamContainerTypeDao: BaseDao<ParamContainerType>("param_container_type")