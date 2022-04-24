package com.example.demo.repository;

import com.example.demo.model.ApplicationUser;
import com.example.demo.model.Project;
import com.example.demo.model.ProjectDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectDetailRepository extends JpaRepository<ProjectDetail, Long> {
	List<ProjectDetail> findAllBySubscriberAndProject(ApplicationUser subscriber, Project project);
}
