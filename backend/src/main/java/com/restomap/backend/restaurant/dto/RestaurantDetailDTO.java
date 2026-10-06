package com.restomap.backend.restaurant.dto;

import com.restomap.backend.comment.dto.CommentDTO;
import com.restomap.backend.restaurant.entity.Restaurant;

import java.util.Date;
import java.util.List;
import java.util.Set;

public record RestaurantDetailDTO(
        String id,
        String name,
        Double[] latitudeEtlongitude,
        String address,
        Set<String> photos,
        Set<String> cuisineTypes,
        Double pricePerPersonAvg,
        Double ratingAvg,
        Boolean approved,
        Date updatedAt,
        Date lastCommentAt,
        Integer visitorsCount,
        Integer favoritesCount,
        Double isGoodRatio,
        List<CommentDTO> comments,
        boolean isFavorite,
        boolean isVisited
) {
    public static RestaurantDetailDTO fromEntity(Restaurant r, List<CommentDTO> comments, Double isGoodRatio, boolean isFavorite, boolean isVisited) {
        Double[] coords = (r.getLatitude() != null && r.getLongitude() != null)
                ? new Double[]{r.getLatitude(), r.getLongitude()} : null;
        int visitors = r.getVisitorsCount() != null ? r.getVisitorsCount() : 0;
        int favorites = r.getFavoritesCount() != null ? r.getFavoritesCount() : 0;

        return new RestaurantDetailDTO(
                r.getId(),
                r.getName(),
                coords,
                r.getAddress(),
                (r.getPhotos() != null && !r.getPhotos().isEmpty())
                        ? r.getPhotos()
                        : Set.of(),
                r.getCuisineTypes() != null ? r.getCuisineTypes() : Set.of(),
                r.getPricePerPersonAvg(),
                r.getRatingAvg(),
                r.getApproved(),
                r.getUpdatedAt(),
                r.getLastCommentAt(),
                visitors,
                favorites,
                isGoodRatio,
                comments != null ? comments : List.of(),
                isFavorite,
                isVisited
        );
    }
}
