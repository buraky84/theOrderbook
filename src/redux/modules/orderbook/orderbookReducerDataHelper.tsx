import {floorToNearestWithPrecision} from '../../../util/MathHelper';
import {
  formatNumberWithCommas,
  formatNumberWithDotAndCommas,
} from '../../../util/NumFormatter';

export const updateExistingOrderbookObj = (
  newBidsAsksData: any,
  existingBidsData: any,
  existingAsksData: any,
) => {
  newBidsAsksData.forEach((value: number, key: string) => {
    const isBid = key.startsWith('b') ? true : false;
    const realKey = key.substring(1);
    if (value == 0) {
      //delete operation
      isBid
        ? delete existingBidsData[realKey]
        : delete existingAsksData[realKey];
    } else {
      let singleData = isBid
        ? existingBidsData[realKey]
        : existingAsksData[realKey];
      if (singleData) {
        //update operation
        if (isBid) {
          existingBidsData[realKey] = value;
        } else {
          existingAsksData[realKey] = value;
        }
      } else {
        //insert operation
        if (isBid) {
          existingBidsData[realKey] = value;
          Object.keys(existingAsksData).forEach((asksKey: string) => {
            if (parseFloat(realKey) >= parseFloat(asksKey)) {
              delete existingAsksData[asksKey];
            }
          });
        } else {
          existingAsksData[realKey] = value;

          Object.keys(existingBidsData).forEach((bidsKey: string) => {
            if (parseFloat(realKey) <= parseFloat(bidsKey)) {
              delete existingBidsData[bidsKey];
            }
          });
        }
      }
    }
  });

  return {existingBidsData, existingAsksData};
};

export const groupExistingOrderbookObjByTickerSize = (
  existingData: any,
  activeProductGroup: number,
) => {
  let groupedBidsData: any = {};
  Object.keys(existingData).forEach(key => {
    const newKey = floorToNearestWithPrecision(
      parseFloat(key),
      activeProductGroup,
    );
    const currentSize = groupedBidsData[newKey] ?? 0;
    groupedBidsData[newKey] = currentSize + existingData[key];
  });

  return groupedBidsData;
};

export const sortAndCalculateSizeOfGroupedOrderbookObj = (
  groupedData: any,
  filterSize: number,
  orderReverse: boolean,
) => {
  let sumOfSizes = 0;
  const sortedArr = Object.keys(groupedData)
    .sort((a, b) =>
      orderReverse
        ? parseFloat(a) - parseFloat(b)
        : parseFloat(b) - parseFloat(a),
    )
    .reduce((arr: any, key, index) => {
      if (index < filterSize) {
        sumOfSizes = sumOfSizes + groupedData[key];
        arr.push([key, groupedData[key], sumOfSizes]);
      }
      return arr;
    }, []);

  return {sortedArr, sumOfSizes};
};

export const formatOrderbookArrAndCalculateDepth = (
  orderedArr: any,
  decimalPlacesCount: number,
  screenWidthAfterMarginAndPaddings: number,
  tmpMaxSizeOfBidsOrAsks: number,
) => {
  return orderedArr.map((item: any) => {
    return [
      formatNumberWithDotAndCommas(item[0], decimalPlacesCount),
      formatNumberWithCommas(item[1].toString()),
      formatNumberWithCommas(item[2].toString()),
      Math.round(
        (screenWidthAfterMarginAndPaddings * item[2]) / tmpMaxSizeOfBidsOrAsks,
      ),
    ];
  });
};
