import { API_CONFIG, apiClient, CreateResponse, ReadResponse } from "@/api";
import env from "@/env";


const api_urls = {
    get_check_identity_url: (phone: string) => API_CONFIG.buildUrl(`/client/${phone}`),
    get_store_url: () => API_CONFIG.buildUrl(`/client-infos-store`),

};
// ====================================================

export type IPlayerCheckIdentityRequestDto = {
    phone_number: string;
}
export type IPlayerCheckIdentityResponseDto = {
    id: number;
    uuid: string,
    name?: string | null;
    phone_number: string;
    address?: string | null,
    created_at?: string;
    updated_at?: string;
}

export type IPlayerCheckIdentityResponse = {
    id: number;
    is_new_user: boolean,
    uuid: string,
    username?: string;
    phone_number: string;
    address?: string,
    created_at?: string;
    updated_at?: string;
}

export type IPlayerCheckIdentityRequest = {
    phone_number: string;
}
// ====================================================

export type IPlayerUpdateInfosRequestDto = {
    name: string;
    address: string,
    salesPointId: string,
    clientId: string
}
export type IPlayerUpdateInfosRequest = {
    name: string,
    address: string,
    salesPointId: string,
    clientId: string
}

export type IPlayerUpdateInfosResponseDto = {
    [key: string]: string
}
export type IPlayerUpdateInfosResponse = {
    is_created: boolean
}

// ====================================================


const PlayersApi = {
    checkIdentity: async (payload: IPlayerCheckIdentityRequest): Promise<IPlayerCheckIdentityResponse> => {
        if (env.APP_USE_MOCK_API === true) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            let res;
            if (payload.phone_number === "653618276") {
                res = await Promise.resolve({
                    data: { status: "OK", data: { id: 1, is_new_user: false, uuid: "c030673-5d9a-11f0-8012-0acc3673109d", phone_number: "653618276", username: "Duclair Deugoue", address: "Douala Cameroon" }, message: "Player data exist " }
                })
            } else {
                res = await Promise.resolve({ data: { status: "OK", data: { is_new_user: true, uuid: "030673-5d9a-11f0-8012-0acc36731094", phone_number: payload.phone_number, quartier: '' }, message: "Player data was created" } })
            }

            const res_body = res?.data as ReadResponse<IPlayerCheckIdentityResponseDto>;
            if (res_body.data) {
                const res_data: IPlayerCheckIdentityResponse = {
                    id: res_body.data.id,
                    is_new_user: res_body.data.address ? false : true,
                    uuid: res_body.data.uuid ?? '',
                    username: res_body.data.name ?? '',
                    phone_number: res_body.data?.phone_number ?? '',
                    address: res_body.data.address ?? '',
                    created_at: res_body.data.created_at,
                    updated_at: res_body.data.created_at
                }
                return res_data;
            }
            throw new Error("Somthing when wrong: ");
        }
        try {
            const res = await apiClient({
                method: 'GET',
                endpoint: api_urls.get_check_identity_url(payload.phone_number),
                // body: payload
            });
            const res_body = res.data as ReadResponse<IPlayerCheckIdentityResponseDto>
            console.log("Response from API: ", res_body);
            const res_data: IPlayerCheckIdentityResponse = {
                id: res_body.data.id,
                is_new_user: res_body.data.name ? false : true,
                uuid: res_body.data.uuid,
                username: res_body.data.name ?? '',
                phone_number: res_body.data.phone_number,
                address: res_body.data.address ?? '',
                created_at: res_body.data.created_at,
                updated_at: res_body.data.created_at
            }
            return res_data;
        } catch (error) {
            throw new Error(`Something went wrong:  ${error}`);
        }
    },
    updateInfos: async (payload: IPlayerUpdateInfosRequest) => {
        const requestDto: IPlayerUpdateInfosRequestDto = {
            name: payload.name,
            address: payload.address,
            salesPointId: payload.salesPointId,
            clientId: payload.clientId
        }

        const res = await apiClient({
            method: 'POST',
            endpoint: api_urls.get_store_url(),
            body: requestDto
        });
        const res_body = res.data as CreateResponse<IPlayerUpdateInfosResponseDto>;
        const res_data: IPlayerUpdateInfosResponse = {
            is_created: res_body.status === "OK" ? true : false
        }
        return res_data;
    },

}

export default PlayersApi;