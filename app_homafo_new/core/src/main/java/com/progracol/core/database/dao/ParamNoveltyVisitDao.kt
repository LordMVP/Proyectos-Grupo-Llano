package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamNoveltyVisit

@Dao
abstract class ParamNoveltyVisitDao: BaseDao<ParamNoveltyVisit>("param_novelty_visit")