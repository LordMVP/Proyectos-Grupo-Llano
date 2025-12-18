package com.progracol.core.ui

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.CenterCrop
import com.bumptech.glide.load.resource.bitmap.RoundedCorners
import com.bumptech.glide.request.RequestOptions
import com.progracol.core.R
import com.progracol.core.database.entities.MediaStorage


class PhotoAdapter(
    val context: Context,
    val addNote: Boolean = false,
    val enableDelete: Boolean = true,
    val onItemSelected: (mediaStorageEntity: MediaStorage) -> Unit
): ListAdapter<MediaStorage, PhotoAdapter.ViewHolder>(object: DiffUtil.ItemCallback<MediaStorage>(){
    override fun areItemsTheSame(oldItem: MediaStorage, newItem: MediaStorage): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: MediaStorage, newItem: MediaStorage): Boolean {
        return oldItem.id == newItem.id
    }

}) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = if (addNote) LayoutInflater.from(context).inflate(R.layout.item_photos_list, parent, false) else LayoutInflater.from(context).inflate(R.layout.item_photo, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = getItem(position)

        Glide
            .with(context)
            .load(item.url)
            .centerCrop()
            .apply(RequestOptions.bitmapTransform(RoundedCorners(14)))
            .placeholder(R.drawable.placeholder)
            .into(holder.image);

        holder.deleteButton.visibility = if (enableDelete) View.VISIBLE else View.GONE
        holder.note.text = item?.note
        holder.deleteButton.setOnClickListener {
            onItemSelected(item)
        }
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val image : ImageView = itemView.findViewById(R.id.image)
        val note : TextView = itemView.findViewById(R.id.note)
        val deleteButton : ImageView = itemView.findViewById(R.id.delete_button)
    }
}