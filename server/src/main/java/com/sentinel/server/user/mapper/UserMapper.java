package com.sentinel.server.user.mapper;

import com.sentinel.server.common.dto.response.UserBriefResponse;
import com.sentinel.server.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserBriefResponse toBrief(User user) {
        return new UserBriefResponse(user.getId().toString(), user.getDisplayName(), user.getEmail());
    }
}
