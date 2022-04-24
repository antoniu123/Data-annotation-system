package com.example.demo.repository;

import com.example.demo.model.DetailStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DetailStatusRepository extends JpaRepository<DetailStatus, Long> {
    Optional<DetailStatus> findByName(String name);
}
