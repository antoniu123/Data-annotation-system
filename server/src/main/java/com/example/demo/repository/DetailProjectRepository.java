package com.example.demo.repository;

import com.example.demo.model.DetailProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailProjectRepository extends JpaRepository<DetailProject, Long> {
}
