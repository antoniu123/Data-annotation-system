package com.example.demo.util;

import com.example.demo.model.ApplicationUser;
import com.example.demo.repository.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class Util {


	private final ApplicationUserRepository applicationUserRepository;

    @Autowired
	public Util(ApplicationUserRepository applicationUserRepository) {
		this.applicationUserRepository = applicationUserRepository;
	}

	public ApplicationUser getApplicationUser() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username;
		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		} else {
			username = principal.toString();
		}
		final ApplicationUser applicationUser = applicationUserRepository.findByUsername(username)
				.orElseGet(ApplicationUser::new);
		return applicationUser;
	}
}
