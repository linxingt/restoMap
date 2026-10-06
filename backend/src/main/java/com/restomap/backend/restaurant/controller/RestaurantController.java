package com.restomap.backend.restaurant.controller;

import com.restomap.backend.common.web.PageResponse;
import com.restomap.backend.restaurant.dto.RestaurantCardDTO;
import com.restomap.backend.restaurant.dto.RestaurantDetailDTO;
import com.restomap.backend.restaurant.entity.Restaurant;
import com.restomap.backend.restaurant.service.RestaurantService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
class RestaurantController {
    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public PageResponse<RestaurantCardDTO> getRestaurants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> cuisineTypes,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<Integer> ratings,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "updatedAt,desc") String sort,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : null;
        var resultPage = restaurantService.getApprovedRestaurants(
                search, cuisineTypes, minPrice, maxPrice, ratings, page, size, sort, email);
        return PageResponse.of(resultPage);
    }

    @GetMapping("/cuisines")
    public List<String> getCuisineTypes() {
        return restaurantService.getAllCuisineTypes();
    }

    @GetMapping("/{id}")
    public RestaurantDetailDTO getRestaurantDetail(
            @PathVariable String id,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : null;
        return restaurantService.getRestaurantDetail(id, email);
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Restaurant.FavoriteToggleResponse> toggleFavorite(@PathVariable String id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(restaurantService.toggleFavorite(id, authentication.getName()));
    }

    @PostMapping("/{id}/visited")
    public ResponseEntity<Restaurant.VisitedToggleResponse> toggleVisited(@PathVariable String id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(restaurantService.toggleVisited(id, authentication.getName()));
    }

    @PutMapping("/{id}")
    public RestaurantCardDTO updateRestaurant(
            @PathVariable String id,
            @RequestBody RestaurantDetailDTO dto
    ) {
        return restaurantService.updateRestaurant(id, dto);
    }

    @PostMapping
    public RestaurantCardDTO createRestaurant(
            @RequestBody RestaurantDetailDTO dto
    ) {
        return restaurantService.createRestaurant(dto);
    }

    @PostMapping("/many")
    public List<RestaurantCardDTO> createManyRestaurants(@RequestBody List<RestaurantDetailDTO> dtos) {
        return restaurantService.createManyRestaurants(dtos);
    }
}
