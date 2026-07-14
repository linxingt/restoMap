package com.restomap.backend.entity;

import com.restomap.backend.dto.RestaurantDTO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.*;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Double latitude;
    private Double longitude;
    private String address;
    private Set<String> photos = new HashSet<>();
    private String link;
    @ElementCollection
    @CollectionTable(name = "restaurant_cuisine_types", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "cuisine_type")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Set<String> cuisineTypes = new HashSet<>();
    @ManyToMany
    @JoinTable(
            name = "restaurant_visitors",
            joinColumns = @JoinColumn(name = "restaurant_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> visitors = new HashSet<>();
    @Formula("(SELECT AVG(c.price_per_person) FROM comments c WHERE c.restaurant_id = id)")
    private Double pricePerPersonAvg;
    @Formula("(SELECT AVG(c.rating) FROM comments c WHERE c.restaurant_id = id)")
    private Double ratingAvg;
    private Boolean approved;
    private Date updatedAt;

    public Restaurant(RestaurantDTO dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.address = dto.getAddress();
        this.photos = dto.getPhotos();
        this.link = dto.getLink();
        this.cuisineTypes = dto.getCuisineTypes();
        this.approved = false;

        if (dto.getLatitudeEtlongitude() != null && dto.getLatitudeEtlongitude().length == 2) {
            this.latitude = dto.getLatitudeEtlongitude()[0];
            this.longitude = dto.getLatitudeEtlongitude()[1];
        }
    }

    public void updateBasicContent(Restaurant other) {
        this.name = other.getName();
        this.latitude = other.getLatitude();
        this.longitude = other.getLongitude();
        this.address = other.getAddress();
        this.link = other.getLink();
        this.cuisineTypes.clear();
        if (other.cuisineTypes != null) this.cuisineTypes.addAll(other.cuisineTypes);
    }

    @PrePersist // Avant la première insertion en BD
    protected void onCreate() {
        this.updatedAt = new Date();
    }

    @PreUpdate // À chaque modification du restaurant
    protected void onUpdate() {
        this.updatedAt = new Date();
    }
}
