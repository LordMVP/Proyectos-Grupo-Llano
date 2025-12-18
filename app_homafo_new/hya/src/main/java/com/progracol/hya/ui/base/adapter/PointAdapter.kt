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
import com.progracol.core.database.entities.Point
import com.progracol.hya.R
import com.progracol.hya.ui.base.ItemDataDialog

class PointAdapter(val context: Context,
                   val delete: (point: Point) -> Unit,
                   val edit: (point: Point) -> Unit
): ListAdapter<Point, PointAdapter.ViewHolder>(object: DiffUtil.ItemCallback<Point>(){
    override fun areItemsTheSame(oldItem: Point, newItem: Point): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: Point, newItem: Point): Boolean {
        return oldItem.id == newItem.id
    }
}) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.simple_list_item_data, parent, false)
        return ViewHolder(view)
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val menuButton: ImageButton = itemView.findViewById(R.id.menu_button_item)
        val titleTextView: TextView = itemView.findViewById(R.id.text_item)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val point = getItem(position)
        holder.menuButton.setOnClickListener{
            showDialog(point,holder.itemView)
        }
        holder.titleTextView.text = point.id.toString() + "-P-" + point.document + "-" + point.name
    }

    private fun showDialog(point: Point, anchorView: View) {
        val itemDialog = ItemDataDialog((context), { delete(point)}, { edit(point) })
        itemDialog.showPopup(anchorView)
    }


}