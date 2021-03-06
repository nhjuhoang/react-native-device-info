const asyncFn = <T>(response: T) => () =>
  jest.fn(() => {
    return Promise.resolve(response);
  });
const syncFn = <T>(response: T) => () => jest.fn(() => response);
const makeFns = <T>(response: T) => [asyncFn(response), syncFn(response)];

const [stringFnAsync, stringFnSync] = makeFns('unknown');
const [numberFnAsync, numberFnSync] = makeFns(-1);
const [arrayFnAsync, arrayFnSync] = makeFns([]);
const [booleanFnAsync, booleanFnSync] = makeFns(false);
const [objectFnAsync, objectFnSync] = makeFns({});

const RNDeviceInfo: any = {};
const stringKeys = [
  'uniqueId',
  'deviceId',
  'model',
  'brand',
  'systemName',
  'systemVersion',
  'bundleId',
  'appName',
  'buildNumber',
  'appVersion',
];

for (const key of stringKeys) {
  RNDeviceInfo[key] = 'unknown';
}

const booleanKeys = ['isTablet'];
for (const key of booleanKeys) {
  RNDeviceInfo[key] = false;
}

RNDeviceInfo.syncUniqueId = stringFnAsync();
RNDeviceInfo.getDeviceToken = stringFnSync();

// string getters
const stringFnNames = [
  'getInstanceId',
  'getSerialNumber',
  'getAndroidId',
  'getIpAddress',
  'getMacAddress',
  'getSystemManufacturer',
  'getBuildId',
  'getInstallerPackageName',
  'getDeviceName',
  'getUserAgent',
  'getBootloader',
  'getDevice',
  'getDisplay',
  'getFingerprint',
  'getHardware',
  'getHost',
  'getProduct',
  'getTags',
  'getType',
  'getBaseOs',
  'getSecurityPatch',
  'getCodename',
  'getIncremental',
  'getPhoneNumber',
  'getCarrier',
  'deviceType',
  'getInstallReferrer',
];
for (const name of stringFnNames) {
  RNDeviceInfo[name] = stringFnAsync();
  RNDeviceInfo[`${name}Sync`] = stringFnSync();
}

// boolean getters
const booleanFnNames = [
  'isCameraPresent',
  'isEmulator',
  'isPinOrFingerprintSet',
  'isBatteryCharging',
  'isAirplaneMode',
  'hasSystemFeature',
  'isLocationEnabled',
  'isHeadphonesConnected',
];
for (const name of booleanFnNames) {
  RNDeviceInfo[name] = booleanFnAsync();
  RNDeviceInfo[`${name}Sync`] = booleanFnSync();
}

// number getters
const numberFnNames = [
  'getUsedMemory',
  'getFontScale',
  'getApiLevel',
  'getPreviewSdkInt',
  'getFirstInstallTime',
  'getLastUpdateTime',
  'getTotalMemory',
  'getMaxMemory',
  'getTotalDiskCapacity',
  'getTotalDiskCapacityOld',
  'getFreeDiskStorage',
  'getFreeDiskStorageOld',
  'getBatteryLevel',
];
for (const name of numberFnNames) {
  RNDeviceInfo[name] = numberFnAsync();
  RNDeviceInfo[`${name}Sync`] = numberFnSync();
}

const objectFnNames = ['getPowerState', 'getAvailableLocationProviders'];
for (const name of objectFnNames) {
  RNDeviceInfo[name] = objectFnAsync();
  RNDeviceInfo[`${name}Sync`] = objectFnSync();
}

const arrayFnNames = [
  'getSupportedAbis',
  'getSupported32BitAbis',
  'getSupported64BitAbis',
  'getSystemAvailableFeatures',
];
for (const name of arrayFnNames) {
  RNDeviceInfo[name] = arrayFnAsync();
  RNDeviceInfo[`${name}Sync`] = arrayFnSync();
}

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native'); // use original implementation, which comes with mocks out of the box

  // mock modules/components created by assigning to NativeModules
  RN.NativeModules.RNDeviceInfo = RNDeviceInfo;

  type OS = typeof RN.Platform.OS;
  jest.spyOn(RN.Platform, 'select').mockImplementation((obj: OS) => {
    return obj.android || obj.ios || obj.default;
  });

  return RN;
});

jest.mock('./src/internal/nativeInterface', () => ({ default: RNDeviceInfo }));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js', () => {
  const { EventEmitter } = require('events');
  return EventEmitter;
});
