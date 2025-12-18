

package com.progracol.aforos.ui.visit.register

import android.os.Bundle
//import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AutoCompleteTextView
import android.widget.Toast
import androidx.core.widget.addTextChangedListener
import androidx.fragment.app.activityViewModels
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.aforos.databinding.FragmentConceptFormBinding
import com.progracol.aforos.ui.adapter.ContainerAdapter
import com.progracol.core.database.entities.ParamContainerType
//import com.progracol.core.util.Util

class VisitConceptFormFragment : BottomSheetDialogFragment() {

    private lateinit var binding: FragmentConceptFormBinding
    private val viewModel: RegisterVisitViewModel by activityViewModels()

    private lateinit var containerAdapter : ContainerAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentConceptFormBinding.inflate(inflater, container, false)

        binding.saveButton.setOnClickListener { save() }

        containerAdapter = ContainerAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        setSpinner((binding.containerType.editText as AutoCompleteTextView), containerAdapter)

        // CÓDIGO ORIGINAL COMENTADO - Validación simple sin límites:
        /*
        binding.quantity.addTextChangedListener {
            it?.let { result ->
                if(result.toString().isNotEmpty()) {
                    setVolume(result.toString().toFloat())
                }
            }
        }
        */

        // CAMBIO 2: Nueva validación en tiempo real con límites 1-200
        binding.quantity.addTextChangedListener {
            it?.let { result ->
                if(result.toString().isNotEmpty()) {
                    try {
                        val quantityValue = result.toString().toDouble()
                        if (quantityValue > 200) {
                            binding.quantity.error = "Máximo 200"
                        } else if (quantityValue < 1) {
                            binding.quantity.error = "Mínimo 1"
                        } else {
                            binding.quantity.error = null
                            setVolume(result.toString().toFloat())
                        }
                    } catch (e: NumberFormatException) {
                        binding.quantity.error = "Valor no válido"
                    }
                }
            }
        }
        if (viewModel.visitType.uppercase() == "MULTIUSUARIO") {
            binding.volume.visibility = View.GONE
            binding.volumeLayout.visibility = View.GONE
        }

        loadForm()

        return binding.root
    }

    private fun loadForm() {
        viewModel.getContainerType().observe(viewLifecycleOwner) {
            containerAdapter.data = it
        }
    }

    // CÓDIGO ORIGINAL COMENTADO - Validación básica sin mensajes:
    /*
    private fun save() {
        val quantity = binding.quantity.text.toString()
        val volume = binding.volume.text.toString()
        val weight = binding.weight.text.toString()
        val note = binding.note.text.toString()

        if (quantity.isNullOrEmpty() || (volume.isNullOrEmpty() && viewModel.visitType.uppercase() != "MULTIUSUARIO" ) || weight.isNullOrEmpty() || note.isNullOrEmpty()) {
            return
        }
        viewModel.addVisitConcept(containerAdapter.selectedItem?.name ?: "", (containerAdapter.selectedItem?.code)?.toInt() ?: 0, quantity.toDouble(), volume.toDouble() ?: 0.0, weight.toDouble(), note)
        dismiss()
    }
    */

    // CAMBIO 3: Nuevo método save() con validación completa y mensajes al usuario
    private fun save() {
        val quantity = binding.quantity.text.toString()
        val volume = binding.volume.text.toString()
        val weight = binding.weight.text.toString()
        val note = binding.note.text.toString()

        // Validar que los campos no estén vacíos
        if (quantity.isNullOrEmpty() || (volume.isNullOrEmpty() && viewModel.visitType.uppercase() != "MULTIUSUARIO" ) || weight.isNullOrEmpty() || note.isNullOrEmpty()) {
            Toast.makeText(requireContext(), "Todos los campos son obligatorios", Toast.LENGTH_SHORT).show()
            return
        }

        // Validar que la cantidad esté entre 1 y 200
        try {
            val quantityValue = quantity.toDouble()
            if (quantityValue < 1 || quantityValue > 200) {
                Toast.makeText(requireContext(), "La cantidad debe estar entre 1 y 200", Toast.LENGTH_SHORT).show()
                return
            }
        } catch (e: NumberFormatException) {
            Toast.makeText(requireContext(), "Ingrese un valor numérico válido para la cantidad", Toast.LENGTH_SHORT).show()
            return
        }

        viewModel.addVisitConcept(containerAdapter.selectedItem?.name ?: "", (containerAdapter.selectedItem?.code)?.toInt() ?: 0, quantity.toDouble(), volume.toDouble() ?: 0.0, weight.toDouble(), note)
        dismiss()
    }

    private fun setSpinner(autoCompleteTextView: AutoCompleteTextView, adapter: ContainerAdapter) {
        autoCompleteTextView.setAdapter(adapter)
        autoCompleteTextView.setOnItemClickListener { adapterView, _, position, _ ->
            val selectedItem = adapterView.getItemAtPosition(position) as ParamContainerType
            autoCompleteTextView.setText(selectedItem.name)
            binding.volumeUnit.setText(selectedItem.vol)
            viewModel.currentVolume = selectedItem.vol?.toFloat() ?: 0f
            if(binding.quantity.text.toString().isNotEmpty()) {
                val quantity = binding.quantity.text.toString().toFloat()
                setVolume(quantity)
            } else {
                setVolume(0f)
            }
            adapter.selectedItem = selectedItem
        }
    }

    private fun setVolume(quantity: Float) {
        binding.volume.setText((viewModel.currentVolume * quantity).toString()).toString()
    }

}