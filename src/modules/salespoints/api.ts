import { API_CONFIG, apiClient, ReadResponse } from "@/api";
import env from "@/env";


const api_urls = {
    get_verifyIdentity_url: (uuid: string) => API_CONFIG.buildUrl(`/sales-point/${uuid}`),
};

const SalesPointsApi = {
    verifyIdentity: async (uuid?: string) => {
        if (!uuid) {
            return null;
        }

        if (env.APP_USE_MOCK_API === true) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const res = { data: { status: 200, data: { status: 200, message: "Tombola  available at this salespoint" } } };
            // const res = { data: { status: 404, data: { status: 404, message: "Tombola not available at this salespoint" } } };
            return res?.data;
        }

        try {
            const res = await apiClient({ endpoint: api_urls.get_verifyIdentity_url(uuid) });
            const res_body = res.data as ReadResponse<{ status: "OK" | "ERROR", data?: any }>
            return {
                status: res_body.data ? 200 : 400
            };
        } catch (error) {
            throw new Error("Something went wrong!");
        }


    },

}

export default SalesPointsApi;
