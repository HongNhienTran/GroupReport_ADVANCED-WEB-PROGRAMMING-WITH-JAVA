package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.request.TrackingEventRequest;

public interface TrackingService {
    void trackEvent(Long accountId, TrackingEventRequest request);
}
