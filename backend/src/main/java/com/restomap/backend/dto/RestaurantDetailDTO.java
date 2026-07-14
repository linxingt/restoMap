package com.restomap.backend.dto;

import com.restomap.backend.entity.Restaurant;

import java.util.List;
import java.util.Set;

public class RestaurantDetailDTO {
    private Integer id;
    private String name;
    private Double[] latitudeEtlongitude;
    private String address;
    private Set<String> photos;
    private String link;
    private Set<String> cuisineTypes;
    private Double pricePerPersonAvg;
    private Double ratingAvg;

    private Integer visitorsCount;
    private Double isGoodRatio;
    private List<CommentDTO> comments;


    public RestaurantDetailDTO(Restaurant restaurant, List<CommentDTO> comments, Double isGoodRatio) {
        this.id = restaurant.getId();
        this.name = restaurant.getName();
        if (restaurant.getLatitude() != null && restaurant.getLongitude() != null) {
            this.latitudeEtlongitude = new Double[]{restaurant.getLatitude(), restaurant.getLongitude()};
        }
        this.address = restaurant.getAddress();
        this.photos = restaurant.getPhotos();
        this.link = restaurant.getLink();
        this.cuisineTypes = restaurant.getCuisineTypes();
        this.pricePerPersonAvg = restaurant.getPricePerPersonAvg();
        this.ratingAvg = restaurant.getRatingAvg();

        this.visitorsCount = restaurant.getVisitors() != null ? restaurant.getVisitors().size() : 0;
        this.comments = comments;
        this.isGoodRatio = isGoodRatio;
    }
}
