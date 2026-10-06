package com.restomap.backend.restaurant.entity;

import com.restomap.backend.restaurant.dto.RestaurantDetailDTO;
import jakarta.persistence.*;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "restaurants")
public class Restaurant {
    public record FavoriteToggleResponse(boolean isFavorite, int favoritesCount) {}
    public record VisitedToggleResponse(boolean isVisited, int visitorsCount) {}

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private Double latitude;
    private Double longitude;
    private String address;

    @ElementCollection
    @CollectionTable(name = "restaurant_photos", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "photo_url")
    private Set<String> photos = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "restaurant_cuisine_types", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "cuisine_type")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Set<String> cuisineTypes = new HashSet<>();

    @Formula("(SELECT AVG(c.price_per_person) FROM comments c WHERE c.restaurant_id = id)")
    private Double pricePerPersonAvg;

    @Formula("(SELECT AVG(c.rating) FROM comments c WHERE c.restaurant_id = id)")
    private Double ratingAvg;

    private Boolean approved;
    private Date updatedAt;

    @Formula("(SELECT COUNT(*) FROM user_favorites_restaurants ufr WHERE ufr.restaurant_id = id)")
    private Integer favoritesCount;

    @Formula("(SELECT COUNT(*) FROM user_visited_restaurants uvr WHERE uvr.restaurant_id = id)")
    private Integer visitorsCount;

    @Formula("(SELECT MAX(c.created_at) FROM comments c WHERE c.restaurant_id = id)")
    private Date lastCommentAt;

    public Restaurant() {}

    public Restaurant(RestaurantDetailDTO dto) {
        this.updateFromDto(dto);
    }

    public void updateFromDto(RestaurantDetailDTO dto) {
        this.name = dto.name();
        this.address = dto.address();

        if (dto.latitudeEtlongitude() != null && dto.latitudeEtlongitude().length == 2) {
            this.latitude = dto.latitudeEtlongitude()[0];
            this.longitude = dto.latitudeEtlongitude()[1];
        }
        if (dto.cuisineTypes() != null) {
            this.cuisineTypes.clear();
            this.cuisineTypes.addAll(dto.cuisineTypes());
        }
        if (dto.photos() != null) {
            this.photos.clear();
            this.photos.addAll(dto.photos());
        }
    }

    @PrePersist
    protected void onCreate() {
        this.updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Set<String> getPhotos() { return photos; }
    public void setPhotos(Set<String> photos) { this.photos = photos; }
    public Set<String> getCuisineTypes() { return cuisineTypes; }
    public void setCuisineTypes(Set<String> cuisineTypes) { this.cuisineTypes = cuisineTypes; }
    public Double getPricePerPersonAvg() { return pricePerPersonAvg; }
    public void setPricePerPersonAvg(Double pricePerPersonAvg) { this.pricePerPersonAvg = pricePerPersonAvg; }
    public Double getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }
    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
    public Integer getFavoritesCount() { return favoritesCount; }
    public void setFavoritesCount(Integer favoritesCount) { this.favoritesCount = favoritesCount; }
    public Integer getVisitorsCount() { return visitorsCount; }
    public void setVisitorsCount(Integer visitorsCount) { this.visitorsCount = visitorsCount; }
    public Date getLastCommentAt() { return lastCommentAt; }
    public void setLastCommentAt(Date lastCommentAt) { this.lastCommentAt = lastCommentAt; }
}