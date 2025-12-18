package com.progracol.aforos.ui.visit.detail

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TableLayout
import android.widget.TableRow
import android.widget.Toast
import androidx.fragment.app.viewModels
import com.github.gcacace.signaturepad.views.SignaturePad
import com.progracol.aforos.R
import com.progracol.aforos.databinding.FragmentVisitDetailBinding
import com.progracol.core.database.entities.Visit
import com.progracol.core.ui.BaseBottomSheetDialogFragment
import com.progracol.core.ui.PhotoAdapter
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class VisitDetailFragment constructor(
    val visit: Visit
) : BaseBottomSheetDialogFragment() {

    private lateinit var binding: FragmentVisitDetailBinding
    private val viewModel: VisitDetailViewModel by viewModels()

    private lateinit var photosAdapter: PhotoAdapter

    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentVisitDetailBinding.inflate(inflater, container, false)

        viewModel.visit = visit
        visit.let {
            binding.establishment.text = it.establishment
            binding.visitNumber.text = it.consecutiveVisit.toString()
            binding.neighborhood.text = it.neighborhood
            binding.address.text = it.address
            binding.userCode.text = it.userCode
            binding.visitWeek.text = it.week
            binding.visitType.text = it.visitType
            binding.caseNumber.text = it.caseNumber
            binding.note.text = it.note
        }

        photosAdapter = PhotoAdapter(requireContext(), enableDelete = false) {}
        binding.gallery.adapter = photosAdapter

        binding.closeButton.setOnClickListener { dismiss() }



        setTable()
        getVisitConcepts()
        loadVisitConcepts()
        loadPhotos()

        return binding.root
    }

    private fun getVisitConcepts() {
        viewModel.getAllVisitConcepts()
    }

    private fun loadVisitConcepts() {
        viewModel.visitConcepts.observe(viewLifecycleOwner) {
            it.forEachIndexed { index, concept ->
                val row = TableRow(requireContext())
                row.background = if (index == (it.size-1))
                    resources.getDrawable(com.progracol.core.R.drawable.background_footer_table, null)
                else
                    resources.getDrawable(com.progracol.core.R.drawable.background_table, null)
                val padding = resources.getDimension(com.progracol.core.R.dimen.padding_edittext).toInt()
                row.setPadding(padding, padding, padding, padding)

                row.addView(getRowLabel(concept.concept?.substring(0, 10) ?: ""))
                row.addView(getRowLabel(concept.quantity.toString()))
                row.addView(getRowLabel(concept.volume.toString()))
                row.addView(getRowLabel(concept.weight.toString()))

                binding.conceptTable.addView(row, TableLayout.LayoutParams(TableRow.LayoutParams.WRAP_CONTENT, TableRow.LayoutParams.WRAP_CONTENT))
            }
        }
    }

    private fun loadPhotos() {
        viewModel.photos.observe(viewLifecycleOwner) {
            Log.e("detail", it.toString())
            photosAdapter.submitList(it)
        }
    }

    @SuppressLint("UseCompatLoadingForDrawables")
    private fun setTable() {
        val row = TableRow(requireContext())
        val layoutParams = TableRow.LayoutParams(0, TableRow.LayoutParams.WRAP_CONTENT)
        layoutParams.column = 4
        layoutParams.weight = 1F
        row.layoutParams = layoutParams
        val padding = resources.getDimension(com.progracol.core.R.dimen.padding_edittext).toInt()
        row.setPadding(padding, padding, padding, padding)
        row.background = resources.getDrawable(com.progracol.core.R.drawable.background_header_table, null)

        row.addView(getHeaderLabel(resources.getString(R.string.concept)))
        row.addView(getHeaderLabel(resources.getString(R.string.quantity)))
        row.addView(getHeaderLabel(resources.getString(R.string.volume)))
        row.addView(getHeaderLabel(resources.getString(R.string.weight)))

        binding.conceptTable.isStretchAllColumns = true
        binding.conceptTable.addView(row)
    }

}