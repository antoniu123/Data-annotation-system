package com.example.demo.repository;

import com.example.demo.model.VUserTypeCount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VUserTypeCountRepository extends JpaRepository<VUserTypeCount, Long> {
}
