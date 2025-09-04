import { MutationOptions, useMutation } from '@tanstack/react-query';
import { IManualFillRecieptRequest, IManualFillRecieptResponse, ITombolaScanReceiptRequest, ITombolaScanReceiptResponse } from './api';
import { useNavigate, useParams } from 'react-router-dom';
import TombolaApi from './api';

/**
 * Comprehensive hook for managing payment labels data, combining pagination, query parameters, and API calls
 * with direct URL synchronization
 *
 * @param {ServiceOptions} options - Configuration options
 * @returns {Object} Combined payments service with CRUD, pagination, and filtering capabilities
*/

export const useTombolaScanReceipt = (
    options?: MutationOptions<ITombolaScanReceiptResponse, Error, ITombolaScanReceiptRequest>
) => {
    const { onSuccess: customOnSuccess, ...restOptions } = options || {};
    const navigate = useNavigate();
    const { salespointUUID, identityUUID } = useParams();
    return useMutation<ITombolaScanReceiptResponse, Error, ITombolaScanReceiptRequest>({
        mutationFn: async (payload) => await TombolaApi.scanReceipt(payload),
        onSuccess: (data, variables, context) => {
            const { isOkay } = data;
            if (isOkay) {
                navigate(`/${salespointUUID}/identity-check/${identityUUID}/tombola-complete`);
            }
            // Then call taxe-provided onSuccess if available
            if (customOnSuccess) {
                customOnSuccess(data, variables, context);

            }
        },
        ...restOptions
    });
};


export const useManualFillReciept = (
    options?: MutationOptions<IManualFillRecieptResponse, Error, IManualFillRecieptRequest>
) => {
    const navigate = useNavigate();
    const { salespointUUID, identityUUID } = useParams();

    const { onSuccess: customOnSuccess, ...restOptions } = options || {};
    return useMutation<IManualFillRecieptResponse, Error, IManualFillRecieptRequest>({
        mutationFn: (payload) => TombolaApi.manualFillReciept(payload),
        onSuccess: (data, variables, context) => {
            const { is_created } = data;
            if (is_created) {
                navigate(`/${salespointUUID}/identity-check/${identityUUID}/tombola-complete`);
            }
            // Then call taxe-provided onSuccess if available
            if (customOnSuccess) {
                customOnSuccess(data, variables, context);
            }
        },
        ...restOptions
    });
};