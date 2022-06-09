package com.example.demo.repository;

import com.example.demo.model.ApplicationUser;
import com.example.demo.model.VDocDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VDocDetailRepository extends JpaRepository<VDocDetail, String> {
    List<VDocDetail> findAllByOwner(ApplicationUser owner);
}
