import { ApplicationConfig, GeneratedFiles } from '../types';

export const generateYamlFiles = (config: ApplicationConfig): GeneratedFiles => {
    // Generate values.yaml content
    const valuesYaml = `# This file contains Helm values for the microservice

# Says if the service is used by NEXAH for internal (For NEXAH only) or external (For customers) purpose
isInternalService: ${config.isInternalService}

# Domain name used to deploy this service.
dns: nexah.net

application:
  # Application generic name. This generic name will be used to create other names by
  # concatenation of this generic name with information like prefix 'nxh', suffix 'dev'
  # and other information
  genericName: ${config.genericName}

  # Application tier. Different tiers are : 'frontend' and 'backend'
  tier: ${config.tier}

  # Application role Different roles are : 'api', 'db', 'web' or 'mobile'
  role: ${config.role}

  # Application category. Different categories are : 'core', 'nexah', 'ai' or 'business'
  category: ${config.category}
  
container:
  # Container image. Give the container image with its tag
  image: ${config.image}
  
  # Says if the service needs to connect to the database.
secretEnvironmentVariables: 
  Enabled: ${config.secretEnabled}
  
  Keys:${config.secretEnabled ? '\n' + config.secretVariables.map(v => `  - ${v.key}`).join('\n') : ' []'}
`;

    // Generate secret.yaml content
    const namespace = config.isInternalService
        ? `nxh-internal-services-ns-${config.environment}`
        : `nxh-external-services-ns-${config.environment}`;

    const secretData = config.secretVariables.map(variable =>
        `  ${variable.key}: ${btoa(variable.value)}`
    ).join('\n');

    const secretYaml = `apiVersion: v1
kind: Secret
metadata:
  # name: the values is also the same values as the name of the file
  name: nxh-${config.genericName}-db-secr-${config.environment}

  # namespace: nxh-external-services-ns-dev or nxh-internal-services-ns-dev
  namespace: ${namespace}

type: Opaque
data:
${secretData}

# "echo -n 'parameter' | base64" to put in base 64
`;

    // Generate filenames
    const valuesFilename = `nxh-${config.genericName}-ms-values.yml`;
    const secretFilename = `nxh-${config.genericName}-db-secr-${config.environment}.yml`;

    return {
        valuesYaml,
        secretYaml,
        valuesFilename,
        secretFilename
    };
};