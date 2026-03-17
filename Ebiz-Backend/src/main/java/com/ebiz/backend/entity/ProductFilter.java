package com.ebiz.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "product_filters")
public class ProductFilter extends BaseEntity {

    private String filterName;
    private List<String> filterOptions;

    // We can use the inherited 'status' field for Active Status mapping
    // where status = 1 is Active, status = 0 is Inactive.
}
