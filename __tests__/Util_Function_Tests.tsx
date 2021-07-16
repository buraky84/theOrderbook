import {
  floorToNearestWithPrecision,
  findDecimalPlacesCount,
} from '../src/util/MathHelper';

import {
  formatNumberWithCommas,
  formatNumberWithDotAndCommas,
} from '../src/util/NumFormatter';

test('floorToNearestWithPrecision test1', () => {
  expect(floorToNearestWithPrecision(100.24, 0.1)).toEqual(100.2);
});

test('floorToNearestWithPrecision test2', () => {
  expect(floorToNearestWithPrecision(100.24, 0.05)).toEqual(100.2);
});

test('floorToNearestWithPrecision test3', () => {
  expect(floorToNearestWithPrecision(106.24, 5)).toEqual(105);
});

test('floorToNearestWithPrecision test4', () => {
  expect(floorToNearestWithPrecision(106.24, 10)).toEqual(100);
});

test('findDecimalPlacesCount test1', () => {
  expect(findDecimalPlacesCount(1)).toEqual(0);
});

test('findDecimalPlacesCount test2', () => {
  expect(findDecimalPlacesCount(0.1)).toEqual(1);
});

test('findDecimalPlacesCount test3', () => {
  expect(findDecimalPlacesCount(0.01)).toEqual(2);
});

test('formatNumberWithCommas test1', () => {
  expect(formatNumberWithCommas('34507')).toEqual('34,507');
});

test('formatNumberWithCommas test2', () => {
  expect(formatNumberWithCommas('34507.2')).toEqual('34,507.2');
});

test('formatNumberWithCommas test2', () => {
  expect(formatNumberWithCommas('3450.245')).toEqual('3,450.245');
});

test('formatNumberWithDotAndCommas test1', () => {
  expect(formatNumberWithDotAndCommas('3450', 2)).toEqual('3,450.00');
});

test('formatNumberWithDotAndCommas test2', () => {
  expect(formatNumberWithDotAndCommas('34555', 1)).toEqual('34,555.0');
});

test('formatNumberWithDotAndCommas test2', () => {
  expect(formatNumberWithDotAndCommas('34555', 0)).toEqual('34,555');
});
