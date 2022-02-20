package com.example.demo.repository;

import java.util.List;

import com.example.demo.model.Document;
import com.example.demo.model.DocumentDetail;
import com.example.demo.model.ApplicationUser;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentDetailRepository extends JpaRepository<DocumentDetail, Long> {
    List<DocumentDetail> findAllByOwner(ApplicationUser owner);

    List<DocumentDetail> findAllByDocument(Document document);
}
