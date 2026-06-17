package com.stockflow.backend.repository;

import com.stockflow.backend.model.Mouvement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MouvementRepository extends JpaRepository<Mouvement, String> {
    void deleteByArticle(String article);
}
