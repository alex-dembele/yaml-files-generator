export interface ApplicationConfig {
    isInternalService: boolean;
    genericName: string;
    tier: 'frontend' | 'backend';
    role: 'api' | 'db' | 'web' | 'mobile';
    category: 'core' | 'nexah' | 'ai' | 'business';
    image: string;
    secretEnabled: boolean;
    environment: string;
    secretVariables: SecretVariable[];
}

export interface SecretVariable {
    key: string;
    value: string;
}

export interface GeneratedFiles {
    valuesYaml: string;
    secretYaml: string;
    valuesFilename: string;
    secretFilename: string;
}