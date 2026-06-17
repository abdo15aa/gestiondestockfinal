package com.stockflow.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Fournisseur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFournisseur;
    
    private String nom;
    private String contact;
}
