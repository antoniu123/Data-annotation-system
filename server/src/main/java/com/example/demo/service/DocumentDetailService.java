package com.example.demo.service;

import com.example.demo.dto.ImageDetailDto;
import com.example.demo.model.DetailStatus;
import com.example.demo.model.Document;
import com.example.demo.model.DocumentDetail;
import com.example.demo.repository.DetailStatusRepository;
import com.example.demo.repository.DocumentDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentDetailService {

        private final DocumentService documentService;

        private final DocumentDetailRepository documentDetailRepository;

        private final DetailStatusRepository detailStatusRepository;

        private final UserService userService;

        @Autowired
        public DocumentDetailService(final DocumentService documentService,
                        final DetailStatusRepository detailStatusRepository,
                        final DocumentDetailRepository documentDetailRepository,
                        final UserService userService) {
                this.documentService = documentService;
                this.detailStatusRepository = detailStatusRepository;
                this.documentDetailRepository = documentDetailRepository;
                this.userService = userService;
        }

        public List<ImageDetailDto> getAllDetailForDocument(final Long documentId) {
                return documentDetailRepository.findAllByDocument(documentService.getDocumentById(documentId))
                                .parallelStream()
                                .filter(detail -> detail.getDetailStatus().getName().equals("VALIDATED"))
                                .map(detail -> new ImageDetailDto(detail.getId(), detail.getName(),
                                                detail.getDescription(),
                                                detail.getX(), detail.getY()))
                                .collect(Collectors.toList());
        }

        @Transactional
        public ImageDetailDto save(Long documentId, ImageDetailDto imageDetail) {
                Document document = documentService.getDocumentById(documentId);
                final DocumentDetail documentDetail = new DocumentDetail();
                documentDetail.setId(imageDetail.getId());
                documentDetail.setName(imageDetail.getName());
                documentDetail.setDescription(imageDetail.getDescription());
                documentDetail.setX(imageDetail.getX());
                documentDetail.setY(imageDetail.getY());
                documentDetail.setOwner(userService.getApplicationUser());
                DetailStatus detailStatus;
                if (userService.getApplicationUser().getRoles().stream()
                                .map(r -> r.getName().toString()).anyMatch(x -> x.equals("ROLE_ADMIN"))) {
                        detailStatus = detailStatusRepository.findByName("VALIDATED")
                                        .orElseThrow(() -> new RuntimeException("Error: Detail Status not found."));
                } else {
                        detailStatus = detailStatusRepository.findByName("NEW")
                                        .orElseThrow(() -> new RuntimeException("Error: Detail Status not found."));
                }
                documentDetail.setDetailStatus(detailStatus);
                documentDetail.setDocument(document);
                DocumentDetail newDocumentDetail = documentDetailRepository.save(documentDetail);
                return new ImageDetailDto(newDocumentDetail.getId(), newDocumentDetail.getName(),
                                newDocumentDetail.getDescription(),
                                newDocumentDetail.getX(), newDocumentDetail.getY());
        }

        public Integer getNumberOfDetails(Long documentId) {
                return (int) documentDetailRepository.findAllByDocument(documentService.getDocumentById(documentId))
                                .stream()
                                .filter(detail -> detail.getDetailStatus().getName().equals("VALIDATED"))
                                .count();
        }

        public List<ImageDetailDto> getAllNewDetailDocumentForValidation() {
                return documentDetailRepository.findAll().parallelStream()
                                .filter(detail -> detail.getDetailStatus().getName().equals("NEW"))
                                .filter(detail -> !detail.getOwner().equals(userService.getApplicationUser())) // not my
                                                                                                               // detail
                                                                                                               // not
                                                                                                               // validated
                                                                                                               // not
                                                                                                               // validated
                                .map(detail -> new ImageDetailDto(detail.getId(), detail.getName(),
                                                detail.getDescription(),
                                                detail.getX(), detail.getY()))
                                .collect(Collectors.toList());
        }

        @Transactional
        public void deleteDocumentDetail(Long documentDetailId) {
                final DocumentDetail documentDetail = documentDetailRepository.findById(documentDetailId)
                                .orElseThrow(() -> new RuntimeException("Error: Detail Status not found."));
                DetailStatus detailStatus = detailStatusRepository.findByName("DELETED")
                                .orElseThrow(() -> new RuntimeException("Error: Detail Status not found."));
                documentDetail.setDetailStatus(detailStatus);
                documentDetailRepository.save(documentDetail);
        }
}
