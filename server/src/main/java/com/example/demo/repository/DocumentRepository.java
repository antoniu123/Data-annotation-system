package com.example.demo.repository;

import com.example.demo.model.ApplicationUser;
import com.example.demo.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByUser(ApplicationUser user);

    @Query(nativeQuery = true, value = "select * from document " +
            "where id in (select document_id " +
            "from document_detail dd where dd.detail_status_id = (select id from detail_status where name = 'NEW'))")
    List<Document> findAllDocumentsWithNew();
}
