package com.example.demo.controller;

import com.example.demo.model.VDocDetail;
import com.example.demo.model.VTagStatus;
import com.example.demo.model.VTagsOccurences;
import com.example.demo.model.VTotalCompletedPercent;
import com.example.demo.model.VUserTypeCount;
import com.example.demo.service.GraphicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class GraphicController {

	private final GraphicService graphicService;

	@Autowired
	public GraphicController(GraphicService graphicService) {
		this.graphicService = graphicService;
	}

	@GetMapping(value = "/graphics/count", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<VDocDetail>> getDocument() {
		return ResponseEntity.ok().body(graphicService.getDocDetailsPerUser());
	}

	@GetMapping(value = "/graphics/roles", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<VUserTypeCount>> getRolePercents() {
		return ResponseEntity.ok().body(graphicService.getPercentsByRoleName());
	}

	@GetMapping(value = "/graphics/completed", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<VTotalCompletedPercent>> getCompletedPercent() {
		return ResponseEntity.ok().body(graphicService.getCompletedPercentPerUser());
	}

	@GetMapping(value = "/graphics/occurences", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<VTagsOccurences>> getNumberOfOccurences() {
		return ResponseEntity.ok().body(graphicService.getNumberOfOccurencesByTagName());
	}

	@GetMapping(value = "/graphics/status", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<VTagStatus>> getNumberOfDocumentsStatus() {
		return ResponseEntity.ok().body(graphicService.getNumberOfTagsPerStatus());
	}
}
