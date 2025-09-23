import React from 'react';
import { GeneratedFiles } from '../../types';
import './FileDownload.css';

interface FileDownloadProps {
    files: GeneratedFiles;
}

const FileDownload: React.FC<FileDownloadProps> = ({ files }) => {
    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const downloadAll = () => {
        downloadFile(files.valuesYaml, files.valuesFilename);
        setTimeout(() => {
            downloadFile(files.secretYaml, files.secretFilename);
        }, 100);
    };

    return (
        <div className="file-download">
            <h3>Download Files</h3>
            <div className="download-buttons">
                <button onClick={() => downloadFile(files.valuesYaml, files.valuesFilename)}>
                    Download Values YAML
                </button>
                <button onClick={() => downloadFile(files.secretYaml, files.secretFilename)}>
                    Download Secret YAML
                </button>
                <button onClick={downloadAll} className="download-all">
                    Download All Files
                </button>
            </div>
        </div>
    );
};

export default FileDownload;