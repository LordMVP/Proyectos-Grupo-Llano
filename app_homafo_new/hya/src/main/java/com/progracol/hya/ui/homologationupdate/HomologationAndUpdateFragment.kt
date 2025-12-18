package com.progracol.hya.ui.homologationupdate

import android.os.Bundle
import android.util.Log
import android.view.*
import androidx.appcompat.widget.SearchView
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.progracol.core.database.entities.UserMap
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.hya.R
import com.progracol.hya.databinding.FragmentHomologationAndUpdateBinding
import com.progracol.hya.ui.base.adapter.MapAdapter
import com.progracol.hya.ui.homologationupdate.detail.MapDetailDialogFragment
import com.progracol.hya.ui.map.MapFragment

class HomologationAndUpdateFragment : BaseFragment(
    "H&A"
) {

    private val viewModel: HomologationAndUpdateViewModel by viewModels()
    private lateinit var binding: FragmentHomologationAndUpdateBinding

    private lateinit var mapAdapter: MapAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentHomologationAndUpdateBinding.inflate(inflater, container, false)

        mapAdapter = MapAdapter(requireContext(), {
            val action = HomologationAndUpdateFragmentDirections.actionHomologationsAndUpdatesToOfflineMapFragment(it.id.toString())
            findNavController().navigate(action)
        }, {
            deleteUserMap(it)
        },{
            detailUserMap(it)
        })

        viewModel.onCreate()
        addObserver()
        loadMaps()

        binding.listOfMaps.layoutManager = LinearLayoutManager(requireContext())
        binding.listOfMaps.adapter = mapAdapter

        binding.mapButton.setOnClickListener {
            viewModel.arcgisMapItemModel.value?.let { maps ->
                var mapa_hya = maps.find { mapElement -> mapElement.name.equals("HYA") }
                if (maps.isNotEmpty() && mapa_hya != null) {
                    val action = HomologationAndUpdateFragmentDirections.actionHomologationsAndUpdatesToMapFragment("",mapa_hya.mapId.toString())
                    findNavController().navigate(action)
                } else {
                    messageDialog.showErrorMessage("No se encontró el mapa de hya en el grupo de la organización de arcgis.")
                }
            }
        }

        setBackButton(requireActivity() as MenuHost)

        return binding.root
    }

    private fun addObserver() {
        viewModel.userMaps.observe(viewLifecycleOwner) {
            mapAdapter.submitList(it)
        }
    }

    private fun loadMaps() {
        viewModel.loadMaps()
    }

    override fun onResume() {
        super.onResume()
        loadMaps()
    }

    private fun detailUserMap(userMap: UserMap) {
        val mapDetailDialogFragment = MapDetailDialogFragment(userMap)
        mapDetailDialogFragment.show(parentFragmentManager, MapFragment::class.simpleName)
    }

    private fun deleteUserMap(userMap: UserMap?) {
        userMap?.let {
            viewModel.deleteUserMap(userMap).observe(viewLifecycleOwner) {
                when (it.status) {
                    Resource.Status.LOADING -> {
                    }
                    Resource.Status.SUCCESS -> {
                        messageDialog.showMessage(resources.getString(R.string.map_delete_success))
                        this.loadMaps()
                    }
                    Resource.Status.ERROR ->{
                        messageDialog.showErrorMessage(resources.getString(R.string.error_delete_map))
                    }
                }
            }
        }
    }

    fun setSearch(searchView: SearchView) {
        searchView.setOnCloseListener {
            true
        }
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener{
            override fun onQueryTextSubmit(query: String?): Boolean {
                viewModel.filterMaps(query ?: "")
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                viewModel.filterMaps(newText ?: "")
                return false
            }
        })
    }

    override fun setBackButton(menuHost: MenuHost) {
        super.setBackButton(menuHost)
        menuHost.addMenuProvider(object : MenuProvider {
            override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
                menuInflater.inflate(R.menu.nav_menu, menu)

                val menuItem = menu.findItem(R.id.searchmap)
                val searchView = menuItem.actionView as SearchView
                setSearch(searchView)
            }
            override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
                if(menuItem.itemId == android.R.id.home) {
                    requireActivity().finish()
                }
                return true
            }
        }, viewLifecycleOwner, Lifecycle.State.RESUMED)
    }

}