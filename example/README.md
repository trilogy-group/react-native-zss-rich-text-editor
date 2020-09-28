# Example project

## Install deps

```bash
cd example
yarn install
cd ios
pod install
```

## Running (ios)

```bash
cd example
react-native run-ios
```

## Running (android)

```bash
cd example
react-native run-android
```

## Testing changes

-   Install `yalc` globally. See https://www.npmjs.com/package/yalc for more details

```bash
cd example
bash build.sh
```

-   In order for the example app to refresh with the latest changes, you need to:
-   Run `$ bash build.sh`
-   Stop and restart the metro bundler and then run
-   `$ react-native run-ios`
-   or
-   `$ react-native run-android`
