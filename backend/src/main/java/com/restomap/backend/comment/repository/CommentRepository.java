package com.restomap.backend.comment.repository;

import com.restomap.backend.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByRestaurantId(String restaurantId);
}
