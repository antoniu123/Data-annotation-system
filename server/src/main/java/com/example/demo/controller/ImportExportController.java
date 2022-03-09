package com.example.demo.controller;

import java.io.IOException;
import java.sql.SQLException;

import com.example.demo.service.DocumentDetailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
public class ImportExportController {

    private final DocumentDetailService documentDetailService;

    @Autowired
    public ImportExportController(DocumentDetailService documentDetailService) {
        this.documentDetailService = documentDetailService;
    }

    @GetMapping(value = "/document/{documentId}/export")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportDocumentDetails(@PathVariable Long documentId)
            throws SQLException, IOException {
        Pair<String, byte[]> name = documentDetailService.exportDocumentDetail(documentId);
        return ResponseEntity.ok()
                .header("filename", name.getFirst())
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + name.getFirst() + "\"")
                .header("Access-Control-Expose-Headers", "filename")
                .body(name.getSecond());
    }

    @PostMapping(value = "/document/{documentId}/import", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> importDocumentDetails(@PathVariable Long documentId,
            @RequestPart("file") MultipartFile csvFile) throws IOException {
        if (csvFile.isEmpty()) {
            throw new IllegalArgumentException("csv file is empty");
        }
        documentDetailService.importDocumentDetail(documentId, csvFile);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}