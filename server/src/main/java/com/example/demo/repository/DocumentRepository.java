package com.example.demo.repository;

import com.example.demo.model.ApplicationUser;
import com.example.demo.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByUser(ApplicationUser user);
}
