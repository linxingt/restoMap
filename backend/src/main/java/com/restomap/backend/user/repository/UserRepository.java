package com.restomap.backend.user.repository;

import com.restomap.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, String>{
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT r.id FROM User u JOIN u.favorites r WHERE u.email = :email")
    Set<String> findFavoriteRestaurantIdsByEmail(@Param("email") String email);

    @Query("SELECT r.id FROM User u JOIN u.visitedRestaurants r WHERE u.email = :email")
    Set<String> findVisitedRestaurantIdsByEmail(@Param("email") String email);

}

