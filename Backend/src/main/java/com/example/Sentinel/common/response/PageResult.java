package com.example.Sentinel.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean isFirst;
    private boolean isLast;

    public static <T> PageResult<T> from(Page<T> page) {
        return PageResult.<T>builder()
                         .content(page.getContent())
                         .page(page.getNumber())
                         .size(page.getSize())
                         .totalElements(page.getTotalElements())
                         .totalPages(page.getTotalPages())
                         .isFirst(page.isFirst())
                         .isLast(page.isLast())
                         .build();
    }

}
