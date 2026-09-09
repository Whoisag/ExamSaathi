#!/bin/bash
set -e

echo "=== Building ExamSaathi Android APK ==="

export JAVA_HOME="/home/whois-ag/android-toolchain/jdk-17"
export ANDROID_HOME="/home/whois-ag/android-sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/build-tools/34.0.0:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$SCRIPT_DIR"

ANDROID_JAR="$ANDROID_HOME/platforms/android-34/android.jar"
BUILD_TOOLS="$ANDROID_HOME/build-tools/34.0.0"

rm -rf build
mkdir -p build/gen build/classes "$REPO_DIR/public/downloads"

echo "[1/6] Compiling resources with aapt2..."
$BUILD_TOOLS/aapt2 compile --dir app/src/main/res -o build/compiled_res.zip

echo "[2/6] Linking resources & generating R.java..."
$BUILD_TOOLS/aapt2 link \
  -o build/app-unaligned.apk \
  -I "$ANDROID_JAR" \
  --manifest app/src/main/AndroidManifest.xml \
  --java build/gen \
  -A app/src/main/assets \
  --auto-add-overlay \
  build/compiled_res.zip

echo "[3/6] Compiling Java source code with javac..."
$JAVA_HOME/bin/javac \
  -source 8 \
  -target 8 \
  -bootclasspath "$ANDROID_JAR" \
  -cp "$ANDROID_JAR" \
  -d build/classes \
  build/gen/com/whoisag/examsaathi/R.java \
  app/src/main/java/com/whoisag/examsaathi/MainActivity.java

echo "[4/6] Converting bytecode to classes.dex with d8..."
$BUILD_TOOLS/d8 \
  --min-api 24 \
  --output build/ \
  build/classes/com/whoisag/examsaathi/*.class

echo "[5/6] Adding classes.dex to APK..."
cd build
zip -uj app-unaligned.apk classes.dex
cd ..

echo "[6/6] Aligning and signing APK (v1, v2, v3 schemes)..."
$BUILD_TOOLS/zipalign -f -p 4 build/app-unaligned.apk build/app-aligned.apk

if [ ! -f release.keystore ]; then
  echo "Generating release signing keystore..."
  $JAVA_HOME/bin/keytool -genkeypair -v \
    -keystore release.keystore \
    -alias examsaathi \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass examsaathi123 \
    -keypass examsaathi123 \
    -dname "CN=ExamSaathi, OU=Mobile, O=Whoisag, L=Bengaluru, ST=KA, C=IN"
fi

$BUILD_TOOLS/apksigner sign \
  --ks release.keystore \
  --ks-pass pass:examsaathi123 \
  --ks-key-alias examsaathi \
  --key-pass pass:examsaathi123 \
  --v1-signing-enabled true \
  --v2-signing-enabled true \
  --v3-signing-enabled true \
  --out ExamSaathi.apk \
  build/app-aligned.apk

echo "=== Verifying Signed APK ==="
$BUILD_TOOLS/apksigner verify --verbose ExamSaathi.apk

echo "Copying distribution artifacts..."
cp -f ExamSaathi.apk "$REPO_DIR/ExamSaathi.apk"
cp -f ExamSaathi.apk "$REPO_DIR/public/downloads/ExamSaathi.apk"
cp -f ExamSaathi.apk "/home/whois-ag/ExamSaathi.apk"
if [ -d "/home/whois-ag/Desktop" ]; then
  cp -f ExamSaathi.apk "/home/whois-ag/Desktop/ExamSaathi.apk"
fi

echo "=== APK Successfully Built and Deployed ==="
echo "1. $SCRIPT_DIR/ExamSaathi.apk"
echo "2. $REPO_DIR/ExamSaathi.apk"
echo "3. $REPO_DIR/public/downloads/ExamSaathi.apk"
echo "4. /home/whois-ag/ExamSaathi.apk"
ls -lh ExamSaathi.apk
