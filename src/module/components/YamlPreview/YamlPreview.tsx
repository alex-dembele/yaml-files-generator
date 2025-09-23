import React, { useState } from 'react';
import { GeneratedFiles } from '../../types';
import './YamlPreview.css';

interface YamlPreviewProps {
    files: GeneratedFiles;
}

const YamlPreview: React.FC<YamlPreviewProps> = ({ files }) => {
    const [activeTab, setActiveTab] = useState<'values' | 'secret'>('values');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        });
    };

    return (
        <div className="yaml-preview">
            <h2>Generated Files</h2>

            <div className="tabs">
                <button
                    className={activeTab === 'values' ? 'active' : ''}
                    onClick={() => setActiveTab('values')}
                >
                    Values File: {files.valuesFilename}
                </button>
                <button
                    className={activeTab === 'secret' ? 'active' : ''}
                    onClick={() => setActiveTab('secret')}
                >
                    Secret File: {files.secretFilename}
                </button>
            </div>

            <div className="preview-content">
                {activeTab === 'values' ? (
                    <div>
                        <button
                            onClick={() => copyToClipboard(files.valuesYaml)}
                            className="copy-btn"
                        >
                            Copy Values YAML
                        </button>
                        <pre>{files.valuesYaml}</pre>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={() => copyToClipboard(files.secretYaml)}
                            className="copy-btn"
                        >
                            Copy Secret YAML
                        </button>
                        <pre>{files.secretYaml}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YamlPreview;