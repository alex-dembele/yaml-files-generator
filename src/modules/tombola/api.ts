/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_CONFIG, apiClient, ReadResponse } from "@/api";

const api_urls = {
    get_scan_receipt_url: () => API_CONFIG.buildUrl(`/extract`),


};
// ====================================================

export type ITombolaScanReceiptRequestDto = {
    image: Blob;
    salesPointId: string,
    clientId: string
}
export type ITombolaScanReceiptRequest = {
    image: Blob;
    salesPointId: string,
    clientId: string
}
export type ITombolaScanReceiptResponseDto = {
    status: "OK" | "ERROR",
    data: any
    // data: {
    // 	"data": {
    // 		"raw_text": "(€\n\nCARREFOUR Market Bonamoussadi\nADIALEA CAMEROUN\nFace Lycée d'Akna Nord\nNIU: M121412354237S\nRCCM: N° RC/DLA/2014/8/4694\nBP: 15454 Douala - Cameroun\n\n \n \n \n \n \n  \n  \n  \n \n  \n   \n  \n \n \n  \n \n  \n    \n \n  \n\nTél:\nJuvert de lundi à dimanche\n24H/24H1\n1 BETGNET SUCRE\n1,000 * 400,000 400\nXT BEfGNET SOUFFLE\n1,000 x 600,000 600\nSAC BLANC 38X60 CARR\n1,000 * 100,000 100\nTOTAL 1100\nNbre d'articles\nOrange mobile 1100\nTVA incluse:\n19,25 % de 1100 178\n\nDate Heure Mag. Cai Emp Transac\n05.08.25 15:47 20201 3 211 687141\n\nAu plaisir de vous revoir !\nSee you soon !\n\na\n66202010! 7\n\nT\n|\n0368714120250805154611",
    // 		"receipt_info": {
    // 			"date": "05.08.25",
    // 			"time": "15:47",
    // 			"store_id": "20201",
    // 			"cashier_id": "3",
    // 			"employee_id": "211",
    // 			"transaction_id": "687141"
    // 		},
    // 		"amount": "1100"
    // 	},
    // 	"0": [
    // 		{
    // 			"id": 40463,
    // 			"num_code": "XNRWZ",
    // 			"transaction_number": "687141",
    // 			"client_id": 19141,
    // 			"amount": "1100",
    // 			"win_date": null,
    // 			"sale_point_id": 1,
    // 			"sso_user_id": 211,
    // 			"org_id": 81,
    // 			"created_at": "2025-08-26 10:08:29",
    // 			"updated_at": "2025-08-26 10:08:29"
    // 		}
    // 	]
    // }

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
            formData.append('image', payload.image);
            formData.append('salesPointId', payload.salesPointId)
            formData.append('clientId', payload.clientId)
            const res = await apiClient({
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                endpoint: api_urls.get_scan_receipt_url(),
                body: formData
            });
            const res_body = res.data as ReadResponse<ITombolaScanReceiptResponseDto>
            if (res_body.status === "OK") {
                const res_data: ITombolaScanReceiptResponse = {
                    isOkay: res_body.status === "OK" ? true : false,
                }
                return res_data;

            } else {
                throw new Error("Something went wrong, please try again");
            }

        } catch (error) {
            throw new Error(`Something went wrong:  ${error}`);
        }
    },
}

export default TombolaApi;