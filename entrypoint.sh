#!/bin/sh

echo "Starting placeholder replacement..."

# Define the working directory
WORK_DIR="/usr/share/nginx/html"

# Function to replace placeholders in files
replace_placeholders() {
    echo "Replacing placeholders in files..."
    
    # Find all files (excluding directories) and process them
    find "$WORK_DIR" -type f \( -name "*.js" -o -name "*.html" -o -name "*.css" -o -name "*.json" \) | while read -r file; do
        echo "Processing file: $file"
        
        # Replace placeholders with environment variables (using | as delimiter to handle URLs safely)
        sed -i "s|NXH_API_BASE_URL_PLACEHOLDER|${NXH_API_BASE_URL}|g" "$file"
    done
    
    echo "Placeholder replacement completed."
}

# Set default values if environment variables are not provided (optional)
export NXH_API_BASE_URL="${NXH_API_BASE_URL:-https://billing-api.stag.nexah.net/api/v1}"


# Replace placeholders
replace_placeholders

echo "Starting Nginx..."

# Execute the CMD instruction (start Nginx)
exec "$@"