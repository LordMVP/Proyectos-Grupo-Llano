package com.progracol.login.ui.recoverpassword

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.util.isEmailValid
import com.progracol.login.R
import com.progracol.login.databinding.RecoverPasswordFragmentBinding


class RecoverPasswordFragment : BaseFragment(
    "H&A"
) {

    private val viewModel: RecoverPasswordViewModel by viewModels()
    private lateinit var binding: RecoverPasswordFragmentBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = RecoverPasswordFragmentBinding.inflate(inflater, container, false)

        binding.btnemailrecover.setOnClickListener {
            recoverEmail()
        }

        return binding.root
    }

    private fun recoverEmail() {
        val email = binding.email.text.toString()
        if(!email.isEmailValid()){
            binding.email.error = resources.getString(R.string.error_valid_email)
            return
        }
        hideKeyboard(binding.email)
        viewModel.recoverPassword(email).observe(viewLifecycleOwner){
            when(it.status){
                Resource.Status.LOADING->{
                    binding.btnemailrecover.text = resources.getString(R.string.loading)
                    binding.btnemailrecover.isEnabled = false
                }
                Resource.Status.SUCCESS ->{
                    it.data?.let { data ->
                        this.messageDialog.showMessage(data.message)
                    }
                    binding.email.text?.clear()
                    binding.btnemailrecover.text = resources.getString(R.string.send)
                    binding.btnemailrecover.isEnabled = true
                }
                Resource.Status.ERROR ->{
                    it.message?.let { message ->
                        this.messageDialog.showErrorMessage(message)
                    }
                    binding.btnemailrecover.text = resources.getString(R.string.send)
                    binding.btnemailrecover.isEnabled = true
                }
            }
        }
    }
}