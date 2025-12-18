package com.progracol.hya.ui.base.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.progracol.core.database.entities.MarkerPointMap
import com.progracol.hya.R
import com.progracol.hya.ui.base.ItemMarkerPointDialog

class MarkerPointAdapter(val context: Context,
                         val deleteMarker: (marker: MarkerPointMap) -> Unit,
                         val hideMarker: (marker: MarkerPointMap) -> Unit
): ListAdapter<MarkerPointMap, MarkerPointAdapter.ViewHolder>(object: DiffUtil.ItemCallback<MarkerPointMap>(){
    override fun areItemsTheSame(oldItem: MarkerPointMap, newItem: MarkerPointMap): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: MarkerPointMap, newItem: MarkerPointMap): Boolean {
        return oldItem.id == newItem.id
    }
}) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.simple_list_item_marker, parent, false)
        return ViewHolder(view)
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val menuButton: ImageButton = itemView.findViewById(R.id.menu_button_marker)
        val titleTextView: TextView = itemView.findViewById(R.id.text_item_marker)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val marker = getItem(position)
        holder.menuButton.setOnClickListener{
            showDialog(marker,holder.itemView)
        }
        holder.titleTextView.text = marker.name
    }

    private fun showDialog(marker: MarkerPointMap, anchorView: View) {
        val itemDialog = ItemMarkerPointDialog((context), { deleteMarker(marker)}, { hideMarker(marker) })
        itemDialog.showPopup(anchorView)
    }


}