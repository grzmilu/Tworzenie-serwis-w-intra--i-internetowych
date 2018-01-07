package pl.tsi8.website.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DefaultController {
	
	@GetMapping("/")
	public String home() {
		return "/home";
	}

	@GetMapping("/user")
	public String user() {
		return "/user";
	}

	@GetMapping("/login")
	public String login() {
		return "/login";
	}
}