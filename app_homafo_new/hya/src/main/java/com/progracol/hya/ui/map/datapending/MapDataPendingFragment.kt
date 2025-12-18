package com.progracol.hya.ui.map.search.datasync;

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.core.database.entities.Independence
import com.progracol.core.database.entities.SubscriptionDetail
import com.progracol.core.network.Resource
import com.progracol.core.network.response.ActSyncSubscriptionResponse
import com.progracol.hya.R
import com.progracol.hya.databinding.FragmentDataPendingBinding
import com.progracol.hya.databinding.FragmentDataSyncBinding
import com.progracol.hya.ui.base.adapter.ActSyncMapAdapter
import com.progracol.hya.ui.base.adapter.ImagenAdapter
import com.progracol.hya.ui.base.adapter.IndependenceAdapter
import com.progracol.hya.ui.base.adapter.PointAdapter
import com.progracol.hya.ui.base.adapter.SubscriptionDetailAdapter
import com.progracol.hya.ui.form.FormActivity
import com.progracol.hya.ui.map.imagen.ImagePreviewDialogFragment
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import kotlin.Unit;

@AndroidEntryPoint
class MapDataPendingFragment (
        private val closeDialog: () -> Unit
): BottomSheetDialogFragment(){

        private lateinit var binding: FragmentDataPendingBinding

        private val viewModel: MapDataPendingViewModel by viewModels()

        private lateinit var actPendingAdapter: SubscriptionDetailAdapter
        private lateinit var indPendingAdapter: IndependenceAdapter
        private lateinit var pointPendingAdapter: PointAdapter

        override fun onCreateView(
                inflater: LayoutInflater, container: ViewGroup?,
                savedInstanceState: Bundle?
        ): View {
                binding = FragmentDataPendingBinding.inflate(inflater, container, false)

                actPendingAdapter = SubscriptionDetailAdapter(requireContext(), {
                        //DELETE BUTTON
                        val item: SubscriptionDetail = it
                        lifecycleScope.launch {
                                viewModel.deleteActualizacion(item)
                        }
                        val updatedList = actPendingAdapter.currentList.toMutableList()
                        updatedList.remove(item)
                        actPendingAdapter.submitList(updatedList)
                },{
                        //EDIT BUTTON
                        val item: SubscriptionDetail = it
                        val intent = Intent(requireContext(), FormActivity::class.java)

                        intent.putExtra("isOffline", false)

                        intent.putExtra("idSuscripcion", item.subscriptionId)
                        intent.putExtra("subscriptionCode", item.subscriptionCode)
                        intent.putExtra("tipoFacturacion", item.facturacion)
                        intent.putExtra("catastral", item.catastralCode)
                        intent.putExtra("catastralNacional", item.catastralCodeNacional)
                        intent.putExtra("stratum", item.stratum)
                        intent.putExtra("address", item.address)
                        intent.putExtra("neighborhood", item.neighborhood)
                        intent.putExtra("propertyUse", item.useType)
                        intent.putExtra("tipoLiquidacion", item.settlement)
                        intent.putExtra("name", item.name)
                        intent.putExtra("latitude", item.latitude)
                        intent.putExtra("longitude", item.longitude)

                        intent.putExtra("deshabitado", item.deshabitado)
                        intent.putExtra("aforado", item.aforado)
                        intent.putExtra("descuentoPap", item.descuento_pap)
                        intent.putExtra("establecimiento",item.propertyName)
                        intent.putExtra("actividadComercial",item.commercialActivity)
                        intent.putExtra("observacion",item.observacion)

                        intent.putExtra("serviceEmsa", item.serviceEmsa)
                        intent.putExtra("alternateMeterEmsa", item.alternateMeterEmsa)
                        intent.putExtra("alternateCodeEmsa", item.alternateCodeEmsa)

                        intent.putExtra("serviceGas", item.serviceGas)
                        intent.putExtra("alternateMeterGas", item.alternateMeterGas)
                        intent.putExtra("alternateCodeGas", item.alternateCodeGas)

                        //0 -> ACTUALIZACION
                        intent.putExtra("posFragments", "0")
                        startActivity(intent)
                })

                indPendingAdapter = IndependenceAdapter(requireContext(), {
                        //DELETE BUTTON
                        val item: Independence = it
                        lifecycleScope.launch {
                                viewModel.deleteIndependencia(item)
                        }
                        val updatedList = indPendingAdapter.currentList.toMutableList()
                        updatedList.remove(item)
                        indPendingAdapter.submitList(updatedList)
                },{
                        //EDIT BUTTON
                        val item: Independence = it
                        val intent = Intent(requireContext(), FormActivity::class.java)

                        intent.putExtra("isOffline", false)

                        intent.putExtra("subscriptionCode", item.subscriptionCode)
                        intent.putExtra("tipoFacturacion", item.facturacion)
                        intent.putExtra("catastral", item.catastralCode)
                        intent.putExtra("catastralNacional", item.catastralCodeNacional)
                        intent.putExtra("stratum", item.stratum)
                        intent.putExtra("address", item.address)
                        intent.putExtra("neighborhood", item.neighborhood)
                        intent.putExtra("propertyUse", item.useType)
                        intent.putExtra("tipoLiquidacion", item.settlement)
                        intent.putExtra("name", item.name)
                        intent.putExtra("latitude", item.latitude)
                        intent.putExtra("longitude", item.longitude)

                        intent.putExtra("deshabitado", item.deshabitado)
                        //intent.putExtra("aforado", item.aforado)
                        intent.putExtra("descuentoPap", item.descuento_pap)
                        intent.putExtra("establecimiento",item.propertyName)
                        intent.putExtra("actividadComercial",item.commercialActivity)
                        intent.putExtra("observacion",item.observacion)

                        intent.putExtra("serviceEmsa", item.serviceEmsa)
                        intent.putExtra("alternateMeterEmsa", item.alternateMeterEmsa)
                        intent.putExtra("alternateCodeEmsa", item.alternateCodeEmsa)

                        intent.putExtra("serviceGas", item.serviceGas)
                        intent.putExtra("alternateMeterGas", item.alternateMeterGas)
                        intent.putExtra("alternateCodeGas", item.alternateCodeGas)

                        //1 -> INDEPENDENCIA
                        intent.putExtra("posFragments", "1")
                        startActivity(intent)
                })

                pointPendingAdapter = PointAdapter(requireContext(), {
                        //DELETE BUTTON
                        val item: com.progracol.core.database.entities.Point = it
                        lifecycleScope.launch {
                                viewModel.deletePoint(item)
                        }
                        val updatedList = pointPendingAdapter.currentList.toMutableList()
                        updatedList.remove(item)
                        pointPendingAdapter.submitList(updatedList)
                },{
                        //EDIT BUTTON
                        val item: com.progracol.core.database.entities.Point = it
                        val intent = Intent(requireContext(), FormActivity::class.java)

                        intent.putExtra("isOffline", false)

                        //intent.putExtra("idSuscripcion", item.subscriptionId)
                        //intent.putExtra("subscriptionCode", item.subscriptionCode)
                        intent.putExtra("pointId", item.id)
                        intent.putExtra("fechaEncuesta", item.fechaEncuesta)
                        intent.putExtra("colaborador", item.colaborador)
                        intent.putExtra("typeDocument", item.typeDocument)
                        intent.putExtra("document", item.document)
                        intent.putExtra("phone", item.phone)
                        intent.putExtra("email", item.email)
                        intent.putExtra("zone", item.zone)
                        intent.putExtra("tipoFacturacion", item.facturacion)
                        intent.putExtra("catastral", item.catastralCode)
                        intent.putExtra("catastralNacional", item.catastralCodeNacional)
                        intent.putExtra("stratum", item.stratum)
                        intent.putExtra("address", item.address)
                        intent.putExtra("neighborhood", item.neighborhood)
                        intent.putExtra("propertyUse", item.useType)
                        intent.putExtra("tipoLiquidacion", item.settlement)
                        intent.putExtra("name", item.name)
                        intent.putExtra("latitude", item.latitude)
                        intent.putExtra("longitude", item.longitude)

                        intent.putExtra("deshabitado", item.deshabitado.toString())
                        //intent.putExtra("aforado", item.aforado)
                        intent.putExtra("descuentoPap", item.descuento_pap.toString())
                        intent.putExtra("establecimiento",item.propertyName)
                        intent.putExtra("actividadComercial",item.commercialActivity)
                        intent.putExtra("observacion",item.observacion)

                        intent.putExtra("serviceEmsa", item.serviceEmsa)
                        intent.putExtra("alternateMeterEmsa", item.alternateMeterEmsa)
                        intent.putExtra("alternateCodeEmsa", item.alternateCodeEmsa)

                        intent.putExtra("serviceGas", item.serviceGas)
                        intent.putExtra("alternateMeterGas", item.alternateMeterGas)
                        intent.putExtra("alternateCodeGas", item.alternateCodeGas)

                        //3 -> PUNTO
                        intent.putExtra("posFragments", "3")
                        startActivity(intent)
                })

                return binding.root
        }

        override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
                loadData()
                addObservers()
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

        override fun onDestroyView() {
                super.onDestroyView()
                closeDialog()
        }

        override fun onResume() {
                super.onResume()
                loadData()
        }

        private fun addObservers() {
                viewModel.actualizacionesPendientesList.observe(viewLifecycleOwner) {
                        if (it.isEmpty() == true) {
                                binding.messageAct.visibility = View.VISIBLE
                                binding.messageAct.text = resources.getString(R.string.not_act_pending_results)
                        } else {
                                actPendingAdapter.submitList(it)
                        }
                        binding.listActualizacion.layoutManager = LinearLayoutManager(requireContext())
                        binding.listActualizacion.adapter = actPendingAdapter
                }

                viewModel.independenciasPendientesList.observe(viewLifecycleOwner) {
                        if (it.isEmpty() == true) {
                                binding.messageInd.visibility = View.VISIBLE
                                binding.messageInd.text = resources.getString(R.string.not_ind_pending_results)
                        } else {
                                indPendingAdapter.submitList(it)
                        }
                        binding.listIndependencia.layoutManager = LinearLayoutManager(requireContext())
                        binding.listIndependencia.adapter = indPendingAdapter
                }

                viewModel.puntosPendientesList.observe(viewLifecycleOwner) {
                        if (it.isEmpty() == true) {
                                binding.messagePoint.visibility = View.VISIBLE
                                binding.messagePoint.text = resources.getString(R.string.not_point_pending_results)
                        } else {
                                pointPendingAdapter.submitList(it)
                        }
                        binding.listPunto.layoutManager = LinearLayoutManager(requireContext())
                        binding.listPunto.adapter = pointPendingAdapter
                }
        }

        private fun loadData() {
                viewModel.loadActPending()
                viewModel.loadIndPending()
                viewModel.loadPointPending()
        }
}