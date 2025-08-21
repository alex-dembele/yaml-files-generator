import { API_CONFIG, apiClient } from "@/api";
import { IClient, IRecommendedPerson } from "@/routes/clients-page";

const modelName = "clients";

const api_urls = {
    getMany: () => API_CONFIG.buildUrl(`/${modelName}`),
    getOne: (id: number) => API_CONFIG.buildUrl(`/${modelName}/${id}`),
    create: () => API_CONFIG.buildUrl(`/${modelName}`),
    update: (id: number) => API_CONFIG.buildUrl(`/${modelName}/${id}`),
    deleteOne: (id: number) => API_CONFIG.buildUrl(`/${modelName}/${id}`),
    deleteMany: () => API_CONFIG.buildUrl(`/${modelName}`),
    getByFilterDaterange: () => API_CONFIG.buildUrl(`/${modelName}`),
    getTotalClients: () => API_CONFIG.buildUrl(`/total-client`),
    getTotalRecommendations: () => API_CONFIG.buildUrl(`/total-person`)


};

const ClientApi = {
    async getMany(
        { paginate = true, params = { page: 1, limit: 10 }, queryParams = {} }: any
    ): Promise<{ total: number, data: IClient[] }> {
        const res = await apiClient({
            endpoint: api_urls.getMany(),
            params: paginate ? {
                page: params.page,
                perPage: params.limit,
                fromDate: queryParams.dFrom,
                toDate: queryParams.dTo
            } : {
                paginate: 0
            }
        });
        const transformedResponseData = res.data.data.map((row, index) => this.transform(row, index)) || [];

        const total = paginate ? res.data.paginate.total : transformedResponseData.length;

        return {
            total: total,
            data: transformedResponseData
        }
    },

    transform(row: any, index: number): Partial<IClient> {
        const formatedAccountStatement: Partial<IClient> = {
            no: index + 1,
            id: row?.id,
            name: row?.name,
            IDClient: row?.IDClient,
            date: row.created_at,
            telephone: row?.phone_number,
            persons: row?.persons.map((person: any) => {
                const recommmendPerson: IRecommendedPerson = {
                    id: person?.id,
                    name: `${person?.first_name} ${person.last_name}`,
                    telephone: person?.phone_number
                }
                return recommmendPerson
            }),
        };
        return formatedAccountStatement
    },
    getOne: async (id: number) => {
        const res = await apiClient({ endpoint: api_urls.getOne(id) });
        return res.data;
    },
    create: async (payLoad: any) => {
        const res = await apiClient({ endpoint: api_urls.create(), method: 'POST', body: payLoad })
        return res.data;
    },
    update: async (payLoad: any) => {
        const res = await apiClient({ endpoint: api_urls.update(payLoad.id), method: "PUT", body: payLoad })
        return res.data;
    },
    deleteOne: async (id: number) => {
        const res = await apiClient({ endpoint: api_urls.deleteOne(id), method: "DELETE" })
        return res.data;
    },
    deleteMany: async (ids: number[]) => {
        const res = await apiClient({ endpoint: api_urls.deleteMany(), method: "POST", body: { "ids": ids } })
        return res.data;
    },
    getByFilterDaterange: async (payLoad: { fromDate: any, toDate: any }) => {
        const res = await apiClient({ endpoint: api_urls.getByFilterDaterange(), params: { paginate: 0, fromDate: payLoad.fromDate, toDate: payLoad.toDate } })
        return res.data;
    },
    getTotalClients: async () => {
        const res = await apiClient({ endpoint: api_urls.getTotalClients() })
        return res.data;
    },
    getTotalRecommendations: async () => {
        const res = await apiClient({ endpoint: api_urls.getTotalRecommendations() })
        return res.data;
    }

}

export default ClientApi;