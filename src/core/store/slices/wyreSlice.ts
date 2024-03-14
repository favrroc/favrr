import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BACKEND_API_ENDPOINT, StorageKeys } from "../../constants/base.const";
import { IFindWyreTransactionsProps, WyreHistory, WyreOrderActionType } from "../../interfaces/transaction.type";
import { AsyncThunkConfig } from "../store";

interface IWyreSlice {
  depositing: boolean;
  depositAmount: number;
  claiming: boolean;
  claimAmount: number;
  claimAddress: string;
  loadingAllWyreTransactions: boolean;
  loadingAddedWyreTransactions: boolean;
  loadingClaimedWyreTransactions: boolean;
  loadingCancelledWyreTransactions: boolean;
  allWyreTransactions: Array<WyreHistory>;
  addedWyreTransactions: Array<WyreHistory>;
  claimedWyreTransactions: Array<WyreHistory>;
  cancelledWyreTransactions: Array<WyreHistory>;
  hasMoreAllWyreTransactions: boolean;
  hasMoreAddedWyreTransactions: boolean;
  hasMoreClaimedWyreTransactions: boolean;
  hasMoreCancelledWyreTransactions: boolean;
}

const initialState = {
  depositing: false,
  depositAmount: 0,
  claiming: false,
  claimAmount: 0,
  claimAddress: "",
  allWyreTransactions: [],
  addedWyreTransactions: [],
  claimedWyreTransactions: [],
  cancelledWyreTransactions: [],
  loadingAllWyreTransactions: false,
  loadingAddedWyreTransactions: false,
  loadingClaimedWyreTransactions: false,
  loadingCancelledWyreTransactions: false,
  hasMoreAllWyreTransactions: false,
  hasMoreAddedWyreTransactions: false,
  hasMoreClaimedWyreTransactions: false,
  hasMoreCancelledWyreTransactions: false
} as IWyreSlice;

type LoadWyreTransactionsPayload = {
  actionType: WyreOrderActionType,
  data: Array<WyreHistory>,
  count: number;
} | undefined;

export const loadWyreTransactions = createAsyncThunk<LoadWyreTransactionsPayload, IFindWyreTransactionsProps, AsyncThunkConfig>(
  "wyre/loadAllWyreTransactions",
  async ({ skip, take, actionType }, { getState }) => {
    const existingData: any = skip === 0 ? []
      : actionType === WyreOrderActionType.ALL ? getState().wyre.allWyreTransactions
        : actionType === WyreOrderActionType.ADDED ? getState().wyre.addedWyreTransactions
          : actionType === WyreOrderActionType.CLAIMED ? getState().wyre.claimedWyreTransactions
            : actionType === WyreOrderActionType.CANCELLED ? getState().wyre.cancelledWyreTransactions
              : getState().wyre.cancelledWyreTransactions;

    const url = `${BACKEND_API_ENDPOINT}/api/wyre-gateway/all?skip=${skip}&take=${take}&wallet=${getState().user.profile.address}${actionType === WyreOrderActionType.ALL ? "" : "&actionType=" + actionType}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res: any = await (await fetch(url, requestOptions)).json();

      const data: Array<WyreHistory> = res.data?.map((o: any) => {
        return {
          date: new Date(o.createdAt as string).getTime(),
          type: o.actionType as string,
          amount: o.amount as number,
          balance: o.updatedUserBalance as number
        } as WyreHistory;
      });

      return {
        actionType,
        data: existingData.concat(data),
        count: res.count as number
      } as LoadWyreTransactionsPayload;
    }
    catch (e) {
      console.error("loadWyreTransactions error: ", e);
    }
  }
);

export const addFunds = createAsyncThunk<void, number, AsyncThunkConfig>(
  "wyre/addFunds",
  async (amount, { dispatch }) => {
    /* const randomCardInfo = US_ADDRESSES[Math.floor(Math.random() * US_ADDRESSES.length)];
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem(StorageKeys.AuthorizationToken)}`
      },
      body: JSON.stringify({
        "debitCard": {
          "number": "4111111111111111",
          "year": "2023",
          "month": "01",
          "cvv": "123"
        },
        "address": {
          "country": "US",
          "state": "KS", // randomCardInfo.state,
          "city": "Wichita", // randomCardInfo.city,
          "postalCode": "67212", // randomCardInfo.postalCode,
          "street1": "1222 S IDA STREET", // randomCardInfo.address1,
          "street2": ""
        },
        "amount": amount,
        "amountIncludeFees": true,
        "sourceCurrency": "USD",
        "destCurrency": "USD",
        "givenName": "ryab",
        "familyName": "cook",
        "email": randomCardInfo.email, // "ryan@apple.com",
        "phone": "+12062012555" // randomCardInfo.phone_number
      })
    };

    try {
      const res = await (await fetch(`${BACKEND_API_ENDPOINT}/api/wyre-gateway/process-order`, requestOptions)).json();
      if (res.status !== "RUNNING_CHECKS") {
        console.error(res);
      }
    }
    catch (e) {
      console.error("Catch error: ", e);
    } */

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem(StorageKeys.AuthorizationToken)}`
      },
      body: JSON.stringify({
        "actionType": WyreOrderActionType.ADDED,
        "amount": amount.toString(),
        "dest": ""
      })
    };

    try {
      const res = await (await fetch(`${BACKEND_API_ENDPOINT}/api/wyre-gateway/process-non-wyre-order`, requestOptions)).json();
      if (res.status !== "COMPLETE") {
        console.error(res);
      }
      else {
        dispatch(loadWyreTransactions({ skip: 0, take: 4, actionType: WyreOrderActionType.ALL }));
        dispatch(loadWyreTransactions({ skip: 0, take: 4, actionType: WyreOrderActionType.ADDED }));
      }
    }
    catch (e) {
      console.error("Catch error: ", e);
    }
  }
);

export const claimFunds = createAsyncThunk<void, { amount: number, address: string; }, AsyncThunkConfig>(
  "wyre/claimFunds",
  async (props, { dispatch }) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem(StorageKeys.AuthorizationToken)}`
      },
      body: JSON.stringify({
        "actionType": WyreOrderActionType.CLAIMED,
        "amount": props.amount.toString(),
        "dest": props.address
      })
    };

    try {
      const res = await (await fetch(`${BACKEND_API_ENDPOINT}/api/wyre-gateway/process-non-wyre-order`, requestOptions)).json();
      if (res.status !== "COMPLETE") {
        console.error(res);
      }
      else {
        dispatch(loadWyreTransactions({ skip: 0, take: 4, actionType: WyreOrderActionType.ALL }));
        dispatch(loadWyreTransactions({ skip: 0, take: 4, actionType: WyreOrderActionType.CLAIMED }));
      }
    }
    catch (e) {
      console.error("Catch error: ", e);
    }
  }
);

