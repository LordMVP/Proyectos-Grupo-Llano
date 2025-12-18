package com.progracol.aforos.ui.visit

import android.os.Bundle
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.navigation.fragment.findNavController
import com.progracol.aforos.R
import com.progracol.aforos.common.VisitType
import com.progracol.aforos.databinding.FragmentVisitBinding
import com.progracol.aforos.ui.adapter.VisitAdapter
import com.progracol.aforos.ui.searcher.SearcherFragment
import com.progracol.aforos.ui.visit.detail.VisitDetailFragment
import com.progracol.aforos.ui.visit.sync.SyncAforoFragment
import com.progracol.core.database.entities.Visit
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment

class VisitFragment : BaseFragment(
    "Aforos"
) {

    private val viewModel: VisitViewModel by viewModels()
    private lateinit var binding: FragmentVisitBinding

    val mutableListCodBio = mutableListOf<String>()

    private lateinit var visitAdapter: VisitAdapter

    private lateinit var visitType: VisitType

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentVisitBinding.inflate(inflater, container, false)

        visitAdapter = VisitAdapter(requireContext(), {
            registerVisit(it)
        }, {
            showVisit(it)
        }, {
            cancelVisit(it)
        })
        binding.visitsList.adapter = visitAdapter

        binding.swipeRefresh.setOnRefreshListener {
            onPullToRefresh()
        }

        viewModel.onCreate()
        loadVisits(VisitType.VISIT_PENDING)
        setBackButton(requireActivity() as MenuHost)
        addObservers()
        return binding.root
    }

    fun onPullToRefresh() {
        viewModel.getVisit(visitType).observe(viewLifecycleOwner) { result ->
            // Este bloque SÍ se ejecuta cuando el liveData emite valores
            when (result.status) {
                Resource.Status.LOADING -> binding.swipeRefresh.isRefreshing = true
                Resource.Status.SUCCESS -> binding.swipeRefresh.isRefreshing = false
                Resource.Status.ERROR -> binding.swipeRefresh.isRefreshing = false
            }
        }
    }

    private fun loadVisits(visitType: VisitType) {

        this.visitType = visitType
        binding.title.text = when (visitType) {
            VisitType.VISIT_COMPLETE -> getString(R.string.visits_completed)
            VisitType.VISIT_PENDING -> getString(R.string.visits_pending)
            VisitType.VISIT_CANCELED -> getString(R.string.visits_canceled)
            VisitType.VISIT_UPLOADED -> getString(R.string.visits_uploaded)
            VisitType.ASSING_VISIT -> getString(R.string.assign_visit)
            else -> ""
        }

        viewModel.getVisit(visitType).observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {
                    binding.message.visibility = View.VISIBLE
                    binding.message.text = resources.getString(R.string.loading)
                }
                Resource.Status.SUCCESS -> {
                    binding.message.visibility = View.GONE
                }
                Resource.Status.ERROR -> {
                    binding.message.visibility = View.VISIBLE
                    binding.message.text = resources.getString(R.string.error_load_visits)
                }
            }
        }
    }

    private fun addObservers() {
        viewModel.visitLiveData.observe(viewLifecycleOwner) {
            if(it.isEmpty()) {
                binding.message.visibility = View.VISIBLE
                binding.message.text = resources.getString(R.string.empty_visit_list)
            }
            else{
                binding.message.visibility = View.GONE
            }
            mutableListCodBio.clear()
            it.forEach { item ->
                mutableListCodBio.add("'"+item.userCode+"'")
            }
            visitAdapter.submitList(it)
        }
    }

    private fun registerVisit(visit: Visit) {
        val action = VisitFragmentDirections.actionVisitToRegister(visit.id!!)
        findNavController().navigate(action)
    }

    private fun showVisit(visit: Visit) {
        val visitDetail = VisitDetailFragment(visit)
        visitDetail.show(parentFragmentManager, VisitDetailFragment::class.simpleName)
    }

    private fun cancelVisit(visit: Visit) {
        val action = VisitFragmentDirections.actionVisitToCancel(visit.id!!)
        findNavController().navigate(action)
    }

    private fun assignmentVisit() {
        val action = VisitFragmentDirections.actionVisitToAssignment()
        findNavController().navigate(action)
    }

    override fun setBackButton(menuHost: MenuHost) {
        menuHost.addMenuProvider(object : MenuProvider {
            override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
                menuInflater.inflate(R.menu.nav_menu_aforos, menu)
            }

            override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
                if (menuItem.itemId == android.R.id.home) {
                    requireActivity().finish()
                }
                when (menuItem.itemId) {
                    R.id.sync -> {
                        val syncFragment = SyncAforoFragment()
                        syncFragment.show(childFragmentManager, "SyncAforoFragment")
                    }
                    R.id.visit_completed -> {
                        loadVisits(VisitType.VISIT_COMPLETE)
                    }
                    R.id.visit_pending -> {
                        loadVisits(VisitType.VISIT_PENDING)
                    }
                    R.id.capacityCanceled -> {
                        loadVisits(VisitType.VISIT_CANCELED)
                    }
                    R.id.visit_uploaded -> {
                        loadVisits(VisitType.VISIT_UPLOADED)
                    }
                    R.id.searchaforos -> {
                        val searcherDialog = SearcherFragment() {
                            visitAdapter.submitList(it)
                        }
                        searcherDialog.show(childFragmentManager, "VISIT")
                    }
                    R.id.download -> {
                        downloadVisits()
                    }
                    R.id.see_map -> {
                        viewModel.arcgisMapItemModel.value?.let { maps ->
                            var mapa_aforos = maps.find { mapElement -> mapElement.name.equals("AFOROS") }
                            if (maps.isNotEmpty() && mapa_aforos != null) {
                                val action = VisitFragmentDirections.actionVisitToMapFragment( mutableListCodBio.joinToString(separator = ","),mapa_aforos.mapId.toString())
                                findNavController().navigate(action)
                            } else {
                                messageDialog.showErrorMessage("No se encontró el mapa de aforos en el grupo de la organización de arcgis.")
                            }
                        }

                    }

                    R.id.capacityAllocation -> {
                        assignmentVisit()
                        loadVisits(VisitType.ASSING_VISIT)
                    }
                }
                return false
            }
        }, viewLifecycleOwner, Lifecycle.State.RESUMED)
    }

    private fun downloadVisits() {
        this.visitType = VisitType.VISIT_PENDING
        binding.title.text = getString(R.string.visits_pending)

        viewModel.downloadVisits().observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {
                    binding.message.visibility = View.VISIBLE
                    binding.message.text = resources.getString(R.string.loading)
                    binding.mapContainer.visibility = View.GONE
                    binding.visitsList.visibility = View.GONE
                }
                Resource.Status.SUCCESS -> {
                    binding.message.visibility = View.GONE
                    binding.mapContainer.visibility = View.VISIBLE
                    binding.visitsList.visibility = View.VISIBLE
                    Toast.makeText(
                        requireContext(),
                        "Total visitas actualizadas: ${it.data}.",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                Resource.Status.ERROR -> {
                    binding.message.visibility = View.VISIBLE
                    binding.mapContainer.visibility = View.VISIBLE
                    binding.visitsList.visibility = View.VISIBLE
                    Toast.makeText(
                        requireContext(),
                        "Error al actualizar las visitas.",
                        Toast.LENGTH_SHORT
                    ).show()

                }
            }
        }
    }

}