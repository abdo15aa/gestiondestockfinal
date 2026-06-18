package com.stockflow.backend.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Mouvement {
    @Id
    private String id;
    private String date;
    private String article;
    @Enumerated(EnumType.STRING)
    private MovementType type;
    private int quantite;
    private String operateur;



    public enum MovementType {
        ENTREE,
        SORTIE
    }
}
