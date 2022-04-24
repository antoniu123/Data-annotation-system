package com.example.demo.model;

import com.example.demo.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "USER_ROLES")
public class UserRole {

	@Id
	@Column(name = "USER_ID", nullable = false)
	private Long userId;

	@Column(name = "ROLE_ID", nullable = false)
	private Long roleId;

}
