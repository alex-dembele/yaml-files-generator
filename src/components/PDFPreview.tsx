import { Worker, Viewer, ProgressBar, LoadError, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { FC } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as pdfWorker from "pdfjs-dist/build/pdf.worker.min.js";
type PDFPreviewProps = {
    url?: string | null
}

export const PDFPreview: FC<PDFPreviewProps> = ({ url }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        // Optionally, remove the sidebar tabs if you don't want any sidebar:
        sidebarTabs: () => [],
        // renderToolbar: () => <div />
    });

    const renderError = (error: LoadError) => {
        let message = '';
        switch (error.name) {
            case 'InvalidPDFException':
                message = 'The document is invalid or corrupted';
                break;
            case 'MissingPDFException':
                message = 'The document is missing';
                break;
            case 'UnexpectedResponseException':
                message = 'Unexpected server response';
                break;
            default:
                message = 'Cannot load the document';
                break;
        }

        return (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#e53e3e',
                        borderRadius: '0.25rem',
                        color: '#fff',
                        padding: '0.5rem',
                    }}
                >
                    {message}
                </div>
            </div>
        );
    };


    return (
        <>
            <div className="rounded-md flex flex-grow flex-col  shadow-md">
                {url ? (
                    // <Worker workerUrl={`https://unpkg.com/pdfjs-dist@5.2.133/build/pdf.worker.min.js`}>
                    <Worker workerUrl={pdfWorker}>
                        <div className="w-full h-full overflow-auto ">
                            <Viewer
                                defaultScale={SpecialZoomLevel.PageWidth}
                                renderError={renderError}
                                renderLoader={(percentages: number) => (
                                    <div className="flex h-full justify-center  items-center flex-grow flex-col">
                                        <div>
                                            <div style={{ width: '240px' }}>
                                                <ProgressBar progress={Math.round(percentages)} />
                                            </div>
                                        </div>
                                    </div>

                                )}
                                fileUrl={url ?? null}
                                plugins={[defaultLayoutPluginInstance]}
                            />
                        </div>
                    </Worker>
                ) : (
                    <p className="text-center text-red-500">No PDF file provided.</p>
                )}
            </div>

        </>
    );
};

