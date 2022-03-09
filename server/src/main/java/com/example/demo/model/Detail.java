package com.example.demo.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "DOCUMENT_DETAIL")
public class Detail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "DOCUMENT_ID", nullable = false)
    private Long documentId;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "DESCRIPTION", nullable = false)
    private String description;

    @Column(name = "DETAIL_STATUS_ID", nullable = false)
    private Long detailStatusStatusId;

    @Column(name = "X")
    private Double x;

    @Column(name = "Y")
    private Double y;

    @Column(name = "OWNER_ID", nullable = false)
    private Long ownerId;

}
