package com.restomap.backend.comment.controller;

import com.restomap.backend.comment.dto.CommentDTO;
import com.restomap.backend.comment.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments/restaurants/{restaurantId}")
class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable String restaurantId) {
        return ResponseEntity.ok(commentService.getCommentsByRestaurantId(restaurantId));
    }

    @PostMapping
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable String restaurantId,
            @RequestBody CommentDTO dto,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        CommentDTO created = commentService.addComment(restaurantId, dto, authentication.getName());
        return ResponseEntity.ok(created);
    }

}
