package com.restomap.backend.repository;

import com.restomap.backend.entity.Comment;
import com.restomap.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByRestaurantId(Integer restaurantId);
}
