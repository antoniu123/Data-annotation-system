package com.example.demo.controller;

import com.example.demo.dto.JwtResponseDto;
import com.example.demo.dto.LoginRequestDto;
import com.example.demo.dto.MessageResponseDto;
import com.example.demo.dto.PasswordResponseDto;
import com.example.demo.dto.RecoveryRequestDto;
import com.example.demo.dto.ReplacePasswordRequestDto;
import com.example.demo.dto.SignupRequestDto;
import com.example.demo.model.ApplicationUser;
import com.example.demo.model.DocumentRole;
import com.example.demo.model.Role;
import com.example.demo.repository.ApplicationUserRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.Set;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ApplicationUserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtService jwtService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDto loginRequest)
            throws UnsupportedEncodingException {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtService.generateJwtToken(authentication);

        return ResponseEntity.ok(
                new JwtResponseDto(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequestDto signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("username is already in use!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("email is already in use!");
        }

        // Create new user's account
        ApplicationUser user = new ApplicationUser(signUpRequest.getUsername(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(DocumentRole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(DocumentRole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "user":
                        Role modRole = roleRepository.findByName(DocumentRole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(DocumentRole.ROLE_VALIDATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponseDto("User registered successfully!"));
    }

    @PostMapping("/recovery")
    public ResponseEntity<?> recoveryUser(@Valid @RequestBody RecoveryRequestDto recoveryRequestDto) {
        if (!userRepository.existsByEmail(recoveryRequestDto.getEmail())) {
            throw new RuntimeException("email doesn't exists");
        }
        // final User user =
        // userRepository.findByEmail(recoveryRequestDto.getEmail()).get();
        // final UUID uuid = UUID.randomUUID();
        // TODO insert a new line into a table for renewing passwords PASSWORD_CHANGES
        // also a link will be generated in one column of that table
        // send to email
        // link will be something like http://ip:3001/recovery/{uuid}
        return ResponseEntity.ok(new MessageResponseDto("Message to email was sent successfully"));
    }

    @PostMapping(value = "/recovery/{uuid}")
    public ResponseEntity<?> replacePassword(@PathVariable Long id,
            @Valid @RequestBody ReplacePasswordRequestDto replacePasswordRequestDto) {
        // get the line from PASSWORD_CHANGES based on uuid and user
        ApplicationUser user = new ApplicationUser(); // TODO replace that with the user from line corresponsing to that
                                                      // uuid
        String newPassword = encoder.encode(replacePasswordRequestDto.getPassword());
        user.setPassword(newPassword);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponseDto("Password updated"));
    }

    @GetMapping("/passwordverify/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('VALIDATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getHashPassword(@PathVariable Long userId) {
        if (!userRepository.findById(userId).isPresent()) {
            throw new RuntimeException("user doesn't exists");
        }
        return ResponseEntity.ok(new PasswordResponseDto(userRepository.findById(userId).get().getPassword()));
    }

    @PostMapping("/passwordchange/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('VALIDATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@PathVariable Long userId,
            @Valid @RequestBody ReplacePasswordRequestDto replacePasswordRequestDto) {
        if (!userRepository.findById(userId).isPresent()) {
            throw new RuntimeException("email doesn't exists");
        }
        userRepository.findById(userId).map(user -> {
            user.setPassword(encoder.encode(replacePasswordRequestDto.getPassword()));
            userRepository.save(user);
            return user;
        }).orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new MessageResponseDto("Password updated"));
    }

}
