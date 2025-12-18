package com.progracol.hya.ui.map.detail

import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.hya.data.MapDetail
import com.progracol.hya.databinding.FragmentMapDetailBinding
import com.progracol.hya.ui.form.FormActivity
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MapDetailFragment(
    private val mapDetail: MapDetail,
    private val isOffline: Boolean = false,
    private val closeDialog: () -> Unit
) : BottomSheetDialogFragment() {

    private lateinit var binding: FragmentMapDetailBinding
    private lateinit var bottomSheetBehavior: BottomSheetBehavior<View>

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding =  FragmentMapDetailBinding.inflate(inflater, container, false)

        binding.contractName.text = mapDetail.contractName
        binding.subscriberName.text =  mapDetail.consumerName
        binding.establishment.text = mapDetail.establishment
        binding.code.text = mapDetail.code
        binding.facturacion.text = mapDetail.billCompany

        binding.servicioEmsa.text = mapDetail.servicioEnergia
        if(mapDetail.servicioEnergia != null && mapDetail.servicioEnergia?.uppercase().equals("SI")) {
            binding.alternativeCodeEmsa.text = mapDetail.codeEmsa
            binding.alternativeMedEmsa.text = mapDetail.medEnergy
        }

        binding.servicioGas.text = mapDetail.servicioGas
        if(mapDetail.servicioGas != null && mapDetail.servicioGas?.uppercase().equals("SI")) {
            binding.alternativeCodeGas.text = mapDetail.codeLlanoGas
            binding.alternativeMedGas.text = mapDetail.medGas
        }

        binding.catastral.text = mapDetail.catastralAnterior
        binding.catastralNacional.text = mapDetail.catastralNacional
        binding.activityType.text = mapDetail.activityType
        binding.neighborhood.text = mapDetail.neighborhood
        binding.address.text = mapDetail.address
        binding.stratum.text = mapDetail.stratum
        binding.propertyUse.text = mapDetail.propertyUse
        binding.tipoLiquidacion.text = mapDetail.tipoLiquidacion
        binding.creationDate.text = mapDetail.creationDate
        binding.latitude.text = mapDetail.latitude
        binding.longitude.text = mapDetail.longitude

        binding.editButton.setOnClickListener {
            val intent = Intent(this.requireContext(), FormActivity::class.java)
            intent.putExtra("isOffline", isOffline)

            intent.putExtra("idSuscripcion", mapDetail.idSuscripcion)
            intent.putExtra("subscriptionCode", mapDetail.code)
            intent.putExtra("tipoFacturacion", mapDetail.billCompany)
            intent.putExtra("catastral", mapDetail.catastralAnterior)
            intent.putExtra("catastralNacional", mapDetail.catastralNacional)
            intent.putExtra("stratum", mapDetail.stratum)
            intent.putExtra("address", mapDetail.address)
            intent.putExtra("neighborhood", mapDetail.neighborhood)
            intent.putExtra("propertyUse", mapDetail.propertyUse)
            intent.putExtra("tipoLiquidacion", mapDetail.tipoLiquidacion)
            intent.putExtra("name", mapDetail.consumerName)
            intent.putExtra("latitude", mapDetail.latitude)
            intent.putExtra("longitude", mapDetail.longitude)

            intent.putExtra("deshabitado", mapDetail.desocupado)
            intent.putExtra("aforado", mapDetail.aforado)
            intent.putExtra("descuentoPap", mapDetail.descuentoPap)
            intent.putExtra("establecimiento",mapDetail.establishment)
            intent.putExtra("actividadComercial",mapDetail.activityType)
            intent.putExtra("observacion",mapDetail.observacion)

            intent.putExtra("serviceEmsa", mapDetail.servicioEnergia)
            if(mapDetail.servicioEnergia != null && mapDetail.servicioEnergia?.uppercase().equals("SI")) {
                intent.putExtra("alternateMeterEmsa", mapDetail.medEnergy)
                intent.putExtra("alternateCodeEmsa", mapDetail.codeEmsa)
            }
            intent.putExtra("serviceGas", mapDetail.servicioGas)
            if(mapDetail.servicioGas != null && mapDetail.servicioGas?.uppercase().equals("SI")) {
                intent.putExtra("alternateMeterGas", mapDetail.medGas)
                intent.putExtra("alternateCodeGas", mapDetail.codeLlanoGas)
            }

            intent.putExtra("posFragments", "0,1,2")

            startActivity(intent)
            dismiss()
        }

        binding.closeButton.setOnClickListener {
            closeDialog()
            this.dismiss()
        }

        return binding.root
    }

    override fun onDismiss(dialog: DialogInterface) {
        super.onDismiss(dialog)
        closeDialog()
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        bottomSheetBehavior = BottomSheetBehavior.from(view.parent as View)
        bottomSheetBehavior.state = BottomSheetBehavior.STATE_EXPANDED
        bottomSheetBehavior.isDraggable = false
    }

}