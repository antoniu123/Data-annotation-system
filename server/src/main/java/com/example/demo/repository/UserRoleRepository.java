package com.example.demo.repository;

import com.example.demo.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

	@Modifying(clearAutomatically = true)
	@Query("update UserRole u set u.roleId = :roleId where u.userId = :userId")
	int setRole(@Param("userId") Long userId, @Param("roleId") Long roleId);

}
