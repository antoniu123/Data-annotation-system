package com.example.demo.controller;

import com.example.demo.dto.DocumentDto;
import com.example.demo.dto.ImageDetailDto;
import com.example.demo.model.Document;
import com.example.demo.service.DocumentDetailService;
import com.example.demo.service.DocumentService;
import com.example.demo.service.VideoStreamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@CrossOrigin(origins = "*")
@Controller
public class DocumentController {

    private final DocumentService imageService;

    private final VideoStreamService videoStreamService;

    private final DocumentDetailService documentDetailService;

    @Autowired
    public DocumentController(final DocumentService imageService,
            final VideoStreamService videoStreamService,
            final DocumentDetailService documentDetailService) {
        this.imageService = imageService;
        this.videoStreamService = videoStreamService;
        this.documentDetailService = documentDetailService;
    }

    @PostMapping(value = "/upload", produces = "application/json", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<String> uploadImage(@RequestPart("file") MultipartFile file,
            @RequestParam("name") String name)
            throws SQLException, IOException {
        Document uploadImage = imageService.uploadImage(file, name);
        return ResponseEntity.status(HttpStatus.CREATED).body(uploadImage.getFileName());
    }

    @GetMapping(value = "/document/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getDocument(@PathVariable Long id) throws SQLException {
        Pair<String, byte[]> name = imageService.getImage(id);
        return ResponseEntity.ok().body(name.getSecond());
    }

    @GetMapping(value = "/text/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getTextFile(@PathVariable Long id) throws SQLException {
        Pair<String, String> name = imageService.getTextFile(id);
        return ResponseEntity.ok().body(name.getSecond());
    }

    @GetMapping(value = "/video/{fileType}/{id}")
    public ResponseEntity<byte[]> getVideo(@RequestHeader(value = "Range", required = false) String httpRangeList,
            @PathVariable("fileType") String fileType, @PathVariable("id") Long id) throws SQLException {
        return videoStreamService.prepareContent(id, fileType, httpRangeList);
    }

    @PostMapping(value = "/video/extract/{id}")
    public ResponseEntity<Void> extractFrame(@PathVariable("id") Long id, @Valid @RequestParam int nrFrames)
            throws SQLException {
        videoStreamService.extract(id, nrFrames);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/download/{id}")
    public ResponseEntity<byte[]> getImageAsAttachment(@PathVariable Long id) throws SQLException {
        Pair<String, byte[]> name = imageService.getImage(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + name.getFirst() + "\"")
                .body(name.getSecond());
    }

    @GetMapping(value = "/userId/{userId}/documents")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('VALIDATOR')")
    public ResponseEntity<List<DocumentDto>> getMyDocumentList(@PathVariable Long userId) {
        return ResponseEntity.ok().body(imageService.getDocumentListByUser(userId));
    }

    @GetMapping(value = "/document/{id}/details/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ImageDetailDto>> getDocumentDetail(@PathVariable Long id) {
        return ResponseEntity.ok().body(documentDetailService.getAllValidatedDetailForDocument(id));
    }

    @GetMapping(value = "/document/{id}/details/new", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('VALIDATOR')")
    public ResponseEntity<List<ImageDetailDto>> getNewDocumentDetail(@PathVariable Long id){
        return ResponseEntity.ok().body(documentDetailService.getAllNewDetailForDocument(id));
    }

    @GetMapping(value = "/documents/new", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('VALIDATOR')")
    public ResponseEntity<List<Document>> getNewDocument(){
        return ResponseEntity.ok().body(imageService.getDocumentsWithStatusNew());
    }

    @PostMapping(value = "/document/{id}/detail", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ImageDetailDto>> saveDocumentDetails(@PathVariable Long id,
            @RequestBody List<ImageDetailDto> detailList){
        detailList.forEach(detail -> documentDetailService.save(id, detail));
        return ResponseEntity.status(HttpStatus.CREATED).body(documentDetailService.getAllValidatedDetailForDocument(id));
    }

    @GetMapping(value = "/document/{id}/count", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> getDocumentDetailCount(@PathVariable Long id){
        return ResponseEntity.ok().body(documentDetailService.getNumberOfDetails(id));
    }

    @DeleteMapping(value = "/documentDetail/{detailId}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void saveDocumentDetails(@PathVariable Long detailId){
        documentDetailService.deleteDocumentDetail(detailId);
    }

    @PatchMapping(value = "/documentDetail/{detailId}/validate")
    @PreAuthorize("hasRole('VALIDATOR')")
    @ResponseStatus(value = HttpStatus.ACCEPTED)
    public void validateDocumentDetails(@PathVariable Long detailId){
        documentDetailService.validateDocumentDetail(detailId);
    }

}
