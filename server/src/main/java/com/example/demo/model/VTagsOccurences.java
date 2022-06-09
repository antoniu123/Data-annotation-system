package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "V_EACH_TAG_OCCURENCE_COUNT")
public class VTagsOccurences {
	@Id
	@Column(name = "NAME", nullable = false)
	private String type;

	@Column(name = "NUMBER_OF_OCCURENCES", nullable = false)
	private Integer value;
}
