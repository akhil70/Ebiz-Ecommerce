package com.ebiz.backend.service;

import com.ebiz.backend.entity.BaseEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public abstract class BaseService<T extends BaseEntity, ID> {

    protected abstract MongoRepository<T, ID> getRepository();

    public T save(T entity) {
        if (entity.getId() == null) {
            entity.setCreatedAt(LocalDateTime.now());
            entity.setStatus(1); // Default to active
        }
        entity.setUpdatedAt(LocalDateTime.now());
        return getRepository().save(entity);
    }

    public List<T> findAllActive() {
        return getRepository().findAll().stream()
                .filter(entity -> entity.getStatus() == 1)
                .toList();
    }

    public List<T> findAll() {
        return getRepository().findAll();
    }

    public Optional<T> findById(ID id) {
        return getRepository().findById(id);
    }

    public void softDelete(ID id) {
        Optional<T> optionalEntity = getRepository().findById(id);
        if (optionalEntity.isPresent()) {
            T entity = optionalEntity.get();
            entity.setStatus(0);
            entity.setUpdatedAt(LocalDateTime.now());
            getRepository().save(entity);
        }
    }

    public void hardDelete(ID id) {
        getRepository().deleteById(id);
    }
}
