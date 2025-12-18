package com.progracol.hya.ui.map.search

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AutoCompleteTextView
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import com.esri.arcgisruntime.geometry.Point
import com.esri.arcgisruntime.geometry.SpatialReferences
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.core.database.BaseEntity
import com.progracol.core.database.entities.ParamNeighborhood
import com.progracol.core.network.Resource
import com.progracol.core.ui.BasicAdapter
import com.progracol.core.ui.MessageDialog
import com.progracol.hya.R
import com.progracol.hya.databinding.FragmentMapSearchBinding
import com.progracol.hya.ui.base.adapter.NeighborhoodAdapter
import com.progracol.hya.ui.base.adapter.SubscriptionMapAdapter
import com.progracol.hya.ui.form.FormActivity
import com.progracol.hya.ui.map.SharedViewModel
import com.progracol.hya.ui.map.search.datasync.MapDataSyncFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MapSearchFragment(
    private val closeDialog: () -> Unit
) : BottomSheetDialogFragment() {

    private lateinit var binding: FragmentMapSearchBinding
    private lateinit var bottomSheetBehavior: BottomSheetBehavior<View>
    private val viewModel: MapSearchViewModel by viewModels()
    private val sharedViewModel: SharedViewModel by activityViewModels()

    private lateinit var subscriptionAdapter : SubscriptionMapAdapter
    private lateinit var companyAdapter : BasicAdapter
    private lateinit var stateAdapter : BasicAdapter
    private lateinit var neighborhoodAdapter: NeighborhoodAdapter

    private lateinit var messageDialog: MessageDialog

    private var showScreenListDataSync: Boolean = false

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentMapSearchBinding.inflate(inflater, container, false)

        subscriptionAdapter = SubscriptionMapAdapter(
            requireContext(),
            onItemSelected = { item ->
                val intent = Intent(requireContext(), FormActivity::class.java)
                intent.putExtra("subscriptionCode", item.userCode)
                intent.putExtra("isOffline", false)
                intent.putExtra("tipoFacturacion", item.facturacion)
                intent.putExtra("posFragments", "0,1,2")
                startActivity(intent)
            },
            onLocateClick = { item ->
                var x = item.longitude?.toDoubleOrNull()//-73.6459545994
                var y = item.latitude?.toDoubleOrNull()//4.0982581209
                Log.e("CLICK BUSCAR PUNTO", "COORDENADAS: LON: " + x + "LAT: " + y)

                if(x != null || y != null) {
                    val wgs84Point = Point(x as Double, y as Double, SpatialReferences.getWebMercator())
                    sharedViewModel.selectedCoordinates.value = wgs84Point//Point(x as Double, y as Double, SpatialReferences.getWgs84())
                    onDestroyView()
                }else {
                    messageDialog.showWarningMessage("No se encontraron las coordenadas del punto en arcgis.")
                }
            },
            onVerSincronizacionesClick = { item ->
                if(!showScreenListDataSync) {
                    showScreenListDataSync = true
                    val fragmentDataSyncBinding = MapDataSyncFragment(item.idSubscription!!,closeDialog = {showScreenListDataSync = false})
                    fragmentDataSyncBinding.show(
                        parentFragmentManager,
                        MapSearchFragment::class.simpleName
                    )
                }
            }
        )

        companyAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        stateAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())

        binding.subscriptionRecyclerView.adapter = subscriptionAdapter
        setSpinner((binding.company.editText as AutoCompleteTextView), companyAdapter)
        setSpinner((binding.state.editText as AutoCompleteTextView), stateAdapter)

        neighborhoodAdapter = NeighborhoodAdapter(requireActivity(), android.R.layout.simple_dropdown_item_1line, mutableListOf())
        binding.neighborhood.setAdapter(neighborhoodAdapter)
        binding.neighborhood.setOnItemClickListener { _, _, position, _ ->
            val neighborhood = neighborhoodAdapter.getItem(position) as ParamNeighborhood?
            neighborhoodAdapter.neighborhoodSelected = neighborhoodAdapter.getItem(position)
            binding.neighborhood.setText(neighborhood?.name)
        }

        binding.searchButton.setOnClickListener { search() }
        binding.clearButton.setOnClickListener { clear() }
        binding.searchByCodeButton.setOnClickListener { search(true) }
        binding.nextButton.setOnClickListener {
            viewModel.next()
            search()
        }
        binding.backButton.setOnClickListener {
            viewModel.back()
            search()
        }

        loadForm()

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        messageDialog = MessageDialog(requireContext())

        bottomSheetBehavior = BottomSheetBehavior.from(view.parent as View)
        bottomSheetBehavior.state = BottomSheetBehavior.STATE_EXPANDED
        bottomSheetBehavior.isDraggable = true
        bottomSheetBehavior.isHideable = true
    }

    fun setSpinner(autoCompleteTextView: AutoCompleteTextView, adapter: BasicAdapter) {
        autoCompleteTextView.setAdapter(adapter)
        autoCompleteTextView.setOnItemClickListener { adapterView, _, position, _ ->
            val selectedItem = adapterView.getItemAtPosition(position) as BaseEntity
            autoCompleteTextView.setText(selectedItem.name)
            adapter.selectedItem = selectedItem
        }
    }

    fun setDataSpinner(adapter: BasicAdapter, list: List<BaseEntity>, code: String, input: AutoCompleteTextView) {
        adapter.data = list
        list.findLast { it.code == code }?.let {
            adapter.selectedItem = it
            input.setText(it.name)
        }
    }

    private fun loadForm() {
        viewModel.getCompanies().observe(viewLifecycleOwner) {
            setDataSpinner(companyAdapter, it, "", (binding.company.editText as AutoCompleteTextView))
        }
        viewModel.getNeighborhoods().observe(viewLifecycleOwner) {
            neighborhoodAdapter.updateData(it)
        }
        viewModel.getStates().observe(viewLifecycleOwner) {
            setDataSpinner(stateAdapter, it, "", (binding.state.editText as AutoCompleteTextView))
        }
    }

    @SuppressLint("SetTextI18n")
    private fun search(searchByCode: Boolean = false) {
        val companyId = if(searchByCode) null else companyAdapter.selectedItem?.code
        val meter =  if(searchByCode) null else binding.meter.text.toString()
        val codeCompany =  if(searchByCode) null else binding.codeCompany.text.toString()
        val subscriptionId = binding.subscriptionId.text.toString()
        val address =  if(searchByCode) null else binding.address.text.toString()
        val neighborhood =  if(searchByCode) null else neighborhoodAdapter.neighborhoodSelected?.code
        val pqr =  if(searchByCode) null else binding.pqr.text.toString()
        val state =  if(searchByCode) null else stateAdapter.selectedItem?.code

        viewModel.search(companyId, meter, codeCompany, subscriptionId, address, neighborhood, pqr, state).observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {
                    binding.formSearchMap.visibility = View.GONE
                    binding.resultScreen.visibility = View.GONE
                    binding.message.visibility = View.VISIBLE
                    binding.message.text = resources.getString(R.string.searching)
                    subscriptionAdapter.submitList(listOf())
                }
                Resource.Status.SUCCESS -> {
                    binding.formSearchMap.visibility = View.GONE
                    if (it.data?.isEmpty() == true) {
                        binding.message.text = resources.getString(R.string.not_subscription_results)
                    } else {
                        binding.message.visibility = View.GONE
                        binding.resultScreen.visibility = View.VISIBLE
                        binding.currentPage.text = "${(viewModel.currentPage+1)}/${viewModel.totalPages}"
                        subscriptionAdapter.submitList(it.data)
                        binding.backButton.visibility = if (viewModel.currentPage>0) View.VISIBLE else View.GONE
                        binding.nextButton.visibility = if (viewModel.currentPage<viewModel.totalPages) View.VISIBLE else View.GONE
                    }
                }
                Resource.Status.ERROR -> {
                    binding.message.text = resources.getString(R.string.error_subscription_result)
                }
            }
        }
    }

    private fun clear() {
        binding.meter.text?.clear()
        binding.codeCompany.text?.clear()
        binding.subscriptionId.text?.clear()
        binding.address.text?.clear()
        binding.pqr.text?.clear()

        neighborhoodAdapter.neighborhoodSelected = null
        binding.neighborhood.text.clear()

        companyAdapter.selectedItem = null
        (binding.company.editText as AutoCompleteTextView).text?.clear()

        stateAdapter.selectedItem = null
        (binding.state.editText as AutoCompleteTextView).text?.clear()

        viewModel.clear()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        closeDialog()
    }

}