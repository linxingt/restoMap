package com.restomap.backend.comment.entity;

import com.restomap.backend.restaurant.entity.Restaurant;
import com.restomap.backend.user.entity.User;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    private Boolean isGood;
    private String content;
    private Double rating;
    private Double pricePerPerson;
    private Date createdAt;

    public Comment() {}

    public Comment(User user, Restaurant restaurant, Boolean isGood, String content, Double rating, Double pricePerPerson) {
        this.user = user;
        this.restaurant = restaurant;
        this.isGood = isGood;
        this.content = content;
        this.rating = rating;
        this.pricePerPerson = pricePerPerson;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Restaurant getRestaurant() { return restaurant; }
    public void setRestaurant(Restaurant restaurant) { this.restaurant = restaurant; }
    public Boolean getIsGood() { return isGood; }
    public void setIsGood(Boolean isGood) { this.isGood = isGood; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Double getPricePerPerson() { return pricePerPerson; }
    public void setPricePerPerson(Double pricePerPerson) { this.pricePerPerson = pricePerPerson; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}