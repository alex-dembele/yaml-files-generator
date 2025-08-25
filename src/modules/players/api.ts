import { API_CONFIG, apiClient, ReadResponse } from "@/api";
import env from "@/env";


const api_urls = {
    get_check_identity_url: () => API_CONFIG.buildUrl(`/players/verify-identity`),


};
// ====================================================

export type IPlayerCheckIdentityRequestDto = {
    phone_number: string;
}
export type IPlayerCheckIdentityResponseDto = {
    id: number;
    is_new_user: boolean,
    uuid: string,
    username?: string;
    phone_number: string;
    quartier?: string,
    created_at?: string;
    updated_at?: string;
}

export type IPlayerCheckIdentityResponse = {
    id: number;
    is_new_user: boolean,
    uuid: string,
    username?: string;
    phone_number: string;
    quartier?: string,
    created_at?: string;
    updated_at?: string;
}

export type IPlayerCheckIdentityRequest = {
    phone_number: string;
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
    checkIdentity: async (payload: IPlayerCheckIdentityRequest): Promise<IPlayerCheckIdentityResponse> => {
        if (env.APP_USE_MOCK_API) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            let res;
            if (payload.phone_number === "653618276") {
                res = await Promise.resolve({
                    data: { status: "OK", data: { id: 1, is_new_user: false, uuid: "c030673-5d9a-11f0-8012-0acc3673109d", phone_number: "653618276", username: "Duclair Deugoue", quartier: "Douala Cameroon" }, message: "Player data exist " }
                })
            } else {
                res = await Promise.resolve({ data: { status: "OK", data: { is_new_user: true, uuid: "030673-5d9a-11f0-8012-0acc36731094", phone_number: payload.phone_number, quartier: '' }, message: "Player data was created" } })
            }

            const res_body = res.data as ReadResponse<IPlayerCheckIdentityResponseDto>;
            if (res_body.data) {
                const res_data: IPlayerCheckIdentityResponse = {
                    id: res_body.data.id,
                    is_new_user: res_body.data.is_new_user ?? false,
                    uuid: res_body.data.uuid ?? '',
                    username: res_body.data.username ?? '',
                    phone_number: res_body.data?.phone_number ?? '',
                    quartier: res_body.data.quartier,
                    created_at: res_body.data.created_at,
                    updated_at: res_body.data.created_at
                }
                return res_data;
            }
            throw new Error("Somthing when wrong: ");

        }
        try {
            const res = await apiClient({
                method: 'POST',
                endpoint: api_urls.get_check_identity_url(),
                body: payload
            });
            const res_body = res.data as ReadResponse<IPlayerCheckIdentityResponseDto>
            const res_data: IPlayerCheckIdentityResponse = {
                id: res_body.data.id,
                is_new_user: res_body.data.is_new_user,
                uuid: res_body.data.uuid,
                username: res_body.data.username,
                phone_number: res_body.data.phone_number,
                quartier: res_body.data.quartier,
                created_at: res_body.data.created_at,
                updated_at: res_body.data.created_at
            }
            return res_data;
        } catch (error) {
            throw new Error(`Something went wrong:  ${error}`);
        }
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