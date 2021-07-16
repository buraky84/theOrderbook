import {
  RESET_BIDS_AND_ASKS_DATA,
  BATCH_UPDATE_BIDS_AND_ASKS_DATA,
  TOGGLE_PRODUCT_GROUP,
} from './orderbookActionTypes';
import {Dimensions} from 'react-native';
import {findDecimalPlacesCount} from '../../../util/MathHelper';
import {
  formatOrderbookArrAndCalculateDepth,
  groupExistingOrderbookObjByTickerSize,
  sortAndCalculateSizeOfGroupedOrderbookObj,
  updateExistingOrderbookObj,
} from './orderbookReducerDataHelper';
import {PRODUCTS} from '../../../config/consts';

const screenWidthAfterMarginAndPaddings = Dimensions.get('window').width - 8; //8 is the horizontal screen padding of Orderbook UI

const initialGlobalState = {
  activeProductGroup: PRODUCTS[0].groupOptions[0],
  bidsData: {}, // main state object of the bids. object format is choosen because keys are unique and processing time is faster than array.
  asksData: {}, // main state object of the asks. object format is choosen because keys are unique and processing time is faster than array.
  bidsArr: [], // grouped, formatted version of bidsData & converted to an array to be better presented on UI Flatlist
  asksArr: [], // grouped, formatted version of asksData & converted to an array to be better presented on UI Flatlist
};

//************************ REDUCER ************************************

export const orderbookReducer = (state = initialGlobalState, action: any) => {
  let newState = state;

  switch (action.type) {
    case RESET_BIDS_AND_ASKS_DATA:
      newState = {
        ...state,
        bidsData: new Map(),
        asksData: new Map(),
        bidsArr: [],
        asksArr: [],
      };
      return newState;
    case TOGGLE_PRODUCT_GROUP:
      newState = {
        ...state,
        activeProductGroup: action.payload,
      };
      return newState;
    case BATCH_UPDATE_BIDS_AND_ASKS_DATA:
      const {newBidsAsksData} = action.payload;

      //* receive new bids/asks object and batch update/process existing bids/asks object either by adding new, overriding or deleting.
      let {existingBidsData, existingAsksData} = updateExistingOrderbookObj(
        newBidsAsksData,
        {...state.bidsData},
        {...state.asksData},
      );

      //* group existingBidsData & existingAsksData objects by ticker size
      let groupedBidsData: any = groupExistingOrderbookObjByTickerSize(
        existingBidsData,
        state.activeProductGroup,
      );
      let groupedAsksData: any = groupExistingOrderbookObjByTickerSize(
        existingAsksData,
        state.activeProductGroup,
      );
      //*

      //* sort and reduce and calculate total size of processed bids and asks data
      const {sortedArr: orderedBidsArr, sumOfSizes: sumOfBidsSizes} =
        sortAndCalculateSizeOfGroupedOrderbookObj(groupedBidsData, 20, false);
      const {sortedArr: orderedAsksArr, sumOfSizes: sumOfAsksSizes} =
        sortAndCalculateSizeOfGroupedOrderbookObj(groupedAsksData, 20, true);
      //*

      // find the maximum total size to calculate depth graph width
      const tmpMaxSizeOfBidsOrAsks =
        sumOfBidsSizes > sumOfAsksSizes ? sumOfBidsSizes : sumOfAsksSizes;

      const decimalPlacesCount = findDecimalPlacesCount(
        state.activeProductGroup,
      );

      //* format each item on bids and asks array and calculate depth width
      const newOrderedBidsArr = formatOrderbookArrAndCalculateDepth(
        orderedBidsArr,
        decimalPlacesCount,
        screenWidthAfterMarginAndPaddings,
        tmpMaxSizeOfBidsOrAsks,
      );
      const newOrderedAsksArr = formatOrderbookArrAndCalculateDepth(
        orderedAsksArr,
        decimalPlacesCount,
        screenWidthAfterMarginAndPaddings,
        tmpMaxSizeOfBidsOrAsks,
      );
      // *

      newState = {
        ...state,
        bidsData: existingBidsData,
        bidsArr: newOrderedBidsArr,
        asksData: existingAsksData,
        asksArr: newOrderedAsksArr,
      };
      return newState;
    default:
      return state;
  }
};
