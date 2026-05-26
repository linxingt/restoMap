package com.restomap.backend.dto;

import com.restomap.backend.entity.Restaurant;
import com.restomap.backend.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor

public class RestaurantDTO {
    private Integer id;
    private String name;
    private Double[] latitudeEtlongitude;
    private String address;
    private Set<String> photos = new HashSet<>();
    private String link;
    private Set<String> cuisineTypes = new HashSet<>();
    private Double pricePerPersonAvg;
    private Double ratingAvg;
    private Boolean approved;
    private Date updatedAt;

    // Un constructeur ou un mapper pour transformer l'Entity en DTO
    public RestaurantDTO(Restaurant resto) {
        this.id = resto.getId();
        this.name = resto.getName();
        this.address = resto.getAddress();
        this.photos = resto.getPhotos();
        this.link = resto.getLink();
        this.cuisineTypes = resto.getCuisineTypes();
        this.pricePerPersonAvg = resto.getPricePerPersonAvg();
        this.ratingAvg = resto.getRatingAvg();
        this.approved = resto.getApproved();
        this.updatedAt = resto.getUpdatedAt();

        if (resto.getLatitude() != null && resto.getLongitude() != null) {
            this.latitudeEtlongitude = new Double[]{resto.getLatitude(), resto.getLongitude()};
        }
    }
}
