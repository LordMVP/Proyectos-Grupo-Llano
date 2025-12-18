package com.progracol.aforos.common

//ESTADOS PARA LA VISITA DE LA BASE DE DATOS INTERNA
enum class VisitType(val status: String, val text: String, val textSpanish: String) {
    VISIT_COMPLETE("COMPLETE", "Visitas Realizadas", "Terminada"),
    VISIT_PENDING("PENDING", "Visitas Por Realizar", "Pendiente"),
    VISIT_CANCELED("CANCELED", "Aforos Cancelados", "Cancelada"),
    VISIT_UPLOADED("UPLOADED", "Aforos Sincronizados", "Cargado"),
    ASSING_VISIT("", "Asignación de aforos", "Asignada")
}

//ESTADOS PARA LA VISITA DE LA BASE DE DATOS EXTERNA(P, T, C)
enum class VisitStatus(val status: String, val text: String) {
    PENDIENTE("P","PENDIENTE"),
    TRAMITADO("T","TRAMITADO"),
    CANCELADO("C","CANCELADO"),
}