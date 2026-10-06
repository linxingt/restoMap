package com.restomap.backend.restaurant.specification;

import com.restomap.backend.restaurant.entity.Restaurant;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class RestaurantSpecification {
    public static Specification<Restaurant> filterRestaurants(
            String name,
            List<String> cuisineTypes,
            Double minPrice,
            Double maxPrice,
            List<Integer> ratings
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("approved"), true));

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (cuisineTypes != null && !cuisineTypes.isEmpty()) {
                Join<Restaurant, String> cuisinesJoin = root.join("cuisineTypes", JoinType.INNER);
                predicates.add(cuisinesJoin.in(cuisineTypes));
            }

            if (minPrice != null && minPrice > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("pricePerPersonAvg"), minPrice));
            }
            if (maxPrice != null && maxPrice < 999){
                predicates.add(cb.lessThanOrEqualTo(root.get("pricePerPersonAvg"), maxPrice));
            }

            if (ratings != null && !ratings.isEmpty()) {
                Expression<Integer> floorRating = cb.function("FLOOR", Integer.class, root.get("ratingAvg"));
                predicates.add(floorRating.in(ratings));
            }

            if (query != null) {
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
