package com.progracol.core.domain

import com.progracol.core.domain.model.LayersItem
import com.progracol.core.domain.model.MapsItem
import com.progracol.core.repository.ArcGISRepository
import javax.inject.Inject

class ArcGISUseCase @Inject constructor(
    private val repository: ArcGISRepository
) {
    suspend operator fun invoke() : List<MapsItem>{
        return repository.getAllMaps()
    }
}