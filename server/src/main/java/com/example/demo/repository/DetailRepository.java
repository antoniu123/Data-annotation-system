package com.example.demo.repository;

import com.example.demo.model.Detail;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DetailRepository extends JpaRepository<Detail, Long> {

}
