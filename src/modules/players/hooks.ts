import { useMutation } from '@tanstack/react-query';
import PlayersApi, { IPlayerCheckIdentityRequest, IPlayerCheckIdentityResponse, IPlayerUpdateInfosRequest, IPlayerUpdateInfosResponse } from './api';

/**
 * Comprehensive hook for managing payment labels data, combining pagination, query parameters, and API calls
 * with direct URL synchronization
 *
 * @param {ServiceOptions} options - Configuration options
 * @returns {Object} Combined payments service with CRUD, pagination, and filtering capabilities
*/

// TODO Change this implementation to use mutatation hooks
const useCheckPlayerIdentiy = (options: any) => {
    const { onSuccess: customOnSuccess, ...restOptions } = options;
    return useMutation<IPlayerCheckIdentityResponse, Error, IPlayerCheckIdentityRequest>({
        mutationFn: (payload) => PlayersApi.checkIdentity(payload),
        onSuccess: (data, variables, context) => {
            // Then call taxe-provided onSuccess if available
            if (customOnSuccess) {
                customOnSuccess(data, variables, context);
            }
        },
        ...restOptions
    });
};

const usePlayerUpdateInfos = (options: any) => {
    const { onSuccess: customOnSuccess, ...restOptions } = options;
    return useMutation<IPlayerUpdateInfosResponse, Error, IPlayerUpdateInfosRequest>({
        mutationFn: (payload) => PlayersApi.updateInfos(payload),
        onSuccess: (data, variables, context) => {
            // Then call taxe-provided onSuccess if available
            if (customOnSuccess) {
                customOnSuccess(data, variables, context);
            }
        },
        ...restOptions
    });
};



export default {
    useCheckPlayerIdentiy,
    usePlayerUpdateInfos
}