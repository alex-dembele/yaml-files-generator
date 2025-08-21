import { SYSTEM_PERMISSIONS } from "@/data/permissions";
import { FC, PropsWithChildren } from "react";
import { useAuthStore } from "../auth.store";

type AuthMiddlewareProps = {
    permission: (typeof SYSTEM_PERMISSIONS)[keyof typeof SYSTEM_PERMISSIONS];
} & PropsWithChildren;


export const CheckPermission: FC<AuthMiddlewareProps> = ({ permission, children }) => {
    const { encodedPermissions } = useAuthStore();
    const decodedPermissionsArr = JSON.parse(atob(encodedPermissions)) as Array<string>;

    const isPermissionPresent = decodedPermissionsArr.find(perm => perm === permission);

    if (isPermissionPresent) {
        return children
    }
    return <></>
}