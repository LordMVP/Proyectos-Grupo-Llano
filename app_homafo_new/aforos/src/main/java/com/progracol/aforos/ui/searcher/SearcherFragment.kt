package com.progracol.aforos.ui.searcher

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AutoCompleteTextView
import android.widget.Spinner
import androidx.fragment.app.viewModels
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.aforos.common.VisitType
import com.progracol.aforos.databinding.FragmentSearcherBinding
import com.progracol.core.database.BaseEntity
import com.progracol.core.database.entities.Visit
import com.progracol.core.network.Resource
import com.progracol.core.ui.BasicAdapter
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class SearcherFragment (
    val onResults: (visits: List<Visit>) -> Unit
        ) : BottomSheetDialogFragment() {

    private val viewModel: SearcherViewModel by viewModels()
    private lateinit var binding: FragmentSearcherBinding
    private lateinit var bottomSheetBehavior: BottomSheetBehavior<View>

    private lateinit var billingSegmentAdapter: BasicAdapter
    private lateinit var capacityTypeAdapter: BasicAdapter
    private lateinit var commercialActivityAdapter : BasicAdapter
    private lateinit var visitTypeAdapter : BasicAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding =  FragmentSearcherBinding.inflate(inflater, container, false)

        billingSegmentAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        capacityTypeAdapter = BasicAdapter(requireContext(), data = listOf())
        commercialActivityAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        visitTypeAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())


        setSpinner((binding.commercialActivity.editText as AutoCompleteTextView), commercialActivityAdapter)
        setSpinner((binding.visitType.editText as AutoCompleteTextView), visitTypeAdapter)
        setSpinner((binding.billingSegment.editText as AutoCompleteTextView), billingSegmentAdapter)
        /*(binding.billingSegment.editText as AutoCompleteTextView).apply {
            setAdapter(billingSegmentAdapter)
            setOnItemClickListener { adapterView, _, i, _ ->
                val billingSegment = adapterView[i] as ParamBillingSegment
                setText(billingSegment.name)
            }
        }*/

        addObservers()

        binding.searchButton.setOnClickListener { search() }

        return binding.root
    }

    private fun addObservers() {
        viewModel.getBillingSegement().observe(viewLifecycleOwner) {
            setDataSpinner(billingSegmentAdapter, it,  "", (binding.billingSegment.editText as AutoCompleteTextView))
        }
        viewModel.getCommercialActivities().observe(viewLifecycleOwner) {
            setDataSpinner(commercialActivityAdapter, it,  "", (binding.commercialActivity.editText as AutoCompleteTextView))
        }
        setDataSpinner(visitTypeAdapter, viewModel.getVisitType() ,  "", (binding.visitType.editText as AutoCompleteTextView))


    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        bottomSheetBehavior = BottomSheetBehavior.from(view.parent as View)
        bottomSheetBehavior.state = BottomSheetBehavior.STATE_EXPANDED
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

    private fun search() {
        val name = binding.businessName.text.toString()
        val caseNumber = binding.caseNumber.text.toString()
        val userCode = binding.userCode.text.toString()
        val visitType = binding.visitType.editText?.text.toString()
        //val meter = binding.meter.text.toString()
        //val alternaSubscriptionCode = binding.subscriptionCode.text.toString()

        viewModel.search(name, caseNumber, userCode, visitType).observe(viewLifecycleOwner) {
            when(it.status) {
                Resource.Status.LOADING -> {
                    binding.message.visibility = View.VISIBLE
                    binding.message.text = resources.getString(com.progracol.core.R.string.loading)
                }
                Resource.Status.SUCCESS -> {
                    onResults(it.data ?: listOf())
                    dismiss()

                }
                Resource.Status.ERROR -> {
                    //messageDialog.showErrorMessage("Debe añadir al menos una foto y un concepto de visita.")
                }
            }
        }




    }
}
