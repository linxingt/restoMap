package com.restomap.backend.service;

import com.restomap.backend.entity.Restaurant;
import com.restomap.backend.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> getApprovedRestaurants() {
        return restaurantRepository.findByApprovedTrue();
    }

    public Restaurant addRestaurant(Restaurant restaurant) {
        // attente validation admin
        restaurant.setApproved(false);
        return restaurantRepository.save(restaurant);
    }

    @Transactional
    public List<Restaurant> addManyRestaurant(List<Restaurant> restaurants) {
        // attente validation admin
        for (Restaurant resto:restaurants) resto.setApproved(false);
        return restaurantRepository.saveAll(restaurants);
    }

    public Restaurant approveRestaurant(Integer id, Restaurant updatedRestaurant) {
        Restaurant resto = restaurantRepository.findById(id).orElseThrow();
        resto.updateBasicContent(updatedRestaurant);
        resto.setApproved(true);
        return restaurantRepository.save(resto);
    }

}
