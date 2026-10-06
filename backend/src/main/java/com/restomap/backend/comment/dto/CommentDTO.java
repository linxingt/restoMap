package com.restomap.backend.comment.dto;

import com.restomap.backend.comment.entity.Comment;

import java.util.Date;

public record CommentDTO(
        String id,
        String authorName,
        Boolean isGood,
        String content,
        Double rating,
        Double pricePerPerson,
        Date createdAt
) {
    public static CommentDTO fromEntity(Comment c) {
        if (c == null) return null;
        return new CommentDTO(
                c.getId(),
                c.getUser() != null ? c.getUser().getUsername() : null,
                c.getIsGood(),
                c.getContent(),
                c.getRating(),
                c.getPricePerPerson(),
                c.getCreatedAt()
        );
    }
}
