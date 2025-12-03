package com.bioagricola.aforos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SwaggerController {

	@RequestMapping("/docs")
	public String greeting() {
		return "redirect:/swagger-ui.html";
	}
	
}
