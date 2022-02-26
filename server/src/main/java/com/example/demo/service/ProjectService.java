package com.example.demo.service;

import com.example.demo.dto.ProjectDto;
import com.example.demo.model.ApplicationUser;
import com.example.demo.model.Document;
import com.example.demo.model.Project;
import com.example.demo.model.ProjectDetail;
import com.example.demo.repository.ApplicationUserRepository;
import com.example.demo.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

	private final ProjectRepository projectRepository;

	private final ApplicationUserRepository applicationUserRepository;

	@Autowired
	public ProjectService(ProjectRepository projectRepository,
						  ApplicationUserRepository applicationUserRepository) {
		this.projectRepository = projectRepository;
		this.applicationUserRepository = applicationUserRepository;
	}

	public List<Project> findAllProjects(){
		return projectRepository.findAll();
	}

	public List<Project> findAllProjectsByUser(final Long userId){
		return projectRepository.findAllByOwner(applicationUserRepository.findById(userId)
				.orElseGet(ApplicationUser::new));
	}

	public Project addProject(final Long userId, final ProjectDto projectDto){
		final Project project = new Project(projectDto.getId(),projectDto.getName(),projectDto.getDescription(),
				applicationUserRepository.findById(userId).orElseGet(ApplicationUser::new), new ArrayList<>());
		return projectRepository.save(project);
	}

}
