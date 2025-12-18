package com.progracol.aforos.ui.visit.register

import android.graphics.Bitmap
import android.os.Bundle
import android.util.Base64
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.CheckBox
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.github.gcacace.signaturepad.views.SignaturePad
import com.progracol.aforos.R
import com.progracol.aforos.common.VisitType
import com.progracol.aforos.databinding.FragmentSignatureBinding
import com.progracol.core.database.entities.Visit
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseBottomSheetDialogFragment
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.android.synthetic.main.fragment_searcher.*
import kotlinx.android.synthetic.main.fragment_signature.*
import java.io.ByteArrayOutputStream

@AndroidEntryPoint
class SignatureFragment : BaseBottomSheetDialogFragment() {

    private lateinit var binding: FragmentSignatureBinding
    private val viewModel: RegisterVisitViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentSignatureBinding.inflate(inflater, container, false)

        binding.signaturePadUser.setOnSignedListener(object :
            SignaturePad.OnSignedListener {
            override fun onStartSigning() {
            }
            override fun onSigned() {
                binding.signatureClearUser.isEnabled = true
            }
            override fun onClear() {
                binding.signatureClearUser.isEnabled = false
            }
        })
        binding.signatureClearUser.setOnClickListener {
            binding.signaturePadUser.clear()
        }

        binding.signaturePadConsumer.setOnSignedListener(object :
            SignaturePad.OnSignedListener {
            override fun onStartSigning() {
            }
            override fun onSigned() {
                binding.signatureClearConsumer.isEnabled = true
            }
            override fun onClear() {
                binding.signatureClearConsumer.isEnabled = false
            }
        })
        binding.signatureClearConsumer.setOnClickListener {
            binding.signaturePadConsumer.clear()
        }
        binding.checkTerms.setOnClickListener {
            checkTerms()
        }

        binding.checkTermsText.setOnClickListener {
            showTerms()
        }

        binding.saveButton.setOnClickListener {
            saveVisit()
        }

        return binding.root
    }

    private fun checkTerms() {
        if(binding.checkTerms.isChecked) {
            binding.saveButton.visibility = View.VISIBLE
        } else {
            binding.saveButton.visibility = View.GONE
        }
    }

    private fun showTerms() {
        val terms = TermsFragment()
        terms.show(parentFragmentManager, TermsFragment::class.simpleName)
    }

    private fun saveVisit() {
        var signatureConsumer = binding.signaturePadConsumer.signatureBitmap
        val byteArrayOutputStreamConsumer = ByteArrayOutputStream();
        signatureConsumer.compress(Bitmap.CompressFormat.JPEG,50, byteArrayOutputStreamConsumer)
        var encodedImageConsumer : String = Base64.encodeToString(byteArrayOutputStreamConsumer.toByteArray(), Base64.DEFAULT);

        var signatureUser = binding.signaturePadUser.signatureBitmap
        val byteArrayOutputStreamUser = ByteArrayOutputStream();
        signatureUser.compress(Bitmap.CompressFormat.JPEG,50, byteArrayOutputStreamUser)
        var encodedImageUser : String = Base64.encodeToString(byteArrayOutputStreamUser.toByteArray(), Base64.DEFAULT);

        var updatedVisit = viewModel.visit.value ?: Visit(null)
        updatedVisit.consumerSignature = encodedImageConsumer
        updatedVisit.consumerName = binding.nameConsumer.text.toString()
        updatedVisit.userSignature = encodedImageUser

        viewModel.saveVisit(updatedVisit).observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {}
                Resource.Status.SUCCESS -> {
                    messageDialog.showMessage(resources.getString(R.string.success_saving_visit))
                    dismiss()
                    findNavController().popBackStack()
                }
                Resource.Status.ERROR -> messageDialog.showErrorMessage(resources.getString(R.string.error_saving_visit))
            }
        }
    }

}