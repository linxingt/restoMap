package com.restomap.backend.comment.service;

import com.restomap.backend.common.exception.ResourceNotFoundException;
import com.restomap.backend.comment.dto.CommentDTO;
import com.restomap.backend.comment.entity.Comment;
import com.restomap.backend.restaurant.entity.Restaurant;
import com.restomap.backend.restaurant.repository.RestaurantRepository;
import com.restomap.backend.user.entity.User;
import com.restomap.backend.comment.repository.CommentRepository;
import com.restomap.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentService {

    private final RestaurantRepository restaurantRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommentService(RestaurantRepository restaurantRepository, CommentRepository commentRepository, UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByRestaurantId(String restaurantId) {
        return commentRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(CommentDTO::fromEntity)
                .toList();
    }

    @Transactional
    public CommentDTO addComment(String restaurantId, CommentDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant introuvable"));

        Comment comment = new Comment(
                user,
                restaurant,
                dto.isGood(),
                dto.content(),
                dto.rating(),
                dto.pricePerPerson()
        );
        Comment saved = commentRepository.save(comment);
        return CommentDTO.fromEntity(saved);
    }
}
