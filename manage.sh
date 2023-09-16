#!/bin/bash

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display script usage
usage() {
    echo -e "${YELLOW}Usage: $0 {build|install|clean}${NC}"
    exit 1
}

# Verify the number of arguments
if [ "$#" -ne 1 ]; then
    usage
fi

# Function to mark the beginning of a step
start_step() {
    echo -e "${GREEN}Starting step: $1${NC}"
}

# Function to mark the end of a step
end_step() {
    echo -e "${GREEN}Step completed: $1${NC}"
}

if [ "$1" == "build" ]; then
    start_step "Build"

    echo -e "${YELLOW}Generating keys...${NC}"
    keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.p12 -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

    cd android || exit
    echo -e "${YELLOW}Generating bundle...${NC}"
    ./gradlew bundleRelease
    echo -e "${YELLOW}Bundle generated at: android/app/build/outputs/bundle/release/app-release.aab${NC}"

    echo -e "${YELLOW}Assembling APK...${NC}"
    ./gradlew assembleRelease
    echo -e "${YELLOW}APK generated at: android/app/build/outputs/apk/release/app-release.apk${NC}"

    end_step "Build"
elif [ "$1" == "install" ]; then
    start_step "Install"

    echo -e "${YELLOW}Installing npm dependencies...${NC}"
    npm install

    echo -e "${YELLOW}Copying SmsModule.java...${NC}"
    cp SmsModule.java node_modules/react-native-get-sms-android/android/src/main/java/com/react

    echo -e "${YELLOW}Starting npm server...${NC}"
    npm start

    end_step "Install"
elif [ "$1" == "clean" ]; then
    start_step "Clean"

    cd android || exit
    echo -e "${YELLOW}Cleaning with Gradle...${NC}"
    ./gradlew clean 2> /dev/null

    cd .. || exit
    echo -e "${YELLOW}Removing node_modules...${NC}"
    rm -rf node_modules 2> /dev/null

    echo -e "${YELLOW}Removing Gradle execution history...${NC}"
    rm android/.gradle/8.0.1/executionHistory/executionHistory.bin 2> /dev/null
    echo -e "${GREEN}Project cleaned.${NC}"

    end_step "Clean"
else
    echo -e "${RED}Invalid option. Use 'build', 'install', or 'clean'.${NC}"
    usage
fi
