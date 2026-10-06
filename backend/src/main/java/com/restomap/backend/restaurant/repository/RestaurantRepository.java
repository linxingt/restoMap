package com.restomap.backend.restaurant.repository;

import com.restomap.backend.restaurant.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurant, String>, JpaSpecificationExecutor<Restaurant> {
    @Override
    @EntityGraph(attributePaths = {"photos", "cuisineTypes"})
    Optional<Restaurant> findById(String id);

    @Query("SELECT DISTINCT c FROM Restaurant r JOIN r.cuisineTypes c WHERE r.approved = true")
    List<String> findAllDistinctCuisineTypes();
}
