package com.restomap.backend.restaurant.dto;

import com.restomap.backend.restaurant.entity.Restaurant;

import java.util.*;

public record RestaurantCardDTO(
        String id,
        String name,
        Double[] latitudeEtlongitude,
        String address,
        Set<String> photos,
        Set<String> cuisineTypes,
        Double pricePerPersonAvg,
        Double ratingAvg,
        Date updatedAt,
        Integer visitorsCount,
        boolean isFavorite,
        boolean isVisited
) {
    public static RestaurantCardDTO fromEntity(Restaurant r, boolean isFavorite, boolean isVisited) {
        Double[] coords = (r.getLatitude() != null && r.getLongitude() != null)
                ? new Double[]{r.getLatitude(), r.getLongitude()} : null;
        int visitors = r.getVisitorsCount() != null ? r.getVisitorsCount() : 0;

        return new RestaurantCardDTO(
                r.getId(),
                r.getName(),
                coords,
                r.getAddress(),
                (r.getPhotos() != null && !r.getPhotos().isEmpty())
                        ? Set.of(r.getPhotos().iterator().next())
                        : Set.of(),
                r.getCuisineTypes() != null ? r.getCuisineTypes() : Set.of(),
                r.getPricePerPersonAvg(),
                r.getRatingAvg(),
                (r.getLastCommentAt() == null || r.getUpdatedAt().after(r.getLastCommentAt()))?
                        r.getUpdatedAt():r.getLastCommentAt(),
                visitors,
                isFavorite,
                isVisited
        );
    }

}
