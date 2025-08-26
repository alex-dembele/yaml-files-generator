import { API_CONFIG, apiClient, ReadResponse } from "@/api";

const api_urls = {
    get_scan_receipt_url: () => API_CONFIG.buildUrl(`/tombola/scan-receipt`),


};
// ====================================================

export type ITombolaScanReceiptRequestDto = {
    image_blob: Blob;
}
export type ITombolaScanReceiptRequest = {
    imageBlob: Blob;
}
export type ITombolaScanReceiptResponseDto = {
    is_okay: boolean;
}

export type ITombolaScanReceiptResponse = {
    isOkay: boolean;
}

// ====================================================


const TombolaApi = {
    scanReceipt: async (payload: ITombolaScanReceiptRequest): Promise<ITombolaScanReceiptResponse> => {
        // if (env.APP_USE_MOCK_API) {
        //     await new Promise((resolve) => setTimeout(resolve, 200));
        //     let res;
        //     if (payload.phone_number === "653618276") {
        //         res = await Promise.resolve({
        //             data: { status: "OK", data: { id: 1, is_new_user: false, uuid: "c030673-5d9a-11f0-8012-0acc3673109d", phone_number: "653618276", username: "Duclair Deugoue", quartier: "Douala Cameroon" }, message: "Player data exist " }
        //         })
        //     } else {
        //         res = await Promise.resolve({ data: { status: "OK", data: { is_new_user: true, uuid: "030673-5d9a-11f0-8012-0acc36731094", phone_number: payload.phone_number, quartier: '' }, message: "Player data was created" } })
        //     }

        //     const res_body = res.data as ReadResponse<IPlayerCheckIdentityResponseDto>;
        //     if (res_body.data) {
        //         const res_data: IPlayerCheckIdentityResponse = {
        //             id: res_body.data.id,
        //             is_new_user: res_body.data.is_new_user ?? false,
        //             uuid: res_body.data.uuid ?? '',
        //             username: res_body.data.username ?? '',
        //             phone_number: res_body.data?.phone_number ?? '',
        //             quartier: res_body.data.quartier,
        //             created_at: res_body.data.created_at,
        //             updated_at: res_body.data.created_at
        //         }
        //         return res_data;
        //     }
        //     throw new Error("Somthing when wrong: ");

        // }
        try {
            const formData = new FormData();
            formData.append('receipt', payload.imageBlob);

            const res = await apiClient({
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                endpoint: api_urls.get_scan_receipt_url(),
                body: formData
            });
            const res_body = res.data as ReadResponse<ITombolaScanReceiptResponseDto>
            const res_data: ITombolaScanReceiptResponse = {
                isOkay: res_body.data.is_okay,
            }
            return res_data;
        } catch (error) {
            throw new Error(`Something went wrong:  ${error}`);
        }
    },
}

export default TombolaApi;