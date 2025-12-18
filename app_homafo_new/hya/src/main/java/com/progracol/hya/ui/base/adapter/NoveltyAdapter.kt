package com.progracol.hya.ui.base.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.progracol.core.common.UploadStatus
import com.progracol.core.database.entities.Novelty
import com.progracol.hya.R

class NoveltyAdapter(val context: Context,
                     val onItemSelected: (novelty: Novelty) -> Unit
): ListAdapter<Novelty, NoveltyAdapter.ViewHolder>(object: DiffUtil.ItemCallback<Novelty>(){
    override fun areItemsTheSame(oldItem: Novelty, newItem: Novelty): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: Novelty, newItem: Novelty): Boolean {
        return oldItem.id == newItem.id
    }
}) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.novelty_item, parent, false)
        return ViewHolder(view)
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val pqrTextView: TextView = itemView.findViewById(R.id.pqr)
        val dateTextView: TextView = itemView.findViewById(R.id.date)
        val statusTextView: TextView = itemView.findViewById(R.id.status)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val novelty = getItem(position)
        holder.itemView.setOnClickListener{
            onItemSelected(novelty)
        }
        holder.pqrTextView.text = "PQR: ${novelty.pqr}"
        holder.dateTextView.text = novelty.date
        holder.statusTextView.text = if (UploadStatus.UPLOADED.status == novelty.status) "Actualizado." else "Pendiente por actualizar."
    }

}