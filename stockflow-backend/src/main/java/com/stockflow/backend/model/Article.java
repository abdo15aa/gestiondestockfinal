package com.stockflow.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Article {
    @Id
    private String ref;
    
    private String designation;
    private String categorie;
    private int stock;
    private int seuil;
    private String fournisseur;
    
    @Enumerated(EnumType.STRING)
    private StockStatus statut;

    public enum StockStatus {
        EN_STOCK,
        STOCK_BAS,
        RUPTURE
    }
}
