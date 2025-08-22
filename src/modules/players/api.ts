import { API_CONFIG, apiClient } from "@/api";


const api_urls = {
    get_check_identity_url: () => API_CONFIG.buildUrl(`/players/verify-identity`),


};
// ====================================================

export type IPlayerCheckIdentityRequestDto = {
    phone_number: string;
}
export type IPlayerCheckIdentityResponseDto = {
    id: number;
    uuid: string,
    first_name: string;
    last_name: string;
    phone_number: string;
    date_of_birth: string;
    created_at: string;
    updated_at: string;
}

export type IPlayerCheckIdentityResponse = {
    id: number;
    uuid: string,
    first_name: string;
    last_name: string;
    phone_number: string;
    date_of_birth: string;
    created_at: string;
    updated_at: string;
}

export type IPlayerCheckIdentityRequest = {
    id: number;
    uuid: string,
    first_name: string;
    last_name: string;
    phone_number: string;
    date_of_birth: string;
    created_at: string;
    updated_at: string;
}
// ====================================================

export type IPlayerUpdateInfosRequestDto = {
    name: string;
    quater: string
}
export type IPlayerUpdateInfosRequest = {
    name: string;
    quater: string
}

export type IPlayerUpdateInfosResponseDto = any
export type IPlayerUpdateInfosResponse = any

// ====================================================


const PlayersApi = {
    checkIdentity: async (payload: IPlayerCheckIdentityRequest) => {
        const res = await apiClient({
            method: 'POST',
            endpoint: api_urls.get_check_identity_url(),
            body: payload
        })
        return res.data;
    },
    updateInfos: async (payload: IPlayerUpdateInfosRequest) => {
        const res = await apiClient({
            method: 'POST',
            endpoint: api_urls.get_check_identity_url(),
            body: payload
        })
        return res.data;
    },

}

export default PlayersApi;