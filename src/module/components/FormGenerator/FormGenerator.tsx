import React from 'react';
import { ApplicationConfig, SecretVariable } from '../../types';
import './FormGenerator.css';

interface FormGeneratorProps {
    config: ApplicationConfig;
    onConfigChange: (config: ApplicationConfig) => void;
    onGenerate: () => void;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({ config, onConfigChange, onGenerate }) => {
    const handleInputChange = (field: keyof ApplicationConfig, value: unknown) => {
        onConfigChange({
            ...config,
            [field]: value
        });
    };

    const handleSecretVariableChange = (index: number, field: keyof SecretVariable, value: string) => {
        const updatedVariables = [...config.secretVariables];
        updatedVariables[index] = {
            ...updatedVariables[index],
            [field]: value
        };

        onConfigChange({
            ...config,
            secretVariables: updatedVariables
        });
    };

    const addSecretVariable = () => {
        onConfigChange({
            ...config,
            secretVariables: [...config.secretVariables, { key: '', value: '' }]
        });
    };

    const removeSecretVariable = (index: number) => {
        const updatedVariables = config.secretVariables.filter((_, i) => i !== index);
        onConfigChange({
            ...config,
            secretVariables: updatedVariables
        });
    };

    return (
        <div className="form-generator">
            <h2>Application Configuration</h2>

            <div className="form-group">
                <label>Service Type:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="false"
                            checked={!config.isInternalService}
                            onChange={() => handleInputChange('isInternalService', false)}
                        />
                        External Service
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="true"
                            checked={config.isInternalService}
                            onChange={() => handleInputChange('isInternalService', true)}
                        />
                        Internal Service
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="genericName">Generic Name:</label>
                <input
                    type="text"
                    id="genericName"
                    value={config.genericName}
                    onChange={(e) => handleInputChange('genericName', e.target.value)}
                    placeholder="e.g., billing-api"
                />
            </div>

            <div className="form-group">
                <label htmlFor="tier">Tier:</label>
                <select
                    id="tier"
                    value={config.tier}
                    onChange={(e) => handleInputChange('tier', e.target.value)}
                >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="role">Role:</label>
                <select
                    id="role"
                    value={config.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                >
                    <option value="api">API</option>
                    <option value="db">Database</option>
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                    id="category"
                    value={config.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                >
                    <option value="core">Core</option>
                    <option value="nexah">Nexah</option>
                    <option value="ai">AI</option>
                    <option value="business">Business</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="image">Container Image (with tag):</label>
                <input
                    type="text"
                    id="image"
                    value={config.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="e.g., nexah/generic-app:1.0.0"
                />
            </div>

            <div className="form-group">
                <label htmlFor="environment">Environment:</label>
                <input
                    type="text"
                    id="environment"
                    value={config.environment}
                    onChange={(e) => handleInputChange('environment', e.target.value)}
                    placeholder="e.g., dev, staging, prod"
                />
            </div>

            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        checked={config.secretEnabled}
                        onChange={(e) => handleInputChange('secretEnabled', e.target.checked)}
                    />
                    Enable Secret Environment Variables
                </label>
            </div>

            {config.secretEnabled && (
                <div className="secret-variables">
                    <h3>Secret Environment Variables</h3>
                    {config.secretVariables.map((variable, index) => (
                        <div key={index} className="secret-variable">
                            <input
                                type="text"
                                placeholder="Key (e.g., NXH_DATABASE_HOST)"
                                value={variable.key}
                                onChange={(e) => handleSecretVariableChange(index, 'key', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Value"
                                value={variable.value}
                                onChange={(e) => handleSecretVariableChange(index, 'value', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => removeSecretVariable(index)}
                                className="remove-btn"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addSecretVariable} className="add-btn">
                        Add Variable
                    </button>
                </div>
            )}

            <button onClick={onGenerate} className="generate-btn">
                Generate YAML Files
            </button>
        </div>
    );
};

export default FormGenerator;