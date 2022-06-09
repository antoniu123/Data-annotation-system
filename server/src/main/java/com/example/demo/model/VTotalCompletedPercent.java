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
@Table(name = "V_TOTAL_DOCUMENT_DETAILS_COMPLETED_PERCENT")
public class VTotalCompletedPercent {

	@Id
	@Column(name = "OWNER_ID", nullable = false)
	private Long ownerId;

	@Column(name = "PERCENT", nullable = false)
	private Integer percent;

}
