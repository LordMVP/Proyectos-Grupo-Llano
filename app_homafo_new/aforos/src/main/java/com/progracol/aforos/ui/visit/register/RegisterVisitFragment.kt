package com.progracol.aforos.ui.visit.register

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.*
import android.widget.TableLayout
import android.widget.TableRow
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.progracol.aforos.R
import com.progracol.aforos.common.VisitType
import com.progracol.aforos.databinding.FragmentRegisterVisitBinding
import com.progracol.aforos.ui.visit.detail.VisitDetailFragment
import com.progracol.core.common.MediaStorageType
import com.progracol.core.database.entities.MediaStorage
import com.progracol.core.database.entities.Visit
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.ui.gallery.GalleryFragment
import com.progracol.core.ui.gallery.GalleryViewModel

class RegisterVisitFragment : BaseFragment(
    "Aforos"
) {

    private val viewModel: RegisterVisitViewModel by activityViewModels()
    private val galleryViewModel: GalleryViewModel by activityViewModels()
    private lateinit var binding: FragmentRegisterVisitBinding

    private val params: RegisterVisitFragmentArgs by navArgs()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentRegisterVisitBinding.inflate(inflater, container, false)

        binding.addConceptButton.setOnClickListener { addVisitConcept() }
        binding.addPhoto.setOnClickListener { showGallery() }
        binding.saveButton.setOnClickListener {
            //save()
            checkAllData()
        }

        loadVisit()
        addObserver()
        setBackButton(requireActivity() as MenuHost)

        return binding.root
    }

    private fun loadVisit() {
        viewModel.getVisit(params.id)
    }

    private fun showGallery() {
        val galleryFragment = GalleryFragment()
        //galleryFragment.setUpGallery(visitId = viewModel.visitId, mediaStorageType = MediaStorageType.AFORO_COMPLETE_VISIT, addNote = true)
        galleryViewModel.visitId = viewModel.visitId
        galleryViewModel.mediaStorageType = MediaStorageType.AFORO_COMPLETE_VISIT
        galleryViewModel.addNote = true
        galleryFragment.show(parentFragmentManager, RegisterVisitFragment::class.simpleName)
    }

    private fun showSignature() {
        val signature = SignatureFragment()
        signature.show(parentFragmentManager, SignatureFragment::class.simpleName)

        val updatedVisit = viewModel.visit.value ?: Visit(null)
        updatedVisit.caseNumber= binding.caseNumber.text.toString()
        updatedVisit.note = binding.note.text.toString()
        updatedVisit.status = VisitType.VISIT_COMPLETE.status
    }

    private fun checkAllData () {
        viewModel.checkVisit().observe(viewLifecycleOwner) {
            when(it.status) {
                Resource.Status.LOADING -> {
                    binding.message.visibility = View.VISIBLE
                    binding.message.text = resources.getString(com.progracol.core.R.string.loading)
                }
                Resource.Status.SUCCESS -> {
                    showDialog("¿Desea continuar con el registro?",
                        { _, _ ->
                            showSignature()
                        },
                        { dialog, _ ->
                            dialog.dismiss()
                        })
                }
                Resource.Status.ERROR -> messageDialog.showErrorMessage("Debe añadir al menos una foto y un concepto de visita.")
            }
        }
    }

    /*
    private fun save() {

        val updatedVisit = viewModel.visit.value ?: Visit(null)
        updatedVisit.caseNumber= binding.caseNumber.text.toString()
        updatedVisit.note = binding.note.text.toString()
        updatedVisit.status = VisitType.VISIT_COMPLETE.status

        viewModel.saveVisit(updatedVisit).observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {}
                Resource.Status.SUCCESS -> {
                    messageDialog.showMessage(resources.getString(R.string.success_saving_visit))
                    findNavController().popBackStack()
                }
                Resource.Status.ERROR -> messageDialog.showErrorMessage(resources.getString(R.string.error_saving_visit))
            }
        }
    }

    */

    @SuppressLint("UseCompatLoadingForDrawables", "SetTextI18n")
    private fun addObserver() {
        viewModel.visit.observe(viewLifecycleOwner) {
            binding.title.text = "Registro Aforo ${it.visitClass}"
            binding.visitId.setText(it.consecutiveVisit.toString())
            binding.watchword.setText(it.establishment)
            binding.neighborhood.setText(it.neighborhood)
            binding.address.setText(it.address)
            binding.userCode.setText(it.userCode)
            binding.visitType.setText(it.visitClass)
            binding.visitWeek.setText(it.week)
            binding.caseNumber.setText(it.caseNumber)

            viewModel.visitType = it.visitClass
        }

        viewModel.visitConcepts.observe(viewLifecycleOwner) { concepts ->
            binding.conceptTable.removeAllViews()
            setTable()
            concepts.forEachIndexed { index, concept ->
                val row = TableRow(requireContext())
                row.background = if (index == (concepts.size-1))
                    resources.getDrawable(com.progracol.core.R.drawable.background_footer_table, null)
                else
                    resources.getDrawable(com.progracol.core.R.drawable.background_table, null)
                val padding = resources.getDimension(com.progracol.core.R.dimen.padding_edittext).toInt()
                row.setPadding(padding, padding, padding, padding)

                val conceptLabel = concept.concept?.let {
                    if (it.length >= 4) {
                        it.substring(0, 4)
                    } else {
                        it
                    }
                } ?: ""

                row.addView(getRowLabel(conceptLabel))
                row.addView(getRowLabel(concept.quantity.toString()))
                row.addView(getRowLabel(concept.volume.toString()))
                row.addView(getRowLabel(concept.weight.toString()))
                row.addView(getDeleteButton { deleteVisitConcept(concept.id ?: 0) })

                binding.conceptTable.addView(row, TableLayout.LayoutParams(TableRow.LayoutParams.WRAP_CONTENT, TableRow.LayoutParams.WRAP_CONTENT))
            }
            binding.totalVolume.text = concepts.sumOf { it.volume ?: 0.0 }.toString()
            binding.totalWeight.text = concepts.sumOf { it.weight ?: 0.0 }.toString()
        }
    }
    private fun addVisitConcept() {
        val visitConcept = VisitConceptFormFragment()
        visitConcept.show(parentFragmentManager, RegisterVisitFragment::class.simpleName)
    }

    private fun deleteVisitConcept(id: Long) {
        viewModel.deleteVisitConcept(id)
    }

    @SuppressLint("UseCompatLoadingForDrawables")
    private fun setTable() {
        val row = TableRow(requireContext())
        val layoutParams = TableRow.LayoutParams(0, TableRow.LayoutParams.WRAP_CONTENT)
        layoutParams.column = 5
        layoutParams.weight = 1F
        row.layoutParams = layoutParams
        val padding = resources.getDimension(com.progracol.core.R.dimen.padding_edittext).toInt()
        row.setPadding(padding, padding, padding, padding)
        row.background = resources.getDrawable(com.progracol.core.R.drawable.background_header_table, null)

        row.addView(getHeaderLabel(resources.getString(R.string.concept)))
        row.addView(getHeaderLabel(resources.getString(R.string.quantity)))
        row.addView(getHeaderLabel(resources.getString(R.string.volume)))
        row.addView(getHeaderLabel(resources.getString(R.string.weight)))
        row.addView(getHeaderLabel(resources.getString(R.string.option)))

        binding.conceptTable.isStretchAllColumns = true
        binding.conceptTable.addView(row)
    }

    override fun setBackButton(menuHost: MenuHost) {
        menuHost.addMenuProvider(object : MenuProvider {
            override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
            }
            override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
                if(menuItem.itemId == android.R.id.home) {
                    findNavController().popBackStack()
                }
                return true
            }
        }, viewLifecycleOwner, Lifecycle.State.RESUMED)
    }
}