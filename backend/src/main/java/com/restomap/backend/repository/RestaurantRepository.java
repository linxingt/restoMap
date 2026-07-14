package com.restomap.backend.repository;

import com.restomap.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    List<Restaurant> findByApprovedTrue();
    List<Restaurant> findByCuisineTypesContainingIgnoreCase(String type);
}
