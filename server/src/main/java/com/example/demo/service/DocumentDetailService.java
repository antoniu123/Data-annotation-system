package com.example.demo.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import com.example.demo.dto.ImageDetailDto;
import com.example.demo.model.Detail;
import com.example.demo.model.DetailStatus;
import com.example.demo.model.Document;
import com.example.demo.model.DocumentDetail;
import com.example.demo.parser.CsvParser;
import com.example.demo.parser.model.ImportRecordDocumentDetail;
import com.example.demo.repository.DetailRepository;
import com.example.demo.repository.DetailStatusRepository;
import com.example.demo.repository.DocumentDetailRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentDetailService {

        private static final Long DETAIL_STATUS_VALIDATED = 2L;

        private final DocumentService documentService;

        private final DocumentDetailRepository documentDetailRepository;

        private final DetailStatusRepository detailStatusRepository;

        private final UserService userService;

        private final CsvParser csvParser;

        private final DetailRepository detailRepository;

        @Autowired
        public DocumentDetailService(final DocumentService documentService,
                        final DetailStatusRepository detailStatusRepository,
                        final DocumentDetailRepository documentDetailRepository,
                        final DetailRepository detailRepository,
                        final UserService userService,
                        final CsvParser csvParser) {
                this.documentService = documentService;
                this.detailStatusRepository = detailStatusRepository;
                this.documentDetailRepository = documentDetailRepository;
                this.detailRepository = detailRepository;
                this.userService = userService;
                this.csvParser = csvParser;
        }

        public List<ImageDetailDto> getAllValidatedDetailForDocument(final Long documentId) {
                return documentDetailRepository.findAllByDocument(documentService.getDocumentById(documentId))
                                .parallelStream()
                                .filter(detail -> detail.getDetailStatus().getName().equals("VALIDATED"))
                                .map(detail -> new ImageDetailDto(detail.getId(), detail.getName(),
                                                detail.getDescription(),
                                                detail.getX(), detail.getY()))
                                .collect(Collectors.toList());
        }

        public List<ImageDetailDto> getAllNewDetailForDocument(final Long documentId) {
                return documentDetailRepository.findAllByDocument(documentService.getDocumentById(documentId))
                        .parallelStream()
                        .filter(detail -> detail.getDetailStatus().getName().equals("NEW"))
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
                //TODO
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
                Document document = documentService.getDocumentById(documentId);
                if (document.getDocumentType().contains("image")){
                        return (int) documentDetailRepository.findAllByDocument(documentService.getDocumentById(documentId))
                                .stream()
                                .filter(detail -> detail.getDetailStatus().getName().equals("VALIDATED"))
                                .count();
                }
                else {
                        if (document.getDocumentType().contains("video")){
                                return documentService.getAllDocumentWithName(document.getName())
                                        .stream()
                                        .map(Document::getId)
                                        .map(id-> (int) documentDetailRepository.findAllByDocument(documentService.getDocumentById(id))
                                                .stream()
                                                .filter(detail -> detail.getDetailStatus().getName().equals("VALIDATED")).count())
                                        .reduce(0, Integer::sum);
                        }
                }
                return 0;
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

        public Pair<String, byte[]> exportDocumentDetail(final Long documentId) throws IOException {
                final List<DocumentDetail> documentDetailList = documentDetailRepository
                                .findAllByDocument(documentService.getDocumentById(documentId))
                        .stream()
                        .filter(detail -> detail.getDetailStatus().getName().equals("VALIDATED"))
                        .collect(Collectors.toList());
                final String[] headerFile = new String[] { "X", "Y" };
                final List<String[]> allDataLines = new ArrayList<String[]>();
                allDataLines.add(headerFile);
                final List<String[]> dataLines = documentDetailList.stream()
                                .sorted(Comparator.comparing(DocumentDetail::getId))
                                .map(detail -> {
                                        final String[] d = new String[2];
                                        d[0] = String.valueOf(detail.getX());
                                        d[1] = String.valueOf(detail.getY());
                                        return d;
                                }).collect(Collectors.toList());

                allDataLines.addAll(dataLines);
                String pattern1 = "dd-MM-yyyy";
                String pattern2 = "HH:mm:ss";
                final SimpleDateFormat simpleDateFormatDate = new SimpleDateFormat(pattern1);
                final SimpleDateFormat simpleDateFormatTime = new SimpleDateFormat(pattern2);
                final Date date = new Date();
                final String fileName = documentId + "_" + simpleDateFormatDate.format(date) + "_" + simpleDateFormatTime.format(date)+ ".csv";
                File csvOutputFile = new File(fileName );
                try (PrintWriter pw = new PrintWriter(csvOutputFile)) {
                        allDataLines.stream()
                                        .map(this::convertToCSV)
                                        .forEach(pw::println);
                }
                try (FileInputStream fileStream = new FileInputStream(csvOutputFile)) {
                        // Instantiate array
                        byte[] arr = new byte[(int) csvOutputFile.length()];

                        // read All bytes of File stream
                        fileStream.read(arr, 0, arr.length);

                        return Pair.of(fileName, arr);
                } catch (Exception e) {
                        System.out.println(e.getMessage());
                        return null;
                }
        }

        public String convertToCSV(String[] data) {
                return String.join(",", data);
        }

        @Transactional
        public void importDocumentDetail(final Long documentId, final MultipartFile csv) throws IOException {
                final List<ImportRecordDocumentDetail> importRecordList = csvParser.parseList(csv.getInputStream(),
                                ImportRecordDocumentDetail.class, ',');

                importRecordList.forEach(r -> {
                        final Detail detail = new Detail(null, documentId, "-", "-", DETAIL_STATUS_VALIDATED,
                                        r.retrieveX(),
                                        r.retrieveY(),
                                        userService.getApplicationUser().getId());
                        detailRepository.save(detail);
                });
        }

        @Transactional
        public void validateDocumentDetail(Long detailId) {
                DetailStatus detailStatus = detailStatusRepository.findByName("VALIDATED")
                        .orElseThrow(() -> new RuntimeException("Error: Detail Status not found."));
                int rez = detailRepository.validate(detailId, detailStatus.getId().longValue());
                if (rez !=1){
                        throw new RuntimeException("detail cannot be validated");
                }
        }

        public void splitDocumentDetail(MultipartFile multipartFile) throws IOException {
                InputStream inputStream = multipartFile.getInputStream();
                AtomicInteger cnt = new AtomicInteger();
                AtomicReference<List<String[]>> lineToBePrinted = new AtomicReference<>(new ArrayList<>());
                new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))
                        .lines()
                        .forEach(line ->{
                                String[] lineAsStringArray = line.split("\\s");
                                if (lineAsStringArray.length == 10){
                                        //write the old one file
                                        if (!Objects.equals(lineToBePrinted.get().size(), 0)){
                                                final String fileName = cnt.get() + ".csv";
                                                final File oldFileToBeClosed = new File("./server/import/" + multipartFile.getOriginalFilename()
                                                        + "_" + fileName);
                                                try (PrintWriter pw = new PrintWriter(oldFileToBeClosed)) {
                                                        lineToBePrinted.get().stream()
                                                                .map(this::convertToCSV)
                                                                .forEach(pw::println);
                                                } catch (FileNotFoundException e) {
                                                        throw new RuntimeException(e);
                                                }
                                        }
                                        //open the new one list
                                        List<String[]> myList = new ArrayList<>();
                                        myList.add(new String[] { "X", "Y" });
                                        lineToBePrinted.set(myList);
                                        cnt.addAndGet(1);
                                        final String fileName = cnt.get() + ".csv";
                                        System.out.println("Start new file " + multipartFile.getOriginalFilename()
                                                + "_" + fileName);

                                }
                                if (lineAsStringArray.length == 12){
                                        List<String[]> myList = lineToBePrinted.get();
                                        myList.add(new String[] { lineAsStringArray[5], lineAsStringArray[6] });
                                        lineToBePrinted.set(myList);
                                }
                        });



        }
}
