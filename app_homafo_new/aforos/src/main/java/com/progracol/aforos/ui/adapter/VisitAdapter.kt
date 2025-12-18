package com.progracol.aforos.ui.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.view.children
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.RoundedCorners
import com.bumptech.glide.request.RequestOptions
import com.progracol.aforos.R
import com.progracol.aforos.common.VisitType
import com.progracol.aforos.ui.searcher.VisitTypeData
import com.progracol.core.database.entities.Visit

class VisitAdapter(
    val context: Context,
    private val registerVisit: (visit: Visit) -> Unit,
    private val showVisit: (visit: Visit) -> Unit,
    private val cancelVisit: (visit: Visit) -> Unit
): ListAdapter<Visit, VisitAdapter.ViewHolder>(object: DiffUtil.ItemCallback<Visit>(){
    override fun areItemsTheSame(oldItem: Visit, newItem: Visit): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: Visit, newItem: Visit): Boolean {
        return oldItem.id == newItem.id
    }
}) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_visit, parent, false)
        return ViewHolder(view)
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val nameEstablishment : TextView = itemView.findViewById(R.id.name_establishment)
        val visitClass : TextView = itemView.findViewById(R.id.visit_class)
        val font : TextView = itemView.findViewById(R.id.font)
        val subscription : TextView = itemView.findViewById(R.id.subscription)
        val totalVisits : TextView = itemView.findViewById(R.id.total_visits)
        val madeVisits: TextView = itemView.findViewById(R.id.visits_made)
        val assignmentDate : TextView = itemView.findViewById(R.id.assignment_date)
        val subscriberCode: TextView = itemView.findViewById(R.id.subscriber_code)
        val cancelNote: TextView = itemView.findViewById(R.id.cancel_note)
        val imageCancel: ImageView = itemView.findViewById(R.id.image_cancel_visit)
        val cancelView: LinearLayout = itemView.findViewById(R.id.cancel_view)
        val status: TextView = itemView.findViewById(R.id.status)


        val registerButton: Button = itemView.findViewById(R.id.register_button)
        val cancelButton: Button = itemView.findViewById(R.id.cancel_button)
        val showDetailButton: Button = itemView.findViewById(R.id.show_button)
        val addNoteButton: Button = itemView.findViewById(R.id.add_note_button)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val visit = getItem(position)
        holder.status.text = VisitType.values().find { it.status == visit.status }?.textSpanish
        holder.visitClass.text = visit.visitClass
        holder.font.text = visit.font
        holder.subscription.text = visit.subscription
        holder.totalVisits.text = visit.totalVisits
        holder.madeVisits.text = visit.madeVisits
        holder.assignmentDate.text = visit.assignmentDate
        holder.subscriberCode.text = visit.userCode
        holder.nameEstablishment.text = visit.establishment
        holder.cancelNote.text = visit.note

        holder.registerButton.setOnClickListener { registerVisit(visit) }
        holder.cancelButton.setOnClickListener { cancelVisit(visit) }
        holder.showDetailButton.setOnClickListener { showVisit(visit) }

        holder.cancelView.visibility = View.GONE
        holder.registerButton.visibility = View.GONE
        holder.cancelButton.visibility = View.GONE
        holder.showDetailButton.visibility = View.GONE
        holder.addNoteButton.visibility = View.GONE

        when(visit.status) {
            VisitType.VISIT_COMPLETE.status -> {
                holder.showDetailButton.visibility = View.VISIBLE
            }
            VisitType.VISIT_PENDING.status -> {
                holder.registerButton.visibility = View.VISIBLE
                holder.cancelButton.visibility = View.VISIBLE
            }
            VisitType.VISIT_CANCELED.status -> {
               holder.cancelView.visibility = View.VISIBLE
                visit.photo?.let {
                    Glide
                        .with(context)
                        .load(it.url)
                        .centerCrop()
                        .apply(RequestOptions.bitmapTransform(RoundedCorners(14)))
                        .placeholder(com.progracol.core.R.drawable.placeholder)
                        .into(holder.imageCancel);
                }

            }
            VisitType.ASSING_VISIT.status -> {

            }
            else -> {}
        }
    }
}