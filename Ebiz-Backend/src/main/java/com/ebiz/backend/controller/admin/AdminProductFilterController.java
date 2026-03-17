package com.ebiz.backend.controller.admin;

import com.ebiz.backend.controller.base.BaseController;
import com.ebiz.backend.entity.ProductFilter;
import com.ebiz.backend.service.BaseService;
import com.ebiz.backend.service.ProductFilterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/filters")
@RequiredArgsConstructor
public class AdminProductFilterController extends BaseController<ProductFilter, String> {

    private final ProductFilterService productFilterService;

    @Override
    protected BaseService<ProductFilter, String> getService() {
        return productFilterService;
    }
}
