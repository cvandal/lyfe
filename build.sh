#!/bin/bash

run() {
    set -e

    prepare
    test
    publish
    package
    deploy
}

prepare() {
    if ! command -v dotnet &> /dev/null; then
        echo "To build this application, you need to install the .NET SDK."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        echo "To build this application, you need to install Node.js."
        exit 1
    fi

    if ! command -v octo &> /dev/null; then
        echo "To package and deploy this application, you need to install the Octopus Deploy CLI."
        exit 1
    fi

    if [[ -z "${LYFE_VERSION}" ]]; then
        echo "To package this application, you need to set the LYFE_VERSION environment variable."
        exit 1
    fi

    if [[ -z "${OCTOPUS_URL}" ]]; then
        echo "To deploy this application, you need to set the OCTOPUS_URL environment variable."
        exit 1
    fi

    if [[ -z "${OCTOPUS_API_KEY}" ]]; then
        echo "To deploy this application, you need to set the OCTOPUS_API_KEY environment variable."
        exit 1
    fi

    if [[ -z "${OCTOPUS_ENVIRONMENT}" ]]; then
        echo "To deploy this application, you need to set the OCTOPUS_ENVIRONMENT environment variable."
        exit 1
    fi
}

test() {
    :
}

publish() {
    pushd ./src/Lyfe

    cmd='dotnet publish'
    echo "Running $cmd..."
    eval "$cmd"

    popd
}

package() {
    pushd ./src/Lyfe/bin/Debug/net5.0/publish

    cmd='rm -rf Lyfe.*.nupkg'
    echo "Running $cmd..."
    eval "$cmd"

    cmd='octo pack --id Lyfe --version $LYFE_VERSION --basePath .'
    echo "Running $cmd..."
    eval "$cmd"

    popd
}

deploy() {
    pushd ./src/Lyfe/bin/Debug/net5.0/publish

    cmd='octo push --package Lyfe.$LYFE_VERSION.nupkg --server $OCTOPUS_URL --apiKey $OCTOPUS_API_KEY'
    echo "Running $cmd..."
    eval "$cmd"

    cmd='octo create-release --project Lyfe --version $LYFE_VERSION --server $OCTOPUS_URL --apiKey $OCTOPUS_API_KEY'
    echo "Running $cmd..."
    eval "$cmd"

    cmd='octo deploy-release --project Lyfe --releaseNumber $LYFE_VERSION --deployto $OCTOPUS_ENVIRONMENT --server $OCTOPUS_URL --apiKey $OCTOPUS_API_KEY'
    echo "Running $cmd..."
    eval "$cmd"

    popd
}

run
