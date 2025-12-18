package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamConditionHouse

@Dao
abstract class ParamConditionHouseDao : BaseDao<ParamConditionHouse>("param_condition_house")