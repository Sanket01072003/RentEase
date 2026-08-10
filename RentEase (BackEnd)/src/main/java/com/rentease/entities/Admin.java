package com.rentease.entities;

import com.rentease.ENUMs.UserRole;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Admin")
@Getter
@Setter
@NoArgsConstructor
@AttributeOverride(name = "id", column = @Column(name = "admin_id"))
@ToString
public class Admin extends User {

    public Admin(Long id, String name, String mail, String password, String phone) {
        super(id, name, mail, password, phone);
        this.setRole(UserRole.ADMIN);
    }
}