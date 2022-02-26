package com.example.demo.controller;

import com.example.demo.dto.ProjectDetailDto;
import com.example.demo.dto.ProjectDto;
import com.example.demo.model.DetailProject;
import com.example.demo.model.Project;
import com.example.demo.model.ProjectDetail;
import com.example.demo.service.ProjectDetailService;
import com.example.demo.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@CrossOrigin(origins = "*")
@Controller
public class ProjectController {
	private final ProjectService projectService;

	private final ProjectDetailService projectDetailService;

	@Autowired
	public ProjectController(ProjectService projectService, ProjectDetailService projectDetailService) {
		this.projectService = projectService;
		this.projectDetailService = projectDetailService;
	}

	@GetMapping(value = "/userId/{userId}/projects")
	public ResponseEntity<List<Project>> getAllProjectsByUser(@PathVariable Long userId){
		return ResponseEntity.ok().body(projectService.findAllProjectsByUser(userId));
	}

	@GetMapping(value = "/userId/{userId}/project/{projectId}/details")
	public ResponseEntity<List<ProjectDetail>> getAllProjectsDetailsByUserAndProject
			(@PathVariable Long userId, @PathVariable Long projectId){
		return ResponseEntity.ok().body(projectDetailService.findAllProjectsDetailByUserAndProject(userId,projectId));
	}

	@PostMapping("/userId/{userId}/project")
	public ResponseEntity<Project> saveProject(@PathVariable Long userId, @RequestBody ProjectDto projectDto){
		return new ResponseEntity<>(projectService.addProject(userId,projectDto), HttpStatus.CREATED);
	}

	@PostMapping("/project/{projectId}/detail")
	public ResponseEntity<DetailProject> saveProjectDetail(@PathVariable Long projectId, @RequestBody ProjectDetailDto projectDetailDto){
		return new ResponseEntity<>(projectDetailService.addDetailToProject(projectId, projectDetailDto), HttpStatus.CREATED);
	}
}
