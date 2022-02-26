package com.example.demo.service;

import com.example.demo.model.Document;
import com.example.demo.repository.DocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;

@Service
public class VideoStreamService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public static final String VIDEO = "/video";

    public static final String CONTENT_TYPE = "Content-Type";
    public static final String CONTENT_LENGTH = "Content-Length";
    public static final String VIDEO_CONTENT = "video/";
    public static final String CONTENT_RANGE = "Content-Range";
    public static final String ACCEPT_RANGES = "Accept-Ranges";
    public static final String BYTES = "bytes";
    public static final int BYTE_RANGE = 1024;

    private DocumentRepository imageRepository;

    @Autowired
    public VideoStreamService(DocumentRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public ResponseEntity<byte[]> prepareContent(Long id, String fileType, String range) throws SQLException {

        long rangeStart = 0;
        long rangeEnd;
        byte[] data;
        Long fileSize;

        try {
            fileSize = getFileSize(id);
            if (range == null) {
                return ResponseEntity.status(HttpStatus.OK).header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                        .header(CONTENT_LENGTH, String.valueOf(fileSize))
                        .body(readByteRange(id, rangeStart, fileSize - 1)); // Read the object and convert it as bytes
            }
            String[] ranges = range.split("-");
            rangeStart = Long.parseLong(ranges[0].substring(6));
            if (ranges.length > 1) {
                rangeEnd = Long.parseLong(ranges[1]);
            } else {
                rangeEnd = fileSize - 1;
            }
            if (fileSize < rangeEnd) {
                rangeEnd = fileSize - 1;
            }
            data = readByteRange(id, rangeStart, rangeEnd);
        } catch (IOException e) {
            logger.error("Exception while reading the file {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        String contentLength = String.valueOf((rangeEnd - rangeStart) + 1);
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
                .header(ACCEPT_RANGES, BYTES).header(CONTENT_LENGTH, contentLength)
                .header(CONTENT_RANGE, BYTES + " " + rangeStart + "-" + rangeEnd + "/" + fileSize).body(data);

    }

    public byte[] readByteRange(Long id, long start, long end) throws IOException, SQLException {

        byte[] fileData = getBytesDataFromFileId(id);
        try (InputStream inputStream = (new ByteArrayInputStream(fileData));
                ByteArrayOutputStream bufferedOutputStream = new ByteArrayOutputStream()) {
            byte[] data = new byte[BYTE_RANGE];
            int nRead;
            while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                bufferedOutputStream.write(data, 0, nRead);
            }
            bufferedOutputStream.flush();
            byte[] result = new byte[(int) (end - start) + 1];
            System.arraycopy(bufferedOutputStream.toByteArray(), (int) start, result, 0, result.length);
            return result;
        }
    }

    public Long getFileSize(Long id) throws SQLException {
        return (long) getBytesDataFromFileId(id).length;
    }

    private byte[] getBytesDataFromFileId(Long id) throws SQLException {
        Document document = imageRepository.getById(id);
        return document.getContents().getBytes(1, (int) document.getContents().length());
    }

}