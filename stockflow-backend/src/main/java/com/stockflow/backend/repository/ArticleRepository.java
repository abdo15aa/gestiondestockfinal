package com.stockflow.backend.repository;

import com.stockflow.backend.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String> {
    java.util.List<Article> findByFournisseur(String fournisseur);
}
