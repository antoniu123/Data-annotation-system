package com.example.demo.repository;

import com.example.demo.model.Detail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DetailRepository extends JpaRepository<Detail, Long> {

	@Modifying(clearAutomatically = true)
	@Query("update Detail u set u.detailStatusId = :detailStatusId where u.id = :detailId and u.detailStatusId = 1")
	int validate(@Param("detailId") Long detailId, @Param("detailStatusId") Long detailStatusId);

}
