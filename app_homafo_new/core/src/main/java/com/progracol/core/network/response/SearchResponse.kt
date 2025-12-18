package com.progracol.core.network.response

data class SearchResponse(
    val content: List<SearchSubscriptionResponse>,
    val totalPages: Int
)
