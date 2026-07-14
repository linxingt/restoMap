package com.restomap.backend.dto;

import com.restomap.backend.entity.Comment;

import java.util.Date;

public class CommentDTO {
    private Integer id;
    private Integer userId;
    private Integer restoId;
    private Boolean isGood;
    private String content;
    private Double rating;
    private Double pricePerPerson;
    private Date createdAt;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.userId = comment.getUser() != null ? comment.getUser().getId() : -1;
        this.restoId = comment.getRestaurant() != null ? comment.getRestaurant().getId() : -1;
        this.isGood = comment.getIsGood();
        this.content = comment.getContent();
        this.rating = comment.getRating();
        this.pricePerPerson = comment.getPricePerPerson();
        this.createdAt = comment.getCreatedAt();
    }
}
