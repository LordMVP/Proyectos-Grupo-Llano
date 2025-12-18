package com.progracol.hya.ui.form.detail

import android.graphics.Color
import android.graphics.Paint
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.OvalShape
import android.os.Bundle
import android.text.SpannableString
import android.text.style.ImageSpan
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.CheckBox
import android.widget.LinearLayout
import androidx.core.text.HtmlCompat
import androidx.core.view.children
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.lifecycleScope
import com.progracol.core.common.MediaStorageType
import com.progracol.core.common.UploadStatus
import com.progracol.core.database.entities.ParamCommercialActivity
import com.progracol.core.database.entities.ParamFacturacion
import com.progracol.core.database.entities.ParamNeighborhood
import com.progracol.core.database.entities.SubscriptionDetail
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.ui.BasicAdapter
import com.progracol.hya.R
import com.progracol.hya.databinding.FragmentDetailBinding
import com.progracol.hya.ui.base.adapter.CommercialActivityAdapter
import com.progracol.hya.ui.base.adapter.NeighborhoodAdapter
import com.progracol.hya.ui.form.FormActivity
import com.progracol.hya.ui.form.FormViewModel
import com.progracol.hya.ui.map.MapRepository
import kotlinx.coroutines.launch

class DetailFragment : BaseFragment(
    "H&A"
) {

    private val viewModel: FormViewModel by activityViewModels()
    private lateinit var binding: FragmentDetailBinding

    private lateinit var stratumAdapter : BasicAdapter
    private lateinit var useTypeAdapter : BasicAdapter
    private lateinit var settlementAdapter : BasicAdapter
    private lateinit var facturacionAdapter : BasicAdapter
    private lateinit var serviceAdapter: ArrayAdapter<String>
    private lateinit var coordenadasAdapter: ArrayAdapter<String>
    private lateinit var neighborhoodAdapter: NeighborhoodAdapter
    private lateinit var commercialActivityAdapter : CommercialActivityAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentDetailBinding.inflate(inflater, container, false)

        crearCamposObligatorios()

        stratumAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        useTypeAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        settlementAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        facturacionAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        serviceAdapter = ArrayAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf("SI","NO"))
        coordenadasAdapter = ArrayAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf("SI","NO"))
        neighborhoodAdapter = NeighborhoodAdapter(requireActivity(), android.R.layout.simple_dropdown_item_1line, mutableListOf())
        commercialActivityAdapter = CommercialActivityAdapter(requireActivity(), android.R.layout.simple_dropdown_item_1line, mutableListOf())

        setSpinner((binding.estratoLayout.editText as AutoCompleteTextView), stratumAdapter)
        setSpinner((binding.tipoUsoLayout.editText as AutoCompleteTextView), useTypeAdapter)
        setSpinner((binding.tipoLiquidacionLayout.editText as AutoCompleteTextView), settlementAdapter)
        setSpinner((binding.tipoFacturacionLayout.editText as AutoCompleteTextView), facturacionAdapter)

        binding.servicioEmsa.setAdapter(serviceAdapter)
        binding.servicioGas.setAdapter(serviceAdapter)

        binding.coordenadasSeleccionadas.setAdapter(coordenadasAdapter)
        binding.coordenadasSeleccionadas.setOnItemClickListener { _, _, position, _ ->
            val valor = coordenadasAdapter.getItem(position) as String?
            if (valor.equals("SI")) {
                if(MapRepository.markerCoordinates != null){
                    binding.longitude.setText(MapRepository.markerCoordinates?.x.toString())
                    binding.latitude.setText(MapRepository.markerCoordinates?.y.toString())
                } else {
                    messageDialog.showWarningMessage(resources.getString(R.string.advertencia_coordenadas))
                    binding.coordenadasSeleccionadas.setText("NO", false)
                }
            }
        }

        binding.tipoFacturacion.setAdapter(facturacionAdapter)
        binding.tipoFacturacion.setOnItemClickListener { _, _, position, _ ->
            val facturacion = facturacionAdapter.getItem(position) as ParamFacturacion?
            facturacionAdapter.selectedItem = facturacionAdapter.getItem(position)
            addColoredCircle(binding.tipoFacturacion, facturacion?.color.toString(), facturacion?.name.toString())
        }

        binding.barrio.setAdapter(neighborhoodAdapter)
        binding.barrio.setOnItemClickListener { _, _, position, _ ->
            val neighborhood = neighborhoodAdapter.getItem(position) as ParamNeighborhood?
            neighborhoodAdapter.neighborhoodSelected = neighborhoodAdapter.getItem(position)
            binding.barrio.setText(neighborhood?.name)
        }

        binding.actividadComercial.setAdapter(commercialActivityAdapter)
        binding.actividadComercial.setOnItemClickListener { _, _, position, _ ->
            val commercialActivity = commercialActivityAdapter.getItem(position) as ParamCommercialActivity?
            commercialActivityAdapter.commercialActivitySelected = commercialActivityAdapter.getItem(position)
            binding.actividadComercial.setText(commercialActivity?.name)
        }

        binding.servicioEmsa.setOnItemClickListener { _, _, position, _ ->
            val item = serviceAdapter.getItem(position) ?: return@setOnItemClickListener

            if (item == "SI") {
                binding.medidorAlternoEmsaLayout.isEnabled = true
                binding.medidorAlternoEmsaLayout.visibility = View.VISIBLE
                binding.codigoAlternoEmsaLayout.isEnabled = true
                binding.codigoAlternoEmsaLayout.visibility = View.VISIBLE
            } else {
                binding.medidorAlternoEmsaLayout.isEnabled = false
                binding.medidorAlternoEmsaLayout.visibility = View.GONE
                binding.codigoAlternoEmsaLayout.isEnabled = false
                binding.codigoAlternoEmsaLayout.visibility = View.GONE
            }
        }

        binding.servicioGas.setOnItemClickListener { _, _, position, _ ->
            val item = serviceAdapter.getItem(position) ?: return@setOnItemClickListener

            if(item == "SI"){
                binding.medidorAlternoGasLayout.isEnabled = true
                binding.medidorAlternoGasLayout.visibility = View.VISIBLE
                binding.codigoAlternoGasLayout.isEnabled = true
                binding.codigoAlternoGasLayout.visibility = View.VISIBLE
            }else{
                binding.medidorAlternoGasLayout.isEnabled = false
                binding.medidorAlternoGasLayout.visibility = View.GONE
                binding.codigoAlternoGasLayout.isEnabled = false
                binding.codigoAlternoGasLayout.visibility = View.GONE
            }
        }

        loadFormData()
        loadPropertyConditionCheck()

        binding.saveButton.setOnClickListener { save() }
        binding.addPhoto.setOnClickListener { addPhoto() }

        return binding.root
    }

    private fun loadFormData() {
        lifecycleScope.launch {
            try {
                viewModel.getSubscriptionDetailById()
                loadFormSelectors {
                    addObservers()
                    binding.message.visibility = View.GONE
                    binding.formView.visibility = View.VISIBLE
                }
            } catch (e: Exception) {
                Log.e("ERROR", e.stackTraceToString())
                binding.message.visibility = View.VISIBLE
                binding.message.text = resources.getString(com.progracol.core.R.string.error_loading_data)
            }
        }
    }

    private fun addObservers() {
        viewModel.subscriptionDetail.observe(viewLifecycleOwner) {
            binding.idSuscripcion.setText(it.subscriptionId)
            binding.codigoAseo.setText(it.subscriptionCode)
            binding.nombre.setText(it.name)
            binding.catastral.setText(it.catastralCode)
            binding.direccion.setText(it.address)

            binding.servicioEmsa.setText(it.serviceEmsa, false)
            if (it.serviceEmsa == "SI") {
                binding.medidorAlternoEmsaLayout.isEnabled = true
                binding.medidorAlternoEmsaLayout.visibility = View.VISIBLE
                binding.codigoAlternoEmsaLayout.isEnabled = true
                binding.codigoAlternoEmsaLayout.visibility = View.VISIBLE
            } else {
                binding.medidorAlternoEmsaLayout.isEnabled = false
                binding.medidorAlternoEmsaLayout.visibility = View.GONE
                binding.codigoAlternoEmsaLayout.isEnabled = false
                binding.codigoAlternoEmsaLayout.visibility = View.GONE
            }
            binding.codigoAlternoEmsa.setText(it.alternateCodeEmsa)
            binding.medidorAlternoEmsa.setText(it.alternateMeterEmsa)

            binding.servicioGas.setText(it.serviceGas, false)
            if(it.serviceGas == "SI"){
                binding.medidorAlternoGasLayout.isEnabled = true
                binding.medidorAlternoGasLayout.visibility = View.VISIBLE
                binding.codigoAlternoGasLayout.isEnabled = true
                binding.codigoAlternoGasLayout.visibility = View.VISIBLE
            }else{
                binding.medidorAlternoGasLayout.isEnabled = false
                binding.medidorAlternoGasLayout.visibility = View.GONE
                binding.codigoAlternoGasLayout.isEnabled = false
                binding.codigoAlternoGasLayout.visibility = View.GONE
            }
            binding.codigoAlternoGas.setText(it.alternateCodeGas)
            binding.medidorAlternoGas.setText(it.alternateMeterGas)

            binding.nombreEstablecimiento.setText(it.propertyName)
            binding.catastralNacional.setText(it.catastralCodeNacional)
            binding.observacion.setText(it.observacion)

            if (viewModel.tipoSubscriptionDetail == 1) {
                binding.longitude.setText(it.longitude)
                binding.latitude.setText(it.latitude)
                if (it.longitude.equals("") || it.latitude.equals("")) {
                    binding.coordenadasSeleccionadas.setText("NO", false)
                } else {
                    binding.coordenadasSeleccionadas.setText("SI", false)
                }
            } else if(viewModel.tipoSubscriptionDetail == 2 || viewModel.tipoSubscriptionDetail == 3) {
                if(MapRepository.markerCoordinates != null){
                    binding.longitude.setText(MapRepository.markerCoordinates?.x.toString())
                    binding.latitude.setText(MapRepository.markerCoordinates?.y.toString())
                }
                binding.coordenadasSeleccionadas.setText("NO", false)
            }

            if (!viewModel.isOffline) {
                if (it.deshabitado != null)
                    binding.radioButtonDeshabitado.isChecked = true

                if (it.aforado != null)
                    binding.radioButtonAforado.isChecked = true

                if (it.descuento_pap != null)
                    binding.radioButtonDescuentoPAP.isChecked = true

            } else {
                if (viewModel.defaultDeshabitado != null && viewModel.defaultDeshabitado?.uppercase().equals("SI")) {
                    binding.radioButtonDeshabitado.isChecked = true
                }
                if (viewModel.defaultAforado != null && viewModel.defaultAforado?.uppercase().equals("SI")) {
                    binding.radioButtonAforado.isChecked = true
                }
                if (viewModel.defaultDescuento_pap != null && viewModel.defaultDescuento_pap?.uppercase().equals("SI")) {
                    binding.radioButtonDescuentoPAP.isChecked = true
                }
            }

        }
    }

    private fun loadFormSelectors(onLoaded: () -> Unit) {

        var loadsCompleted = 0
        val totalLoads = 7

        fun checkIfAllLoaded() {
            loadsCompleted++
            if (loadsCompleted == totalLoads) {
                onLoaded()
            }
        }

        viewModel.getStratums().observe(viewLifecycleOwner) {
            setDataSpinner(stratumAdapter, it.sortedBy { ac -> ac.name }, viewModel.subscriptionDetail.value?.stratum ?: "", (binding.estratoLayout.editText as AutoCompleteTextView))
            if (viewModel.isOffline) {
                loadSelectedStratum()
            }
            checkIfAllLoaded()
        }

        viewModel.getUseType().observe(viewLifecycleOwner) {
            setDataSpinner(useTypeAdapter, it.sortedBy { ac -> ac.name }, viewModel.subscriptionDetail.value?.useType ?: "", (binding.tipoUsoLayout.editText as AutoCompleteTextView))
            if(viewModel.isOffline) {
                loadSelectedUseType()
            }
            checkIfAllLoaded()
        }

        viewModel.getCommercialActivities().observe(viewLifecycleOwner) {
            commercialActivityAdapter.updateData(it)
            if(viewModel.isOffline){
                loadSelectedCommercialActivity()
            } else {
                val commercialActivity = it.firstOrNull { item -> item.code == viewModel.subscriptionDetail.value?.commercialActivity }
                if (commercialActivity != null) {
                    commercialActivityAdapter.commercialActivitySelected = commercialActivity
                    binding.actividadComercial.setText(commercialActivity.name)
                }
            }
            checkIfAllLoaded()
        }

        viewModel.getLandCondition().observe(viewLifecycleOwner) {
            setDataSpinner(settlementAdapter, it.sortedBy { ac -> ac.name }, viewModel.subscriptionDetail.value?.settlement ?: "", (binding.tipoLiquidacionLayout.editText as AutoCompleteTextView))
            if(viewModel.isOffline) {
                loadSelectedSettlement()
            }
            checkIfAllLoaded()
        }

        viewModel.getTiposFacturacion().observe(viewLifecycleOwner) {
            setDataSpinner(facturacionAdapter, it.sortedBy { ac -> ac.name }, viewModel.subscriptionDetail.value?.facturacion ?: "", (binding.tipoFacturacionLayout.editText as AutoCompleteTextView))
            loadSelectedFacturacion()
            checkIfAllLoaded()
        }

        viewModel.getNeighborhoods().observe(viewLifecycleOwner) {
            neighborhoodAdapter.updateData(it)
            if(viewModel.isOffline) {
                loadSelectedNeighborhood()
            } else {
                val neighborhood = it.firstOrNull { item -> item.code == viewModel.subscriptionDetail.value?.neighborhood }
                if (neighborhood != null) {
                    neighborhoodAdapter.neighborhoodSelected = neighborhood
                    binding.barrio.setText(neighborhood.name)
                }
            }
            checkIfAllLoaded()
        }

        viewModel.getMarcaciones().observe(viewLifecycleOwner) {
            it.forEach { paramMarcacion ->
                when (paramMarcacion.orden) {
                    1 -> {
                        binding.radioButtonDeshabitado.tag = paramMarcacion.code
                        binding.radioButtonDeshabitado.text = paramMarcacion.name
                        binding.radioButtonDeshabitado.contentDescription = paramMarcacion.orden.toString()
                    }
                    2 -> {
                        binding.radioButtonAforado.tag = paramMarcacion.code
                        binding.radioButtonAforado.text = paramMarcacion.name
                        binding.radioButtonAforado.contentDescription = paramMarcacion.orden.toString()
                    }
                    3 -> {
                        binding.radioButtonDescuentoPAP.tag = paramMarcacion.code
                        binding.radioButtonDescuentoPAP.text = paramMarcacion.name
                        binding.radioButtonDescuentoPAP.contentDescription = paramMarcacion.orden.toString()
                    }
                }
            }
            checkIfAllLoaded()
        }
    }

    private fun crearCamposObligatorios() {
        binding.tipoFacturacionLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.facturacion)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.direccionLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.address)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.barrioLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.neighborhood)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.estratoLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.estrato)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.tipoUsoLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.use_type)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.tipoLiquidacionLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.settlement)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
    }

    private fun validate_form() {

        if (viewModel.isEmptyGallery(mediaStorageType = MediaStorageType.HYA_DETAIL)) {
            throw Exception(resources.getString(R.string.error_add_photo))
        }

        if (binding.tipoFacturacion.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_select_tipo_facturacion))
        }

        if (binding.direccion.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_type_address))
        }

        var barrio: ParamNeighborhood? = neighborhoodAdapter.neighborhoodSelected
        if (barrio == null) {
            throw Exception(resources.getString(R.string.error_select_neighborhood))
        }

        if (binding.estrato.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_select_estrato))
        }

        if (binding.tipoUso.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_select_use_type))
        }

        if (binding.tipoLiquidacion.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_select_settlement))
        }

        var actividad: ParamCommercialActivity? = null
        val actividadText = binding.actividadComercial.text.toString()
        if (actividadText != "") {
            actividad = commercialActivityAdapter.commercialActivitySelected
            if (actividad == null) {
                throw Exception(resources.getString(R.string.error_select_activity_commercial))
            }
        }

        val longitude = binding.longitude.text.toString()
        val latitude = binding.latitude.text.toString()

        if (binding.coordenadasSeleccionadas.text.toString().equals("SI")) {
            if ((longitude.equals("") || longitude == null) || (latitude.equals("") || latitude == null)) {
                throw Exception(resources.getString(R.string.advertencia_coordenadas))
            }
        }
    }

    private fun save() {
        try {
            validate_form()

            val propertyConditionCheck = binding.propertyCondition.children.filter {
                (it as CheckBox).isChecked
            }.map { it.id }.joinToString(separator = ",")

            var uniDeshabitado: Int? = null
            var uniAforado: Int? = null
            var uniDescuento_pap: Int? = null

            for (checkConcepto in binding.groupRadioButton.children.filter { (it as CheckBox).isChecked }.iterator()) {
                Log.d("Concepto ", checkConcepto.tag.toString() + " - " + checkConcepto.contentDescription)
                when (checkConcepto.contentDescription) {
                    "1" -> uniDeshabitado = checkConcepto.tag.toString().toInt()
                    "2" -> uniAforado = checkConcepto.tag.toString().toInt()
                    "3" ->  uniDescuento_pap = checkConcepto.tag.toString().toInt()
                }
            }

            var longitud = ""
            var latitud = ""

            if (binding.coordenadasSeleccionadas.text.toString() == "SI") {
                longitud = binding.longitude.text.toString()
                latitud = binding.latitude.text.toString()
            }

            val subscriptionDetail = viewModel.subscriptionDetail.value
            val subscriptionDetailNew = SubscriptionDetail(
                id = subscriptionDetail?.id,
                subscriptionId = subscriptionDetail?.subscriptionId,
                subscriptionCode = subscriptionDetail?.subscriptionCode,
                facturacion = facturacionAdapter.selectedItem?.name,
                name = binding.nombre.text.toString(),
                //typeDocument = "",
                document = "",
                phone = "",
                email = "",
                address = binding.direccion.text.toString(),
                neighborhood = neighborhoodAdapter.neighborhoodSelected?.code ?: "1",
                propertyName = binding.nombreEstablecimiento.text.toString(),
                commercialActivity = commercialActivityAdapter.commercialActivitySelected?.code,
                //propertyCondition = propertyConditionCheck,
                stratum = stratumAdapter.selectedItem?.code,
                useType = useTypeAdapter.selectedItem?.code,
                settlement = settlementAdapter.selectedItem?.code,
                catastralCode = binding.catastral.text.toString(),
                catastralCodeNacional = binding.catastralNacional.text.toString(),
                serviceEmsa = binding.servicioEmsa.text.toString(),
                alternateMeterEmsa = binding.medidorAlternoEmsa.text.toString(),
                alternateCodeEmsa = binding.codigoAlternoEmsa.text.toString(),
                serviceGas = binding.servicioGas.text.toString(),
                alternateMeterGas = binding.medidorAlternoGas.text.toString(),
                alternateCodeGas = binding.codigoAlternoGas.text.toString(),
                deshabitado = uniDeshabitado,
                aforado = uniAforado,
                descuento_pap = uniDescuento_pap,
                observacion = binding.observacion.text.toString(),
                latitude = latitud,
                longitude = longitud,
                status = UploadStatus.PENDING.status
            )
            viewModel.saveSubscriptionDetail(subscriptionDetailNew!!).observe(viewLifecycleOwner) {
                when (it.status) {
                    Resource.Status.LOADING -> {

                    }

                    Resource.Status.SUCCESS -> messageDialog.showMessage(resources.getString(R.string.success_saving_subscription_detail))
                    Resource.Status.ERROR -> {
                        if (viewModel.mediaStorageType != MediaStorageType.HYA_DETAIL.ordinal) messageDialog.showWarningMessage(
                            resources.getString(R.string.error_add_photo)
                        )
                        else messageDialog.showErrorMessage(resources.getString(R.string.error_saving_subscription_detail))

                    }
                }
            }
        } catch (exception: Exception) {
            messageDialog.showErrorMessage(exception.message.toString())
        }
    }

    private fun addPhoto() {
        (requireActivity() as? FormActivity)?.showGallery(subscriptionId = viewModel.defaultSubscriptionCode, mediaStorageType = MediaStorageType.HYA_DETAIL, addNote = false, tag = DetailFragment::class.simpleName!!)
    }

    private fun loadSelectedStratum() {
        viewModel.getSelectedStratum().observe(viewLifecycleOwner) {
            it?.let {
                stratumAdapter.selectedItem = it
                (binding.estratoLayout.editText as AutoCompleteTextView).setText(it.name)
            }
        }
    }

    private fun loadSelectedNeighborhood() {
        viewModel.getSelectedNeighborhood(null).observe(viewLifecycleOwner) {
            it?.let {
                neighborhoodAdapter.neighborhoodSelected = it
                binding.barrio.setText(it.name)
            }
        }
    }

    private fun loadSelectedCommercialActivity() {
        viewModel.getSelectedCommercialActivity(null).observe(viewLifecycleOwner) {
            it?.let {
                commercialActivityAdapter.commercialActivitySelected = it
                binding.actividadComercial.setText(it.name)
            }
        }
    }

    private fun loadSelectedUseType() {
        viewModel.getSelectedUseType().observe(viewLifecycleOwner) {
            it?.let {
                useTypeAdapter.selectedItem = it
                (binding.tipoUsoLayout.editText as AutoCompleteTextView).setText(it.name)
            }
        }
    }

    private fun loadSelectedSettlement() {
        viewModel.getSelectedSettlement().observe(viewLifecycleOwner) {
            it?.let {
                settlementAdapter.selectedItem = it
                (binding.tipoLiquidacionLayout.editText as AutoCompleteTextView).setText(it.name)
            }
        }
    }

    private fun loadSelectedFacturacion() {
        viewModel.getSelectedFacturacion(viewModel.subscriptionDetail.value?.facturacion ?: "null").observe(viewLifecycleOwner) {
            it?.let {
                facturacionAdapter.selectedItem = it
                val autoCompleteTextView = (binding.tipoFacturacionLayout.editText as AutoCompleteTextView)
                addColoredCircle(autoCompleteTextView, it.color.toString(), it.name.toString())
            }
        }
    }

    private fun loadPropertyConditionCheck() {
        viewModel.getPropertyConditions().observe(viewLifecycleOwner) {
            //setDataSpinner(propertyConditionAdapter, it, viewModel.subscriptionDetail.value?.propertyCondition ?: "", (binding.propertyCondition.editText as AutoCompleteTextView))
            it.forEach{ propertyCondition ->

                val checkBox = CheckBox(requireContext())
                checkBox.layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                )
                checkBox.text = propertyCondition.name
                checkBox.id = propertyCondition.code.toInt()
                binding.propertyCondition.addView(checkBox)
            }
        }
        viewModel.subscriptionDetail.observe(viewLifecycleOwner) { subscriptionDetail ->
            subscriptionDetail.propertyConditionData?.forEach {
                if(it.key != null){
                    val checkBoxToCheck = binding.propertyCondition.findViewById<CheckBox>(it.key.toInt())
                    checkBoxToCheck?.isChecked = true
                }
            }
        }
        /*if(!viewModel.subscriptionDetail.value?.propertyConditionData?.isEmpty()!!){
            viewModel.subscriptionDetail.value?.propertyConditionData!!.forEach {
                val checkBoxToCheck = binding.propertyCondition.findViewById<CheckBox>(it.key.toInt())
                checkBoxToCheck?.isChecked = true
            }
        }*/
    }

    private fun addColoredCircle(textView: AutoCompleteTextView, colorHex: String, text: String) {
        // Convertir color HEX a Int
        val colorInt = Color.parseColor(colorHex)

        // Crear un círculo del color especificado
        val size = textView.textSize.toInt() // Tamaño basado en el texto
        val drawable = ShapeDrawable(OvalShape()).apply {
            intrinsicWidth = size
            intrinsicHeight = size
            paint.color = colorInt
            paint.style = Paint.Style.FILL
        }

        // Convertir a ImageSpan
        drawable.setBounds(0, 0, size, size)
        val imageSpan = ImageSpan(drawable, ImageSpan.ALIGN_BASELINE)

        // Crear el texto con el icono
        val spannable = SpannableString("  $text") // Espacio para el icono
        spannable.setSpan(imageSpan, 0, 1, 0) // Poner círculo en la primera posición

        // Asignar al AutoCompleteTextView
        textView.setText(spannable)
    }
}