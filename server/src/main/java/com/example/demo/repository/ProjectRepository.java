package com.example.demo.repository;

import com.example.demo.model.ApplicationUser;
import com.example.demo.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
	List<Project> findAllByOwner(ApplicationUser owner);
}
