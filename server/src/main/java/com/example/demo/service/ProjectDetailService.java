package com.example.demo.service;

import com.example.demo.dto.ProjectDetailDto;
import com.example.demo.model.ApplicationUser;
import com.example.demo.model.DetailProject;
import com.example.demo.model.Document;
import com.example.demo.model.Project;
import com.example.demo.model.ProjectDetail;
import com.example.demo.repository.ApplicationUserRepository;
import com.example.demo.repository.DetailProjectRepository;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.repository.ProjectDetailRepository;
import com.example.demo.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectDetailService {

	private final ProjectDetailRepository projectDetailRepository;

	private final ApplicationUserRepository applicationUserRepository;

	private final ProjectRepository projectRepository;

	private final DocumentRepository documentRepository;

	private final DetailProjectRepository detailProjectRepository;

	@Autowired
	public ProjectDetailService(ProjectDetailRepository projectDetailRepository, ApplicationUserRepository applicationUserRepository, ProjectRepository projectRepository, DocumentRepository documentRepository, DetailProjectRepository detailProjectRepository) {
		this.projectDetailRepository = projectDetailRepository;
		this.applicationUserRepository = applicationUserRepository;
		this.projectRepository = projectRepository;
		this.documentRepository = documentRepository;
		this.detailProjectRepository = detailProjectRepository;
	}

	public List<ProjectDetail> findAllProjectsDetailByUserAndProject(Long subscriberId, Long projectId){
		return projectDetailRepository
				.findAllBySubscriberAndProject(applicationUserRepository.getById(subscriberId),projectRepository.getById(projectId));
	}

	public DetailProject addDetailToProject(final Long projectId, final ProjectDetailDto projectDetailDto){
		final Project project = projectRepository.findById(projectId).orElseGet(Project::new);
		final Document document = documentRepository.findById(projectDetailDto.getDocumentDto().getId()).orElseGet(Document::new);
		final ApplicationUser subscriber = applicationUserRepository.findByUsername(projectDetailDto.getSubscriberUsername())
				.orElseGet(ApplicationUser::new);
		return detailProjectRepository.save(new DetailProject(projectDetailDto.getId(), projectId,
				document.getId(), projectDetailDto.getName(), projectDetailDto.getDescription(), subscriber.getId()));
	}

}
