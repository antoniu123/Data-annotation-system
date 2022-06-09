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
@Table(name = "V_USER_ROLES_COUNT")
public class VUserTypeCount {
	@Id
	@Column(name = "NAME", nullable = false)
	private String type;

	@Column(name = "PERCENT", nullable = false)
	private Integer value;
}
