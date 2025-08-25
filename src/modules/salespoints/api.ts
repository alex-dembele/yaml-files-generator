import { API_CONFIG, apiClient } from "@/api";
import env from "@/env";


const api_urls = {
    get_verifyIdentity_url: (uuid: string) => API_CONFIG.buildUrl(`/salespoint/verify-identity/${uuid}`),


};

const SalesPointsApi = {
    verifyIdentity: async (uuid?: string) => {
        if (!uuid) {
            return null;
        }

        if (env.APP_USE_MOCK_API) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const res = { data: { status: 200, data: { status: 200, message: "Tombola  available at this salespoint" } } };
            // const res = { data: { status: 404, data: { status: 404, message: "Tombola not available at this salespoint" } } };
            return res?.data;
        }

        const res = await apiClient({ endpoint: api_urls.get_verifyIdentity_url(uuid) });
        return res.data;
    },

}

export default SalesPointsApi;
