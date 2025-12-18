package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamMarcacion

@Dao
abstract class ParamMarcacionDao: BaseDao<ParamMarcacion>("param_marcacion")