package com.progracol.hya.ui.base.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.progracol.core.network.response.ActSyncSubscriptionResponse
import com.progracol.core.network.response.SearchSubscriptionResponse
import com.progracol.hya.R
import kotlinx.android.synthetic.main.subscription_map_item.view.card_view

class ActSyncMapAdapter(
    val context: Context,
    val onVerImagenes: (actSyncItem: ActSyncSubscriptionResponse) -> Unit
): ListAdapter<ActSyncSubscriptionResponse, ActSyncMapAdapter.ViewHolder>(object: DiffUtil.ItemCallback<ActSyncSubscriptionResponse>(){

    override fun areItemsTheSame(oldItem: ActSyncSubscriptionResponse, newItem: ActSyncSubscriptionResponse): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: ActSyncSubscriptionResponse, newItem: ActSyncSubscriptionResponse): Boolean {
        return oldItem.idSuscripcion == newItem.idSuscripcion
    }
}) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.act_sycn_item, parent, false)
        return ViewHolder(view)
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val idOperarioTextView: TextView = itemView.findViewById(R.id.tvIdOperario)
        val idRegistroTextView: TextView = itemView.findViewById(R.id.tvIdRegistro)
        val fechaEncuestaTextView: TextView = itemView.findViewById(R.id.tvFechaEncuesta)
        val idSuscripcionTextView: TextView = itemView.findViewById(R.id.tvIdSuscripcion)
        val codigoAseoTextView: TextView = itemView.findViewById(R.id.tvCodigoAseo)
        val estadoTextView: TextView = itemView.findViewById(R.id.tvEstado)
        val procesoTextView: TextView = itemView.findViewById(R.id.tvProceso)
        val buttonVerImagenes: Button = itemView.findViewById(R.id.btnVerImagenes)
    }

    override fun onBindViewHolder(holder: ActSyncMapAdapter.ViewHolder, position: Int) {
        val actSyncItem = getItem(position)
        holder.idOperarioTextView.text = "idOperario:  " + actSyncItem.idOperario
        holder.idRegistroTextView.text = "idRegistro:  " + actSyncItem.idRegistro
        holder.fechaEncuestaTextView.text = "Fecha Actualización:  " + actSyncItem.fechaEncuesta
        holder.idSuscripcionTextView.text = "idSuscripción:  " + actSyncItem.idSuscripcion
        holder.codigoAseoTextView.text = "CódigoAseo:  " + actSyncItem.codigoAseo
        holder.estadoTextView.text = "Estado:  " + if(actSyncItem.estado.equals("R") == true) "SINCRONIZADO" else "N/A"
        holder.procesoTextView.text = "Proceso:  " + actSyncItem.proceso
        holder.buttonVerImagenes.setOnClickListener{
            onVerImagenes(actSyncItem)
        }
    }

}