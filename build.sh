#!/bin/bash

if ! command -v dotnet &> /dev/null; then
    echo "To build this application, you need to install the .NET SDK."
    exit
fi

if ! command -v npm &> /dev/null; then
    echo "To build this application, you need to install Node.js."
    exit
fi

if ! command -v octo &> /dev/null; then
    echo "To package and deploy this application, you need to install the Octopus Deploy CLI."
    exit
fi

if [[ -z "${LYFE_VERSION}" ]]; then
    echo "To package this application, you need to set the LYFE_VERSION environment variable."
    exit
fi

if [[ -z "${OCTOPUS_URL}" ]]; then
    echo "To deploy this application, you need to set the OCTOPUS_URL environment variable."
    exit
fi

if [[ -z "${OCTOPUS_API_KEY}" ]]; then
    echo "To deploy this application, you need to set the OCTOPUS_API_KEY environment variable."
    exit
fi

pushd ./src/Lyfe

cmd='dotnet publish'
echo "Running $cmd..."
eval "$cmd"

popd

pushd ./src/Lyfe/bin/Debug/net5.0/publish

cmd='rm -rf Lyfe.*.nupkg'
echo "Running $cmd..."
eval "$cmd"

cmd='octo pack --id Lyfe --version $LYFE_VERSION --basePath .'
echo "Running $cmd..."
eval "$cmd"

cmd='octo push --package=Lyfe.$LYFE_VERSION.nupkg --server=$OCTOPUS_URL --apiKey $OCTOPUS_API_KEY'
echo "Running $cmd..."
eval "$cmd"

popd
