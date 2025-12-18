package com.progracol.login.ui.login

import android.content.pm.PackageManager
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AutoCompleteTextView
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.progracol.core.data.Company
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.ui.BasicSpinnerAdapter
import com.progracol.login.R
import com.progracol.login.databinding.FragmentLoginBinding
import java.util.regex.Matcher
import java.util.regex.Pattern


class LoginFragment : BaseFragment(
    "H&A",
    isHome = true
) {

    private val viewModel: LoginViewModel by viewModels()
    private lateinit var binding: FragmentLoginBinding

    private lateinit var companiesAdapter: BasicSpinnerAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentLoginBinding.inflate(inflater, container, false)

        binding.formView.visibility = View.GONE

        companiesAdapter = BasicSpinnerAdapter(requireContext(), data = listOf())

        (binding.companies.editText as AutoCompleteTextView).setAdapter(companiesAdapter)
        (binding.companies.editText as AutoCompleteTextView).setOnItemClickListener { adapterView, _, i, _ ->
            val company = adapterView.getItemAtPosition(i) as Company
            (binding.companies.editText as AutoCompleteTextView).setText(company.displayName)
            viewModel.setSelectedCompany(company)
        }

        binding.login.setOnClickListener {
            login()
        }

        binding.recoverpassword.setOnClickListener {
            recoverPassword()
        }

        try {
            val pInfo = requireContext().packageManager.getPackageInfo(requireContext().packageName, 0)
            binding.version.text = "versión. ${pInfo.versionName}"
        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
        }

        return binding.root
    }

    private fun recoverPassword() {
        val action = LoginFragmentDirections.actionLoginFragmentToRecoverPasswordFragment()
        findNavController().navigate(action)
    }

    private fun login() {

        val username = binding.username.text.toString()
        val password = binding.password.text.toString()

        val p: Pattern = Pattern.compile("[!\"#\$%&/()=]")
        val m : Matcher = p.matcher(username)

        while (m.find()){
            binding.username.error = resources.getString(R.string.error_username)
            return
        }

        binding.username.error = null
        binding.password.error = null

        if (username.isEmpty()) {
            binding.username.error = resources.getString(R.string.error_username_empty)
            return
        }

        if (password.isEmpty()) {
            binding.password.error =resources.getString(R.string.error_password_empty)
            return
        }

        viewModel.login(username, password).observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {
                    binding.login.isEnabled = false
                    binding.login.setText(R.string.loading)
                }
                Resource.Status.SUCCESS -> {
                    loginComplete()
                }
                Resource.Status.ERROR -> {
                    binding.login.isEnabled = true
                    binding.login.setText(R.string.login)
                    messageDialog.showErrorMessage(resources.getString(R.string.error_login))
                }
            }
        }
    }

    private fun loginComplete() {
        val action = LoginFragmentDirections.actionLoginFragmentToHomeFragment()
        findNavController().navigate(action)
    }

    private fun addObservers() {
        viewModel.companiesLiveData.observe(viewLifecycleOwner) {
            companiesAdapter.data = it
        }
    }

    private fun getCompanies() {
        binding.logo.visibility = View.VISIBLE
        viewModel.getCompanies().observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {
                    binding.message.text = resources.getString(R.string.loading)
                    binding.message.visibility = View.VISIBLE
                    binding.formView.visibility = View.GONE
                }
                Resource.Status.SUCCESS -> {
                    binding.message.visibility = View.GONE
                    binding.formView.visibility = View.VISIBLE
                    binding.logo.visibility = View.VISIBLE
                }
                Resource.Status.ERROR -> {
                    binding.message.visibility = View.VISIBLE
                    binding.message.text = resources.getString(R.string.error_loading_companies)
                }
            }
        }
    }

    /**
     * Check if the user is already login and sent to HomeFragment
     */

    override fun onResume() {
        super.onResume()

        if(viewModel.isLogged()) {
            val action = LoginFragmentDirections.actionLoginFragmentToHomeFragment()
            findNavController().navigate(action)
        } else {
            addObservers()
            //Handler().postDelayed({
                getCompanies()
            //}, 3000)
        }

    }

}