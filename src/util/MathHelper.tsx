import _ from 'lodash';

export const floorToNearestWithPrecision = (
  value: number,
  precision: number,
) => {
  const factor = 1 / precision;
  return _.floor(value * factor) / factor;
};

export const findDecimalPlacesCount = (value: number) => {
  const stringValue = value.toString();
  const dotIndex = stringValue.indexOf('.');
  if (dotIndex == -1) {
    return 0;
  }
  return stringValue.length - dotIndex - 1;
};
