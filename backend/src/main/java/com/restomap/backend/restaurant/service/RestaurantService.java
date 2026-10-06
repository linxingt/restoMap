package com.restomap.backend.restaurant.service;

import com.restomap.backend.common.exception.ResourceNotFoundException;
import com.restomap.backend.comment.dto.CommentDTO;
import com.restomap.backend.restaurant.dto.RestaurantCardDTO;
import com.restomap.backend.restaurant.dto.RestaurantDetailDTO;
import com.restomap.backend.comment.entity.Comment;
import com.restomap.backend.restaurant.entity.Restaurant;
import com.restomap.backend.restaurant.repository.RestaurantRepository;
import com.restomap.backend.user.entity.User;
import com.restomap.backend.comment.repository.CommentRepository;
import com.restomap.backend.common.location.GeocodingService;
import com.restomap.backend.restaurant.specification.RestaurantSpecification;
import com.restomap.backend.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class RestaurantService {
    private static final Logger log = LoggerFactory.getLogger(RestaurantService.class);

    private final RestaurantRepository restaurantRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final GeocodingService geocodingService;

    public RestaurantService(RestaurantRepository restaurantRepository, CommentRepository commentRepository, UserRepository userRepository, GeocodingService geocodingService) {
        this.restaurantRepository = restaurantRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.geocodingService = geocodingService;
    }

    @Transactional(readOnly = true)
    public Page<RestaurantCardDTO> getApprovedRestaurants(
            String searchName,
            List<String> cuisineTypes,
            Double minPrice,
            Double maxPrice,
            List<Integer> ratings,
            int page,
            int size,
            String sortDirection,
            String currentEmail) {
        String directionParam = (sortDirection != null && sortDirection.contains(","))
                ? sortDirection.split(",")[1]
                : sortDirection;
        Sort sort = Sort.by(
                "asc".equalsIgnoreCase(directionParam) ? Sort.Direction.ASC : Sort.Direction.DESC,
                "updatedAt"
        );
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Restaurant> spec = RestaurantSpecification.filterRestaurants(
                searchName, cuisineTypes, minPrice, maxPrice, ratings
        );

        Page<Restaurant> restaurantPage = restaurantRepository.findAll(spec, pageable);
        Set<String> favoriteIds = userRepository.findFavoriteRestaurantIdsByEmail(currentEmail);
        Set<String> visitedIds = userRepository.findVisitedRestaurantIdsByEmail(currentEmail);

        return restaurantPage.map(r -> RestaurantCardDTO.fromEntity(r, favoriteIds.contains(r.getId()), visitedIds.contains(r.getId())));
    }

    @Transactional(readOnly = true)
    public List<String> getAllCuisineTypes() {
        return restaurantRepository.findAllDistinctCuisineTypes();
    }

    @Transactional
    public RestaurantCardDTO createRestaurant(RestaurantDetailDTO dto) {
        Restaurant restaurant = new Restaurant(dto);
        restaurant.setApproved(false);
        applyGeocoding(restaurant);

        Restaurant saved = restaurantRepository.save(restaurant);
        log.info("Restaurant créé avec succès : {}", saved.getId());
        return RestaurantCardDTO.fromEntity(saved, false, true);
    }

    @Transactional
    public List<RestaurantCardDTO> createManyRestaurants(List<RestaurantDetailDTO> dtos) {
        List<Restaurant> restaurants = dtos.stream().map(dto -> {
            Restaurant r = new Restaurant(dto);
            r.setApproved(false);
            applyGeocoding(r);
            return r;
        }).toList();

        List<Restaurant> saved = restaurantRepository.saveAll(restaurants);
        log.info("Restaurants créés avec succès : {}", saved.stream().map(Restaurant::getId).toList());
        return saved.stream().map(r -> RestaurantCardDTO.fromEntity(r, false, true)).toList();
    }

    @Transactional
    public RestaurantCardDTO updateRestaurant(String id, RestaurantDetailDTO dto) {
        Restaurant existing = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant introuvable : " + id));
        existing.updateFromDto(dto);
        applyGeocoding(existing);
        Restaurant saved = restaurantRepository.save(existing);
        log.info("Restaurant mis à jour avec succès : {}", saved.getId());
        return RestaurantCardDTO.fromEntity(saved, false, true);
    }

    @Transactional(readOnly = true)
    public RestaurantDetailDTO getRestaurantDetail(String id, String currentEmail) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant introuvable"));

        List<Comment> comments = commentRepository.findByRestaurantId(id);

        long totalComments = comments.size();
        long goodComments = comments.stream().filter(c -> Boolean.TRUE.equals(c.getIsGood())).count();
        Double isGoodRatio = totalComments == 0 ? null : ((double) goodComments / totalComments) * 100.0;

        List<CommentDTO> commentDTOs = comments.stream()
                .map(CommentDTO::fromEntity)
                .toList();
        boolean isFavorite = false;
        boolean isVisited = false;
        if (currentEmail != null) {
            Optional<User> userOpt = userRepository.findByEmail(currentEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                isFavorite = user.getFavorites().stream().anyMatch(f -> f.getId().equals(id));
                isVisited = user.getVisitedRestaurants().stream().anyMatch(f -> f.getId().equals(id));
            }
        }
        return RestaurantDetailDTO.fromEntity(restaurant, commentDTOs, isGoodRatio, isFavorite, isVisited);
    }

    @Transactional
    public Restaurant.FavoriteToggleResponse toggleFavorite(String restaurantId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant introuvable"));

        boolean isFav = user.getFavorites().contains(restaurant);
        if (isFav) {
            user.getFavorites().remove(restaurant);
        } else {
            user.getFavorites().add(restaurant);
        }
        userRepository.save(user);
        int count = user.getFavorites().contains(restaurant)
                ? (restaurant.getFavoritesCount() != null ? restaurant.getFavoritesCount() + 1 : 1)
                : (restaurant.getFavoritesCount() != null ? Math.max(0, restaurant.getFavoritesCount() - 1) : 0);

        return new Restaurant.FavoriteToggleResponse(!isFav, count);
    }

    @Transactional
    public Restaurant.VisitedToggleResponse toggleVisited(String restaurantId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant introuvable"));

        boolean isVisited = user.getVisitedRestaurants().contains(restaurant);
        if (isVisited) {
            user.getVisitedRestaurants().remove(restaurant);
        } else {
            user.getVisitedRestaurants().add(restaurant);
        }
        userRepository.save(user);
        int count = user.getVisitedRestaurants().contains(restaurant)
                ? (restaurant.getVisitorsCount() != null ? restaurant.getVisitorsCount() + 1 : 1)
                : (restaurant.getVisitorsCount() != null ? Math.max(0, restaurant.getVisitorsCount() - 1) : 0);

        return new Restaurant.VisitedToggleResponse(!isVisited, count);
    }

    private void applyGeocoding(Restaurant restaurant) {
        if (restaurant.getLatitude() == null || restaurant.getLongitude() == null) {
            Double[] coords = geocodingService.geocodeAddress(restaurant.getAddress());
            if (coords != null) {
                restaurant.setLatitude(coords[0]);
                restaurant.setLongitude(coords[1]);
            }
        }
    }
}
