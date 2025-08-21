import { deepMerge } from "@/helpers/deep-merge-translation-object";
import { fr as layout_app_components_fr, en as layout_app_components_en } from "@/layouts/app/translation";
import { fr as module_dashboard_fr, en as module_dashboard_en } from "@/locals/dashboard-local";
import { fr as module_clients_fr, en as module_clients_en } from "@/locals/clients-local";


export const fr = {
    ...layout_app_components_fr,

    // Merge all module translations directly at the root level
    ...deepMerge(
        module_dashboard_fr,
        module_clients_fr

    )
}

export const en = {
    ...layout_app_components_en,

    // Merge all module translations directly at the root level
    ...deepMerge(
        module_dashboard_en,
        module_clients_en
    )
}