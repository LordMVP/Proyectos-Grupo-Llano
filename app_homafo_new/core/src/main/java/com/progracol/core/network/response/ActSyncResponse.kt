package com.progracol.core.network.response

data class ActSyncResponse(
    val content: List<ActSyncSubscriptionResponse>,
    val totalPages: Int
)