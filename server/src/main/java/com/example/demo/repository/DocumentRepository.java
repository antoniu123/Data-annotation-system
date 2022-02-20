package com.example.demo.repository;

import java.util.List;

import com.example.demo.model.Document;
import com.example.demo.model.ApplicationUser;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByUser(ApplicationUser user);
}
