package com.progracol.hya.ui.map.search.datasync;

import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.core.network.Resource
import com.progracol.core.network.response.ActSyncSubscriptionResponse
import com.progracol.hya.R
import com.progracol.hya.databinding.FragmentDataSyncBinding
import com.progracol.hya.ui.base.adapter.ActSyncMapAdapter
import com.progracol.hya.ui.base.adapter.ImagenAdapter
import com.progracol.hya.ui.map.imagen.ImagePreviewDialogFragment
import dagger.hilt.android.AndroidEntryPoint
import kotlin.Unit;

@AndroidEntryPoint
class MapDataSyncFragment (
        private val idSubscription: Long,
        private val closeDialog: () -> Unit
): BottomSheetDialogFragment(){

        private lateinit var binding: FragmentDataSyncBinding
        //private lateinit var dialogFragment: DialogFragment

        private val viewModel: MapDataSyncViewModel by viewModels()

        private lateinit var actSyncMapAdapter: ActSyncMapAdapter
        private lateinit var imagenAdapter: ImagenAdapter

        override fun onCreateView(
                inflater: LayoutInflater, container: ViewGroup?,
                savedInstanceState: Bundle?
        ): View {
                binding = FragmentDataSyncBinding.inflate(inflater, container, false)

                actSyncMapAdapter = ActSyncMapAdapter(
                        requireContext(),
                        onVerImagenes = { item ->
                                startViewVerImagenes(item)
                        }
                )

                getListActSyncSubscription()

                return binding.root
        }

        override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

                //LINEAR LAYOUT LISTA SINCRONIZACION
                binding.nextButton.setOnClickListener {
                        viewModel.next()
                        getListActSyncSubscription()
                }
                binding.backButton.setOnClickListener {
                        viewModel.back()
                        getListActSyncSubscription()
                }

                //LINEAR LAYOUT LISTA IMAGENES
                binding.btnCerrarImagenes.setOnClickListener {
                        imagenAdapter.submitList(listOf())
                        binding.resultScreenImagenes.visibility = View.GONE
                        binding.resultScreenList.visibility = View.VISIBLE
                }
        }

        private fun getListActSyncSubscription() {
                viewModel.getListAstSyncSubscription(idSubscription).observe(viewLifecycleOwner) {
                        when (it.status) {
                                Resource.Status.LOADING -> {
                                        binding.resultScreenList.visibility = View.GONE
                                        binding.message.visibility = View.VISIBLE
                                        binding.message.text = resources.getString(R.string.searching)
                                        actSyncMapAdapter.submitList(listOf())
                                }
                                Resource.Status.SUCCESS -> {
                                        if (it.data?.isEmpty() == true) {
                                                binding.message.text = resources.getString(R.string.not_subscription_results)
                                        } else {
                                                binding.message.visibility = View.GONE
                                                binding.resultScreenList.visibility = View.VISIBLE
                                                binding.currentPage.text = "${(viewModel.currentPage+1)}/${viewModel.totalPages}"
                                                actSyncMapAdapter.submitList(it.data)
                                                binding.backButton.visibility = if (viewModel.currentPage>0) View.VISIBLE else View.GONE
                                                binding.nextButton.visibility = if (viewModel.currentPage<viewModel.totalPages) View.VISIBLE else View.GONE
                                        }
                                }
                                Resource.Status.ERROR -> {
                                        binding.message.text = resources.getString(R.string.error_subscription_result)
                                }
                        }
                        binding.listaSincronizacion.layoutManager = LinearLayoutManager(requireContext())
                        binding.listaSincronizacion.adapter = actSyncMapAdapter
                }
        }

        override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
                return super.onCreateDialog(savedInstanceState).apply {
                        setOnShowListener { dialog ->
                                val bottomSheet = (dialog as BottomSheetDialog).findViewById<View>(
                                        com.google.android.material.R.id.design_bottom_sheet
                                )
                                bottomSheet?.layoutParams?.height = ViewGroup.LayoutParams.MATCH_PARENT
                                BottomSheetBehavior.from(bottomSheet!!).state = BottomSheetBehavior.STATE_EXPANDED
                        }
                }
        }

        private fun getImagenesActualizacion(idRegistro: Long) {
                viewModel.getImagenesActualizacion(idRegistro).observe(viewLifecycleOwner) {
                        when (it.status) {
                                Resource.Status.LOADING -> {
                                        binding.resultScreenImagenes.visibility = View.GONE
                                        binding.message.visibility = View.VISIBLE
                                        binding.message.text = resources.getString(R.string.searching)
                                        imagenAdapter.submitList(listOf())
                                }
                                Resource.Status.SUCCESS -> {
                                        if (it.data?.isEmpty() == true) {
                                                binding.message.text = resources.getString(R.string.not_subscription_results)
                                        } else {
                                                binding.message.visibility = View.GONE
                                                binding.resultScreenImagenes.visibility = View.VISIBLE
                                                imagenAdapter.submitList(it.data)
                                        }
                                }
                                Resource.Status.ERROR -> {
                                        binding.message.text = resources.getString(R.string.error_subscription_result)
                                }
                        }
                        //binding.listaImagenes.layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
                        binding.listaImagenes.adapter = imagenAdapter
                }
        }

        private fun startViewVerImagenes(actSyncItem: ActSyncSubscriptionResponse) {
                binding.resultScreenList.visibility = View.GONE
                binding.resultScreenImagenes.visibility = View.VISIBLE

                binding.titleContImagenes.text = "Imágenes Cargadas de la Actualización " + actSyncItem.idRegistro
                binding.tvObservacion.text = "Observación: \n\n" + actSyncItem.observacion

                imagenAdapter = ImagenAdapter(
                        requireContext(),
                        onItemSelected = { imagen,position ->
                                val fragmentImagePreviewDialogFragment = ImagePreviewDialogFragment(imagen,position)
                                fragmentImagePreviewDialogFragment.show(
                                        parentFragmentManager,
                                        MapDataSyncFragment::class.simpleName
                                )

                        }
                )

                getImagenesActualizacion(actSyncItem.idRegistro.toLong())

        }

        override fun onDestroyView() {
                super.onDestroyView()
                closeDialog()
        }
}