export const cancelFunds = createAsyncThunk<void, { amount: number, address: string; }, AsyncThunkConfig>(
  "wyre/cancelFunds",
  async (props, { dispatch }) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem(StorageKeys.AuthorizationToken)}`
      },
      body: JSON.stringify({
        "actionType": WyreOrderActionType.CANCELLED,
        "amount": props.amount.toString(),
        "dest": props.address
      })
    };

    try {
      const res = await (await fetch(`${BACKEND_API_ENDPOINT}/api/wyre-gateway/process-non-wyre-order`, requestOptions)).json();
      if (res.status !== "COMPLETE") {
        console.error(res);
      }
      else {
        dispatch(loadWyreTransactions({ skip: 0, take: 4, actionType: WyreOrderActionType.ALL }));
        dispatch(loadWyreTransactions({ skip: 0, take: 4, actionType: WyreOrderActionType.CANCELLED }));
      }
    }
    catch (e) {
      console.error("Catch error: ", e);
    }
  }
);

const wyreSlice = createSlice({
  name: "wyre",
  initialState,
  reducers: {
    setIsDepositingThunk(state, action: PayloadAction<boolean>) {
      state.depositing = action.payload;
    },
    setDepositAmountThunk(state, action: PayloadAction<number>) {
      state.depositAmount = action.payload;
    },
    setIsClaimingThunk(state, action: PayloadAction<boolean>) {
      state.claiming = action.payload;
    },
    setClaimAmountThunk(state, action: PayloadAction<number>) {
      state.claimAmount = action.payload;
    },
    setClaimAddressThunk(state, action: PayloadAction<string>) {
      state.claimAddress = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // load wyre transactions
      .addCase(loadWyreTransactions.pending, (state) => {
        state.loadingAllWyreTransactions = true;
      })
      .addCase(loadWyreTransactions.fulfilled, (state, action: PayloadAction<LoadWyreTransactionsPayload>) => {
        state.loadingAllWyreTransactions = false;
        if (action.payload) {
          switch (action.payload.actionType) {
          case WyreOrderActionType.ALL:
            state.allWyreTransactions = action.payload.data;
            state.hasMoreAllWyreTransactions = state.allWyreTransactions.length < action.payload.count;
            break;
          case WyreOrderActionType.ADDED:
            state.addedWyreTransactions = action.payload.data;
            state.hasMoreAddedWyreTransactions = state.addedWyreTransactions.length < action.payload.count;
            break;
          case WyreOrderActionType.CLAIMED:
            state.claimedWyreTransactions = action.payload.data;
            state.hasMoreClaimedWyreTransactions = state.claimedWyreTransactions.length < action.payload.count;
            break;
          case WyreOrderActionType.CANCELLED:
            state.cancelledWyreTransactions = action.payload.data;
            state.hasMoreCancelledWyreTransactions = state.cancelledWyreTransactions.length < action.payload.count;
            break;
          default:
            break;
          }
        }
      })
      .addCase(loadWyreTransactions.rejected, (state, { error }) => {
        state.loadingAllWyreTransactions = false;
        state.loadingAddedWyreTransactions = false;
        state.loadingClaimedWyreTransactions = false;
        state.loadingCancelledWyreTransactions = false;
        console.error(error.name, error.message, error.stack);
      });
  }
});

export const { setIsDepositingThunk, setDepositAmountThunk, setIsClaimingThunk, setClaimAmountThunk, setClaimAddressThunk } = wyreSlice.actions;

export default wyreSlice.reducer;
