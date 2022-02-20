package com.example.demo.repository;

import java.util.Optional;

import com.example.demo.model.DocumentRole;
import com.example.demo.model.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(DocumentRole name);
}
