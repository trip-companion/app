package com.trip.companion.rest.controller;

import com.trip.companion.domain.base.BaseEntity;
import java.util.List;
import java.util.Optional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import static java.util.stream.Collectors.toList;

public abstract class MappingController {

    protected ModelMapper modelMapper;

    @Autowired
    public void setBaseMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public <I, E extends BaseEntity> E mapRequestDtoToEntity(I requestDto, Class<E> entityClass) {
        return Optional.ofNullable(requestDto).map(dto -> modelMapper.map(dto, entityClass)).orElse(null);
    }

    public <O, E extends BaseEntity> O mapEntityToResponseDto(E entity, Class<O> responseClass) {
        return Optional.ofNullable(entity).map(e -> modelMapper.map(e, responseClass)).orElse(null);
    }

    public <O, E extends BaseEntity> List<O> mapEntityList(List<E> entityList, Class<O> responseClass) {
        return entityList.stream().map(e -> mapEntityToResponseDto(e, responseClass)).collect(toList());
    }

    public <O, E extends BaseEntity> Page<O> mapEntityPage(Page<E> entityPage, Class<O> responseClass) {
        return entityPage.map(e -> mapEntityToResponseDto(e, responseClass));
    }

}
