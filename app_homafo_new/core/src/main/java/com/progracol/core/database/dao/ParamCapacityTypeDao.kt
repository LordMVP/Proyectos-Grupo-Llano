package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamCapacityType

@Dao
abstract class ParamCapacityTypeDao: BaseDao<ParamCapacityType>("param_capacity_type")