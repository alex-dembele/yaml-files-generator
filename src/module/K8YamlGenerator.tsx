import React, { useState } from 'react';
import FormGenerator from './components/FormGenerator/FormGenerator';
import YamlPreview from './components/YamlPreview/YamlPreview';
import FileDownload from './components/FileDownload/FileDownload';
import { ApplicationConfig, GeneratedFiles } from './types';
import { generateYamlFiles } from './utils/yamlGenerator';
import './K8YamlGenerator.css';

function K8YamlGenerator() {
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles | null>(null);
  const [config, setConfig] = useState<ApplicationConfig>({
    isInternalService: false,
    genericName: '',
    tier: 'backend',
    role: 'api',
    category: 'nexah',
    image: '',
    secretEnabled: false,
    environment: 'dev',
    secretVariables: []
  });

  const handleConfigChange = (newConfig: ApplicationConfig) => {
    setConfig(newConfig);
  };

  const handleGenerate = () => {
    if (!config.genericName) {
      alert('Please enter a generic name');
      return;
    }

    const files = generateYamlFiles(config);
    setGeneratedFiles(files);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>K8s YAML Generator</h1>
        <p>Generate Kubernetes deployment files for your applications</p>
      </header>

      <div className="app-content">
        <div className="form-section">
          <FormGenerator
            config={config}
            onConfigChange={handleConfigChange}
            onGenerate={handleGenerate}
          />
        </div>

        {generatedFiles && (
          <div className="preview-section">
            <YamlPreview files={generatedFiles} />
            <FileDownload files={generatedFiles} />
          </div>
        )}
      </div>
    </div>
  );
}

export default K8YamlGenerator;