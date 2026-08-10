package com.rentease.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rentease.entities.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
	Optional<Admin> findByMail(String mail);

	boolean existsByMail(String mail);
}