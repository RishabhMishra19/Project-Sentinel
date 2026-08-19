package com.sentinel.common.cassandra;

import com.sentinel.common.cassandra.dto.CursorPaginationDirection;
import com.sentinel.common.cassandra.dto.CursorPaginationRequest;
import com.sentinel.common.cassandra.dto.CursorPaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class CassandraPaginator<T, R extends CursorPaginationRequest, P> {

    private CassandraService<T, R, P> cassandraService;
    private CursorEncoder<T, P> cassandraEncoder;

    public CursorPaginationResponse<T> getPage(R request){
        if(request.getCursor()==null){
            request.setPageSize(request.getPageSize()+1);
            List<T> result = cassandraService.getFirstPage(request);
            request.setPageSize(request.getPageSize()-1);
            boolean hasPrevPage = false;
            boolean hasNextPage = result.size() > request.getPageSize();
            if(result.size()>request.getPageSize()){
                result = result.subList(0, request.getPageSize());
            }
            String startCursor = !result.isEmpty() ? cassandraEncoder.encode(result.getFirst()) : null;
            String endCursor = !result.isEmpty() ? cassandraEncoder.encode(result.getLast()) : null;
            return new CursorPaginationResponse<>(
                    result,
                    startCursor,
                    endCursor,
                    hasNextPage,
                    hasPrevPage
            );
        } else if(CursorPaginationDirection.BACKWARD.equals(request.getDirection())){
            request.setPageSize(request.getPageSize()+1);
            List<T> result = cassandraService.getPrevPage(request, cassandraEncoder.decode(request.getCursor()));
            request.setPageSize(request.getPageSize()-1);
            boolean hasNextPage = true;
            boolean hasPrevPage = result.size() > request.getPageSize();
            result = result.reversed();
            if(result.size()>request.getPageSize()){
                result = result.subList(1, result.size());
            }
            String startCursor = !result.isEmpty() ? cassandraEncoder.encode(result.getFirst()) : null;
            String endCursor = !result.isEmpty() ? cassandraEncoder.encode(result.getLast()) : null;
            return new CursorPaginationResponse<>(
                    result,
                    startCursor,
                    endCursor,
                    hasNextPage,
                    hasPrevPage
            );
        } else {
            request.setPageSize(request.getPageSize()+1);
            List<T> result = cassandraService.getNextPage(request, cassandraEncoder.decode(request.getCursor()));
            request.setPageSize(request.getPageSize()-1);
            boolean hasPrevPage = true;
            boolean hasNextPage = result.size() > request.getPageSize();
            if(result.size()>request.getPageSize()){
                result = result.subList(0, request.getPageSize());
            }
            String startCursor = !result.isEmpty() ? cassandraEncoder.encode(result.getFirst()) : null;
            String endCursor = !result.isEmpty() ? cassandraEncoder.encode(result.getLast()) : null;
            return new CursorPaginationResponse<>(
                    result,
                    startCursor,
                    endCursor,
                    hasNextPage,
                    hasPrevPage
            );
        }
    }



}
