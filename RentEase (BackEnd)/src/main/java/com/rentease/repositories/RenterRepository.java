package com.rentease.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentease.entities.Renter;

public interface RenterRepository extends JpaRepository<Renter, Long> {

	Optional<Renter> findByMail(String mail);

	boolean existsByMail(String mail);

}
