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
import com.progracol.core.database.entities.UserMap
import com.progracol.hya.R
import com.progracol.hya.ui.base.ItemMapDialog

class MapAdapter(val context: Context,
                 val onItemSelected: (map: UserMap) -> Unit,
                 val deleteMap: (map: UserMap) -> Unit,
                 val mapDetail: (map: UserMap) -> Unit
): ListAdapter<UserMap, MapAdapter.ViewHolder>(object: DiffUtil.ItemCallback<UserMap>(){
    override fun areItemsTheSame(oldItem: UserMap, newItem: UserMap): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: UserMap, newItem: UserMap): Boolean {
        return oldItem.id == newItem.id
    }
}) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.simple_list_item_map, parent, false)
        return ViewHolder(view)
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val menuButton: ImageButton = itemView.findViewById(R.id.menu_button)
        val titleTextView: TextView = itemView.findViewById(R.id.text_item_map)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val map = getItem(position)
        holder.itemView.setOnClickListener{
            onItemSelected(map)
        }
        holder.menuButton.setOnClickListener{
            showDialog(map,holder.itemView)
        }
        holder.titleTextView.text = map.name
    }

    private fun showDialog(map: UserMap, anchorView: View) {
        val itemDialog = ItemMapDialog((context), { deleteMap(map)}, { mapDetail(map) })
        itemDialog.showPopup(anchorView)
    }


}