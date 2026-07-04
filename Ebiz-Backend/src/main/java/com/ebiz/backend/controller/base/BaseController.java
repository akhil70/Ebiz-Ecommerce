package com.ebiz.backend.controller.base;

import com.ebiz.backend.entity.BaseEntity;
import com.ebiz.backend.service.BaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

public abstract class BaseController<T extends BaseEntity, ID> {

    protected abstract BaseService<T, ID> getService();

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<T> create(@RequestBody T entity) {
        return ResponseEntity.ok(getService().save(entity));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<T> update(@PathVariable ID id, @RequestBody T entity) {
        entity.setId(id.toString()); // Force the ID from path
        return ResponseEntity.ok(getService().save(entity));
    }

    @GetMapping
    public ResponseEntity<List<T>> getAllActive() {
        return ResponseEntity.ok(getService().findAllActive());
    }

    @GetMapping("/all")
    public ResponseEntity<List<T>> getAll() {
        return ResponseEntity.ok(getService().findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> getById(@PathVariable ID id) {
        Optional<T> entity = getService().findById(id);
        return entity.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/soft")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> softDelete(@PathVariable ID id) {
        getService().softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/hard")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> hardDelete(@PathVariable ID id) {
        getService().hardDelete(id);
        return ResponseEntity.noContent().build();
    }
}
