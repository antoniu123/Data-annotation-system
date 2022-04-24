package com.example.demo.repository;

import com.example.demo.model.ApplicationUser;
import com.example.demo.model.Document;
import com.example.demo.model.DocumentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentDetailRepository extends JpaRepository<DocumentDetail, Long> {
    List<DocumentDetail> findAllByOwner(ApplicationUser owner);

    List<DocumentDetail> findAllByDocument(Document document);
}
