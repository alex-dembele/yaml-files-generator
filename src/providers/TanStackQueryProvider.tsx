"use client";

import React from "react";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { AxiosError } from "axios";
import { handleServerError } from "@/utils/handle-server-error";
import { toast } from "@/hooks/use-toast";
// import { useAuthStore } from "@/auth/auth.store";
import { useNavigate } from 'react-router-dom';


function TanStackQueryProvider({ children }: React.PropsWithChildren) {
    const persister = createSyncStoragePersister({
        storage: window.localStorage,
    });
    const navigate = useNavigate();

    const [client] = React.useState(new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount, error) => {
                    if (import.meta.env.DEV) console.log({ failureCount, error })

                    if (failureCount >= 0 && import.meta.env.DEV) return false
                    if (failureCount > 3 && import.meta.env.PROD) return false

                    return !(
                        error instanceof AxiosError &&
                        [401, 403].includes(error.response?.status ?? 0)
                    )
                },
                refetchOnWindowFocus: import.meta.env.PROD,
                // staleTime: 10 * 1000, // 10s
                gcTime: 1000 * 60 * 60 * 8, // 8 hours
            },
            mutations: {
                onError: (error) => {
                    handleServerError(error);

                    if (error instanceof AxiosError) {
                        if (error.response?.status === 304) {
                            toast({
                                variant: 'destructive',
                                title: 'Content not modified!',
                            })
                        }
                        if (error.response?.status === 401) {
                            toast({
                                variant: 'destructive',
                                title: 'Session expired!',
                            })
                            // useAuthStore.getState().reset() // Call reset directly
                            const redirect = `${window.location.href}`
                            navigate(`/refresh?redirect=${encodeURIComponent(redirect)}`)
                        }
                        if (error.response?.status === 403) {
                            toast({
                                variant: 'destructive',
                                title: 'Insufficient scope or permissions!',
                            })
                            // router.navigate("/forbidden", { replace: true });
                        }
                    }


                },
            },
        },
        queryCache: new QueryCache({
            onError: (error) => {

                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        toast({
                            variant: 'destructive',
                            title: 'Session expired!',
                        })
                        // useAuthStore.getState().reset() // Call reset directly
                        const redirect = `${window.location.href}`
                        // Assuming you are using React Router, import `useNavigate` and define `navigate`:

                        // Inside the component, define `navigate`:

                        // Replace the line with:
                        navigate(`/refresh?redirect=${encodeURIComponent(redirect)}`)
                    }
                    if (error.response?.status === 500) {
                        toast({
                            variant: 'destructive',
                            title: 'Internal Server Error!',
                        })
                        navigate('/500')
                    }
                    // if (error.response?.status === 404) {
                    //     toast({
                    //         variant: 'destructive',
                    //         title: 'Data Not found',
                    //     })
                    //     // navigate('/404')
                    // }
                    if (error.response?.status === 403) {
                        toast({
                            variant: 'destructive',
                            title: 'Insufficient scope or permissions!',
                        })
                        // router.navigate("/forbidden", { replace: true });
                    }
                }
            },
        }),
    }));

    return (
        <PersistQueryClientProvider client={client} persistOptions={{ persister }}>
            {children}
        </PersistQueryClientProvider>
    );
}

export default TanStackQueryProvider