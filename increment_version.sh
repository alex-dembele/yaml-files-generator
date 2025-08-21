#!/bin/bash

# Fetch the latest tags from the repository
git fetch --tags

# Get the latest tag
latest_tag=$(git tag --sort=-v:refname | head -n 1)

# Check if the latest tag is empty
if [ -z "$latest_tag" ]; then
  # If no tags are found, start with version 1.0.0
  next_version="1.0.0"
else
  # Split the latest tag into major, minor, and patch components
  major=$(echo $latest_tag | cut -d. -f1)
  minor=$(echo $latest_tag | cut -d. -f2)
  patch=$(echo $latest_tag | cut -d. -f3)

  # Determine which version component to increment
  case "$1" in
    major)
      next_major=$((major + 1))
      next_minor=0
      next_patch=0
      ;;
    minor)
      next_major=$major
      next_minor=$((minor + 1))
      next_patch=0
      ;;
    patch)
      next_major=$major
      next_minor=$minor
      next_patch=$((patch + 1))
      ;;
    *)
      echo "Usage: $0 {major|minor|patch}"
      exit 1
      ;;
  esac

  # Form the next version string
  next_version="${next_major}.${next_minor}.${next_patch}"
fi

# Output the next version
echo "next_version=$next_version"
