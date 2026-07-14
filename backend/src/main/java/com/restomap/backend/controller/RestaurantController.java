package com.restomap.backend.controller;

import com.restomap.backend.dto.RestaurantDTO;
import com.restomap.backend.dto.RestaurantDetailDTO;
import com.restomap.backend.entity.Restaurant;
import com.restomap.backend.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
class RestaurantController {
    private final RestaurantService restaurantService;

    @GetMapping
    public List<RestaurantDTO> getRestaurants() {
        return restaurantService.getApprovedRestaurants()
                .stream()
                .map(RestaurantDTO::new) // qui crée le tableau [lat, lng]
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDetailDTO> getRestaurantDetail(
            @PathVariable Integer id
    ) {
        RestaurantDetailDTO detailDTO = restaurantService.getRestaurantDetail(id);
        return ResponseEntity.ok(detailDTO);
    }

    @PostMapping
    public Restaurant createRestaurant(
            @RequestBody RestaurantDTO dto
    ) {
        Restaurant newRestaurant = new Restaurant(dto);
        return restaurantService.addRestaurant(newRestaurant);
    }

    @PostMapping("/many")
    public List<Restaurant> createManyRestaurant(@RequestBody List<Restaurant> restaurants) {
        return restaurantService.addManyRestaurant(restaurants);
    }

}
