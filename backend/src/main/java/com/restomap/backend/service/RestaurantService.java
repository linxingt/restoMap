package com.restomap.backend.service;

import com.restomap.backend.dto.CommentDTO;
import com.restomap.backend.dto.RestaurantDetailDTO;
import com.restomap.backend.entity.Comment;
import com.restomap.backend.entity.Restaurant;
import com.restomap.backend.repository.CommentRepository;
import com.restomap.backend.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final CommentRepository commentRepository;

    public List<Restaurant> getApprovedRestaurants() {
        return restaurantRepository.findByApprovedTrue();
    }

    public Restaurant addRestaurant(Restaurant restaurant) {
        restaurant.setApproved(false);
        return restaurantRepository.save(restaurant);
    }

    @Transactional
    public List<Restaurant> addManyRestaurant(List<Restaurant> restaurants) {
        for (Restaurant resto:restaurants) resto.setApproved(false);
        return restaurantRepository.saveAll(restaurants);
    }

    public Restaurant approveRestaurant(Integer id, Restaurant updatedRestaurant) {
        Restaurant resto = restaurantRepository.findById(id).orElseThrow();
        resto.updateBasicContent(updatedRestaurant);
        resto.setApproved(true);
        return restaurantRepository.save(resto);
    }

    public RestaurantDetailDTO getRestaurantDetail(Integer id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant introuvable"));

        List<Comment> comments = commentRepository.findByRestaurantId(id);

        // taux "isGood"
        long totalComments = comments.size();
        long goodComments = comments.stream().filter(c -> Boolean.TRUE.equals(c.getIsGood())).count();
        Double isGoodRatio = totalComments == 0 ? 0.0 : ((double) goodComments / totalComments) * 100.0;

        List<CommentDTO> commentDTOs = comments.stream()
                .map(CommentDTO::new)
                .toList();

        return new RestaurantDetailDTO(restaurant, commentDTOs, isGoodRatio);
    }

}
