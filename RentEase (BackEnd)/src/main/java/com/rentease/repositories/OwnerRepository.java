package com.rentease.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentease.entities.Owner;

public interface OwnerRepository extends JpaRepository<Owner, Long> {

	Optional<Owner> findByMail(String mail);

	boolean existsByMail(String mail);
	
}
