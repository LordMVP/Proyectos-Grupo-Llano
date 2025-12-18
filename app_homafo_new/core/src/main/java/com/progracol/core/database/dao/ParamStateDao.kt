package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamState

@Dao
abstract class ParamStateDao : BaseDao<ParamState>("param_state")