import { API_CONFIG, apiClient } from "@/api";


const api_urls = {
    get_verifyIdentity_url: (uuid: string) => API_CONFIG.buildUrl(`/salespoint/verify-identity/${uuid}`),


};

const SalesPointsApi = {
    verifyIdentity: async (uuid: string) => {
        const res = await apiClient({ endpoint: api_urls.get_verifyIdentity_url(uuid) });
        return res.data;
    },

}

export default SalesPointsApi;
