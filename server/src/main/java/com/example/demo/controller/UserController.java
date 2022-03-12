package com.example.demo.controller;

import com.example.demo.dto.UserRoleDto;
import com.example.demo.model.UserRole;
import com.example.demo.model.ApplicationUser;
import com.example.demo.model.Role;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*")
@Controller
public class UserController {
	private final UserService userService;

	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping(value="/users")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<ApplicationUser>> getAllUsers(){
		return ResponseEntity.ok().body(userService.findAllUsers());
	}

	@PostMapping(value="/user")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> saveRole(@RequestBody UserRoleDto userRoleDto){
		userService.setRole(userRoleDto);
		return ResponseEntity.status(HttpStatus.ACCEPTED).build();
	}
}
