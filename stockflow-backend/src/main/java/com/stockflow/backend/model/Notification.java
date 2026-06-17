package com.stockflow.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Notification {
    @Id
    private String id;
    
    private String severity; // "critical", "warning", "info"
    private String title;
    private String description;
    private String timestamp;
    private boolean unread;
}
