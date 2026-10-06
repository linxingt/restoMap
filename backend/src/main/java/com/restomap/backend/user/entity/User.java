package com.restomap.backend.user.entity;

import com.restomap.backend.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // 'USER' | 'ADMIN' | 'VISITOR'
    private String role;

    private Date createdAt;

    @ManyToMany
    @JoinTable(
            name = "user_favorites_restaurants",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "restaurant_id")
    )
    private Set<Restaurant> favorites = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_visited_restaurants",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "restaurant_id")
    )
    private Set<Restaurant> visitedRestaurants = new HashSet<>();

    public User() {}

    public User(String id, String username, String email, String password, String role, Date createdAt, Set<Restaurant> favorites, Set<Restaurant> visitedRestaurants) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
        if (favorites != null) this.favorites = favorites;
        if (visitedRestaurants != null) this.visitedRestaurants = visitedRestaurants;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public Set<Restaurant> getFavorites() { return favorites; }
    public void setFavorites(Set<Restaurant> favorites) { this.favorites = favorites; }
    public Set<Restaurant> getVisitedRestaurants() { return visitedRestaurants; }
    public void setVisitedRestaurants(Set<Restaurant> visitedRestaurants) { this.visitedRestaurants = visitedRestaurants; }
}
