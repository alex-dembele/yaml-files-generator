import { MutationOptions, useMutation } from '@tanstack/react-query';
import PlayersApi, { IPlayerCheckIdentityRequest, IPlayerCheckIdentityResponse, IPlayerUpdateInfosRequest, IPlayerUpdateInfosResponse } from './api';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Comprehensive hook for managing payment labels data, combining pagination, query parameters, and API calls
 * with direct URL synchronization
 *
 * @param {ServiceOptions} options - Configuration options
 * @returns {Object} Combined payments service with CRUD, pagination, and filtering capabilities
*/

// TODO Change this implementation to use mutatation hooks
const useCheckPlayerIdentity = (
    options?: MutationOptions<IPlayerCheckIdentityResponse, Error, IPlayerCheckIdentityRequest>
) => {
    const { onSuccess: customOnSuccess, ...restOptions } = options || {};
    const navigate = useNavigate();
    const { salespointUUID } = useParams();
    return useMutation<IPlayerCheckIdentityResponse, Error, IPlayerCheckIdentityRequest>({
        mutationFn: async (payload) => await PlayersApi.checkIdentity(payload),
        onSuccess: (data, variables, context) => {
            const { is_new_user, uuid } = data;
            if (is_new_user) {
                navigate(`/${salespointUUID}/identity-check/${uuid}/update-info`);
            } else {
                navigate(`/${salespointUUID}/identity-check/${uuid}/scan-receipt `);
            }
            // Then call taxe-provided onSuccess if available
            if (customOnSuccess) {
                customOnSuccess(data, variables, context);

            }
        },
        ...restOptions
    });
};

const usePlayerUpdateInfos = (
    options?: MutationOptions<IPlayerUpdateInfosResponse, Error, IPlayerUpdateInfosRequest>
) => {
    const navigate = useNavigate();
    const { salespointUUID } = useParams();

    const { onSuccess: customOnSuccess, ...restOptions } = options || {};
    return useMutation<IPlayerUpdateInfosResponse, Error, IPlayerUpdateInfosRequest>({
        mutationFn: (payload) => PlayersApi.updateInfos(payload),
        onSuccess: (data, variables, context) => {
            const { is_created } = data;
            if (is_created) {
                navigate(`/${salespointUUID}/identity-check/${variables.clientId}/scan-receipt `);
            }
            // Then call taxe-provided onSuccess if available
            if (customOnSuccess) {
                customOnSuccess(data, variables, context);
            }
        },
        ...restOptions
    });
};



export {
    useCheckPlayerIdentity,
    usePlayerUpdateInfos
}