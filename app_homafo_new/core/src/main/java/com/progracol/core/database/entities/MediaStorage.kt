package com.progracol.core.database.entities

import androidx.core.net.toUri
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Ignore
import androidx.room.PrimaryKey

@Entity(tableName = "media_storage")
data class MediaStorage(

    @PrimaryKey(autoGenerate = true) val id: Long?,

    @ColumnInfo(name = "subscription_id")
    var subscriptionId: String?,

    @ColumnInfo(name = "novelty_id")
    var noveltyId: Long?,

    @ColumnInfo(name = "visit_id")
    var visitId: Long?,

    @ColumnInfo(name = "point_id")
    var pointId: Long?,

    @ColumnInfo(name = "media_storage_type")
    var mediaStorageType: Int?,

    @ColumnInfo(name = "url")
    var url: String?,

    @ColumnInfo(name = "note")
    var note: String?

)
{
    @Ignore
    fun toPhotoObject(): Map<String, Any?> {
        return mapOf(
            "name" to url?.toUri()?.lastPathSegment,
            "obser" to note
        )
    }

}