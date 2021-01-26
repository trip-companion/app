package com.trip.companion.domain.base;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BaseEntity extends Auditable {

    private String id;

}
