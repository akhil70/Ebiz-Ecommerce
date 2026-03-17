package com.ebiz.backend.dto;

import com.ebiz.backend.entity.Subcategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryWithSubcategoriesDto {

    private String id;
    private String name;
    private String slug;
    private String parentId;
    private String image;
    private String description;
    private Integer displayOrder;
    private Integer status;

    private List<Subcategory> subcategory; // Renamed to subcategory to match user request

}
