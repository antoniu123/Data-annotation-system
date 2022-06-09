package com.example.demo.repository;

import com.example.demo.model.ApplicationUser;
import com.example.demo.model.VDocDetail;
import com.example.demo.model.VTotalCompletedPercent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VTotalCompletedPercentRepository extends JpaRepository<VTotalCompletedPercent, Long> {
	List<VTotalCompletedPercent> findAllByOwnerId(Long ownerId);
}

