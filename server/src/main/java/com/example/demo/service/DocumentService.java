package com.example.demo.service;

import com.example.demo.dto.DocumentDto;
import com.example.demo.model.ApplicationUser;
import com.example.demo.model.Document;
import com.example.demo.repository.ApplicationUserRepository;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private DocumentRepository imageRepository;

    private ApplicationUserRepository applicationUserRepository;

    private Util util;

    @Autowired
    public DocumentService(final DocumentRepository imageRepository,
                           final ApplicationUserRepository applicationUserRepository, Util util) {
        this.imageRepository = imageRepository;
        this.applicationUserRepository = applicationUserRepository;
        this.util = util;
    }

    @Transactional
    public Document uploadImage(MultipartFile file, String name) throws SerialException, SQLException, IOException {

        Blob contents = new javax.sql.rowset.serial.SerialBlob(file.getBytes());
        String documentType = file.getContentType();
        String fileName = removePathFromName(Objects.requireNonNull(file.getOriginalFilename()));
        final ApplicationUser applicationUser = util.getApplicationUser();
        final Document image = new Document(null, name, documentType, fileName, contents, applicationUser);
        return imageRepository.save(image);
    }

    public String getType(Long id) throws SQLException {
        Document image = imageRepository.getById(id);
        return image.getDocumentType();
    }

    public Pair<String, byte[]> getImage(Long id) throws SQLException {
        Document image = imageRepository.getById(id);
        Blob blob = image.getContents();
        byte[] bdata = blob.getBytes(1, (int) blob.length());
        return Pair.of(image.getName(), bdata);
    }

    public Pair<String, String> getTextFile(Long id) throws SQLException {
        Document textFile = imageRepository.getById(id);
        Blob blob = textFile.getContents();
        byte[] bdata = blob.getBytes(1, (int) blob.length());
        return Pair.of(textFile.getName(), new String(bdata, StandardCharsets.UTF_8));
    }

    public List<DocumentDto> getDocumentListByUser(Long userId){
        return imageRepository.findAllByUser(applicationUserRepository.getById(userId)).stream()
                .map(doc -> new DocumentDto(doc.getId(), doc.getName(), doc.getDocumentType(),
                        doc.getFileName()))
                .collect(Collectors.toList());
    }

    private String removePathFromName(String name) {
        int lastIndexOfSeparatorWindows = name.lastIndexOf("\\");
        if (lastIndexOfSeparatorWindows > 0) {
            return name.substring(lastIndexOfSeparatorWindows + 1, name.length());
        }
        int lastIndexOfSeparatorLinux = name.lastIndexOf("/");
        if (lastIndexOfSeparatorLinux > 0) {
            return name.substring(lastIndexOfSeparatorLinux + 1, name.length());
        }
        return name;
    }

    public Document getDocumentById(Long documentId) {
        return imageRepository.getById(documentId);
    }
}
