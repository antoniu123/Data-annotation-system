package com.example.demo.service;

import com.example.demo.dto.UserRoleDto;
import com.example.demo.model.DocumentRole;
import com.example.demo.model.UserRole;
import com.example.demo.model.ApplicationUser;
import com.example.demo.model.Role;
import com.example.demo.repository.ApplicationUserRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private ApplicationUserRepository applicationUserRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public ApplicationUser getApplicationUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return applicationUserRepository.findByUsername(username)
                .orElseGet(ApplicationUser::new);
    }

    public List<ApplicationUser> findAllUsers(){
        return applicationUserRepository.findAll();
    }

    @Transactional
    public void setRole(UserRoleDto userRoleDto){
        applicationUserRepository.findById(userRoleDto.getUserId())
                .map(user -> {
                    final Role role = roleRepository.findByName(DocumentRole.valueOf( userRoleDto.getUserRole())).orElseGet(Role::new);
                    int res = userRoleRepository.setRole(user.getId(), role.getId().longValue());
                    if (res == 1){
                        return user;
                    }
                    throw new RuntimeException("user not updated");
                })
                .orElseThrow(()->new RuntimeException("user not found"));

    }
}
