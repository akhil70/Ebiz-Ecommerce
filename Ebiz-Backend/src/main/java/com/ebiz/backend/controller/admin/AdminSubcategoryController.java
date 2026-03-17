package com.ebiz.backend.controller.admin;

import com.ebiz.backend.controller.base.BaseController;
import com.ebiz.backend.entity.Subcategory;
import com.ebiz.backend.service.BaseService;
import com.ebiz.backend.service.SubcategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/subcategories")
@RequiredArgsConstructor
public class AdminSubcategoryController extends BaseController<Subcategory, String> {

    private final SubcategoryService subcategoryService;

    @Override
    protected BaseService<Subcategory, String> getService() {
        return subcategoryService;
    }
}
