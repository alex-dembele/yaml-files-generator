import { FC, ReactNode, Suspense } from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { MoonLoader, PropagateLoader } from 'react-spinners';
import { twMerge } from "tailwind-merge";

export interface LoaderProps {
    isPage?: boolean;
    customLoaderComponent?: ReactNode;
}

export const Loader: FC<LoaderProps> = ({ isPage, customLoaderComponent }) => {
    return (
        <div className={twMerge(
            isPage ? "h-screen w-screen" : "h-full w-full",
            'flex  flex-grow  items-center justify-center ',
        )}>
            {isPage ? (
                <span><PropagateLoader color="#20a8d8" /></span>
            ) : (
                customLoaderComponent ? (customLoaderComponent) : (<MoonLoader size={27} />)
            )}
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Fallback({ resetErrorBoundary }: any) {

    // Call resetErrorBoundary() to reset the error boundary and retry the render.
    return (
        <div role="alert" className='flex flex-grow min-h-screen flex-col items-center justify-center' >
            <p>Something went wrong: <button className='text-blue-700 underline' onClick={resetErrorBoundary} >Retry</button></p>
            {/*<pre style={{ color: "red" }}>{error.message}</pre>*/}
        </div>
    );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Loadable = ({ component, loaderComponent, isPage }: any) => {
    return (
        <Suspense fallback={loaderComponent ? loaderComponent : <Loader isPage={isPage} />}>
            <ErrorBoundary FallbackComponent={Fallback} onReset={() => window.location.reload()} >

                {component}
            </ErrorBoundary>
        </Suspense>
    )

}

export default Loadable;

