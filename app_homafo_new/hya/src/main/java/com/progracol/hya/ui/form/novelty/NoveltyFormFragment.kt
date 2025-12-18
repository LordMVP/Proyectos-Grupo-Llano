package com.progracol.hya.ui.form.novelty

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AutoCompleteTextView
import android.widget.CheckBox
import android.widget.LinearLayout
import androidx.fragment.app.activityViewModels
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.core.common.MediaStorageType
import com.progracol.core.common.UploadStatus
import com.progracol.core.database.BaseEntity
import com.progracol.core.database.entities.*
import com.progracol.core.network.Resource
import com.progracol.core.ui.BasicAdapter
import com.progracol.core.ui.MessageDialog
import com.progracol.core.ui.gallery.GalleryFragment
import com.progracol.hya.R
import com.progracol.hya.databinding.FragmentNoveltyFormBinding
import com.progracol.hya.ui.form.FormActivity
import com.progracol.hya.ui.form.FormViewModel
import com.progracol.hya.ui.form.detail.DetailFragment
import java.text.SimpleDateFormat
import java.util.*

class NoveltyFormFragment : BottomSheetDialogFragment() {

    private val viewModel: FormViewModel by activityViewModels()
    private lateinit var binding: FragmentNoveltyFormBinding

    private lateinit var noveltyVisitAdapter : BasicAdapter
    private lateinit var noveltyInvoiceAdapter : BasicAdapter
    private lateinit var noveltyTypeRequestAdapter : BasicAdapter
    private val checkBoxes: MutableList<CheckBox> = mutableListOf()

    private lateinit var messageDialog: MessageDialog

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentNoveltyFormBinding.inflate(inflater, container, false)

        noveltyVisitAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        noveltyInvoiceAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        noveltyTypeRequestAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())

        setSpinner((binding.noveltyVisit.editText as AutoCompleteTextView), noveltyVisitAdapter)
        setSpinner((binding.noveltyInvoice.editText as AutoCompleteTextView), noveltyInvoiceAdapter)
        setSpinner((binding.noveltyRequestType.editText as AutoCompleteTextView), noveltyTypeRequestAdapter)

        messageDialog = MessageDialog(requireContext())

        loadForm()

        binding.addPhotoButton.setOnClickListener { addPhoto() }

        binding.saveButton.setOnClickListener { save() }

        return binding.root
    }

    @SuppressLint("SimpleDateFormat")
    private fun loadForm() {
        viewModel.getNoveltyVisits().observe(viewLifecycleOwner) {
            val novVisList: MutableList<ParamNoveltyVisit> = mutableListOf()
            novVisList.addAll(it.sortedBy { ac -> ac.name })
            val nullVisit = ParamNoveltyVisit(
                name = "SELECCIONE UNA OPCIÓN",
                code = ""
            )
            novVisList.add(0,nullVisit)
            noveltyVisitAdapter.data = novVisList
            //setDataSpinner(noveltyVisitAdapter, it, viewModel.novelty.value?.noveltyVisit ?: "", (binding.noveltyVisit.editText as AutoCompleteTextView))
        }
        viewModel.getNoveltyResultTypes().observe(viewLifecycleOwner) {
            addResultTypes(it)
        }
        viewModel.getNoveltyTypeRequests().observe(viewLifecycleOwner) {
            val novTypeList: MutableList<ParamNoveltyTypeRequest> = mutableListOf()
            novTypeList.addAll(it.sortedBy { ac -> ac.name })
            val nullTypeVisit = ParamNoveltyTypeRequest(
                name = "SELECCIONE UNA OPCIÓN",
                code = ""
            )
            novTypeList.add(0,nullTypeVisit)
            noveltyTypeRequestAdapter.data = novTypeList
            //setDataSpinner(noveltyTypeRequestAdapter, it, viewModel.novelty.value?.noveltyTypeRequest ?: "", (binding.noveltyRequestType.editText as AutoCompleteTextView))
        }
        viewModel.getNoveltyInvoices().observe(viewLifecycleOwner) {
            val novInvoiceList: MutableList<ParamNoveltyInvoice> = mutableListOf()
            novInvoiceList.addAll(it.sortedBy { ac -> ac.name })
            val nullInvoiceVisit = ParamNoveltyInvoice(
                name = "SELECCIONE UNA OPCIÓN",
                code = ""
            )
            novInvoiceList.add(0, nullInvoiceVisit)
            noveltyInvoiceAdapter.data = novInvoiceList
            //setDataSpinner(noveltyInvoiceAdapter, it, viewModel.novelty.value?.noveltyInvoice ?: "", (binding.noveltyInvoice.editText as AutoCompleteTextView))
        }
        val sdf = SimpleDateFormat("dd-MM-yyyy")
        binding.date.setText(sdf.format(Date()))
        binding.subscriptionId.setText(viewModel.defaultSubscriptionCode)
    }

    private fun addPhoto() {
        (requireActivity() as? FormActivity)?.showGallery(viewModel.defaultSubscriptionCode, noveltyId = viewModel.noveltyId, mediaStorageType = MediaStorageType.HYA_NOVELTY, tag = NoveltyFormFragment::class.simpleName!!)
    }

    private fun save() {
        if (viewModel.isEmptyGallery(mediaStorageType = MediaStorageType.HYA_NOVELTY)) {
            messageDialog.showWarningMessage(resources.getString(R.string.error_add_photo))
            return
        }

        val pqr = binding.pqr.text.toString()
        val date = binding.date.text.toString()
        val noveltyVisit = noveltyVisitAdapter.selectedItem?.code
        val noveltyTypeRequest = noveltyTypeRequestAdapter.selectedItem?.code
        val noveltyInvoice = noveltyInvoiceAdapter.selectedItem?.code

        /*if (noveltyVisit.isNullOrBlank()) {
            messageDialog.showMessage(resources.getString(R.string.error_novelty_missing_information))
            return
        }*/
        if (noveltyTypeRequest == "1") {
            if(pqr.isEmpty() || noveltyVisit.isNullOrBlank()) {
                messageDialog.showMessage(resources.getString(R.string.error_novelty_missing_pqr_or_visit))
                return
            }
        }
        val resultTypesSelected = checkBoxes.filter { it.isChecked }.map { it.id }
        val novelty = Novelty(
            id = null,
            date = date,
            subscriptionId = viewModel.defaultSubscriptionCode,
            pqr = pqr,
            noveltyVisit = noveltyVisit,
            noveltyTypeRequest = noveltyTypeRequest,
            noveltyInvoice = noveltyInvoice,
            noveltyResultType = resultTypesSelected.joinToString(),
            note = binding.note.text.toString(),
            status = UploadStatus.PENDING.status
        )
        viewModel.saveNovelty(novelty).observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {
                }
                Resource.Status.SUCCESS -> {
                    messageDialog.showMessage(resources.getString(R.string.success_saving_novelty))
                    this.dismiss()
                }
                Resource.Status.ERROR ->{
                    if(viewModel.mediaStorageType != MediaStorageType.HYA_NOVELTY.ordinal) messageDialog.showWarningMessage(resources.getString(R.string.error_add_photo))
                    else messageDialog.showErrorMessage(resources.getString(R.string.error_saving_novelty))
                }
            }
        }
    }

    private fun addResultTypes(resultTypes: List<ParamNoveltyResultType>) {
        resultTypes.forEach {
            val newCheckBox = CheckBox(requireContext())
            newCheckBox.layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            newCheckBox.text = it.name
            newCheckBox.id = it.code.toInt()
            checkBoxes.add(newCheckBox)
            binding.resultTypeContainer.addView(newCheckBox)
        }
    }

    private fun setSpinner(autoCompleteTextView: AutoCompleteTextView, adapter: BasicAdapter) {
        autoCompleteTextView.setAdapter(adapter)
        autoCompleteTextView.setOnItemClickListener { adapterView, _, position, _ ->
            val selectedItem = adapterView.getItemAtPosition(position) as BaseEntity
            autoCompleteTextView.setText(selectedItem.name)
            adapter.selectedItem = selectedItem
        }
    }

    private fun setDataSpinner(adapter: BasicAdapter, list: List<BaseEntity>, code: String, input: AutoCompleteTextView) {
        adapter.data = list
        list.findLast { it.code == code }?.let {
            adapter.selectedItem = it
            input.setText(it.name)
        }
    }

}