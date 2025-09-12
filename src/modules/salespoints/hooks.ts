// import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
// import { PaginationState, QueryOptions, QueryParams, QueryParamValue, ServiceOptions } from '@/types';
import SalesPointsApi from './api';

/**
 * Comprehensive hook for managing payment labels data, combining pagination, query parameters, and API calls
 * with direct URL synchronization
 *
 * @param {ServiceOptions} options - Configuration options
 * @returns {Object} Combined payments service with CRUD, pagination, and filtering capabilities
*/

export const useSalespointVerifyIdentity = (uuid?: string) => {
    return useQuery({
        queryKey: ['salespoint-verify-identity', uuid],
        queryFn: async () => {
            const res_data = await SalesPointsApi.verifyIdentity(uuid);
            return res_data;
        },
        enabled: !!uuid // Only run if uuid is provided
    });
};

export const useSalesPointList = () => {
    return useQuery({
        queryKey: ['salespoint-list'],
        queryFn: async () => {
            const res_data = await SalesPointsApi.list();
            return res_data;
        },
    });
};

export default {
    useSalespointVerifyIdentity,
    useSalesPointList
}