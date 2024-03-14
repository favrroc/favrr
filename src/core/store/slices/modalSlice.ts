import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAddFundsCanceledModalProps } from "../../../components/modal/AddFundsCanceledModal";

import { IShareFanMatchProps } from "../../../components/modal/fan-match-share-modal/ShareFanMatchModal";
import { IOrderRejectedModalProps } from "../../../components/modal/order-rejected-modal/OrderRejectedModal";
import { IShareProfileProps } from "../../../components/modal/share-profile/ShareProfileModal";
import { IBuySellModalProps } from "../../../components/transaction/buy-sell-modal/BuySellModal";
import { IOpeningWalletModalProps } from "../../../components/transaction/open-wallet-modal/OpenWalletModal";
import { IOrderPlacedModalProps } from "../../../components/transaction/order-placed-modal/OrderPlacedModal";

interface IModalSlice {
  showAddFundsModal: boolean;
  showClaimFundsModal: boolean;
  showFundsAddedModal: boolean;
  showPlanktonModal: boolean;
  showShrimpModal: boolean;
  showCrabModal: boolean;
  showCrabModal2: boolean;
  showCrabModal3A: boolean;
  showCrabModal3B: boolean;
  showCrabModal3C: boolean;
  showBlowFishModal: boolean;
  showOrderRejectedModal: boolean;
  orderRejectedModalProps: IOrderRejectedModalProps;
  showOpeningWalletModal: boolean;
  openingWalletModalProps: IOpeningWalletModalProps;
  showFundsClaimedModal: boolean;
  showClaimRejectedModal: boolean;
  showConnectWalletModal: boolean;
  showLateralMenu: boolean;
  showBuySellModal: boolean;
  buySellModalProps: IBuySellModalProps;
  showOrderPlacedModal: boolean;
  orderPlacedModalProps: IOrderPlacedModalProps;
  showShareProfileModal: boolean;
  showShareFanMatchModal: boolean;
  shareFanMatchModalProps: IShareFanMatchProps,
  shareProfileModalProps: IShareProfileProps;
  showImportTokenModal: boolean;
  showWrongNetworkModal: boolean;
  showAddFundsCanceledModal: boolean;
  addFundsCanceledModalProps: IAddFundsCanceledModalProps;
  showSignRejectedModal: boolean;
  showSigningModal:boolean;
}

const initialState = {
  showAddFundsModal: false,
  showClaimFundsModal: false,
  showFundsAddedModal: false,
  showPlanktonModal: false,
  showShrimpModal: false,
  showCrabModal: false,
  showCrabModal2: false,
  showCrabModal3A: false,
  showCrabModal3B: false,
  showCrabModal3C: false,
  showBlowFishModal: false,
  showOrderRejectedModal: false,
  showOpeningWalletModal: false,
  showFundsClaimedModal: false,
  showClaimRejectedModal: false,
  showConnectWalletModal: false,
  showLateralMenu: false,
  showBuySellModal: false,
  showOrderPlacedModal: false,
  showShareProfileModal: false,
  showShareFanMatchModal: false,
  showImportTokenModal: false,
  showWrongNetworkModal: false,
  showAddFundsCanceledModal: false,
  showSignRejectedModal: false,
  showSigningModal: false,
} as IModalSlice;

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setShowAddFundsModalAction(state, action: PayloadAction<boolean>) {
      state.showAddFundsModal = action.payload;
    },
    setShowFundsAddedModalAction(state, action: PayloadAction<boolean>) {
      state.showFundsAddedModal = action.payload;
    },
    setShowClaimFundsModalAction(state, action: PayloadAction<boolean>) {
      state.showClaimFundsModal = action.payload;
    },
    setShowOrderRejectedModalAction(state, action: PayloadAction<{ showModal: boolean, props?: IOrderRejectedModalProps }>) {
      state.showOrderRejectedModal = action.payload.showModal;
      if (action.payload.props) {
        state.orderRejectedModalProps = action.payload.props;
      }
    },
    setShowPlanktonModalAction(state, action: PayloadAction<boolean>) {
      state.showPlanktonModal = action.payload;
    },
    setShowShrimpModalAction(state, action: PayloadAction<boolean>) {
      state.showShrimpModal = action.payload;
    },
    setShowCrabModalAction(state, action: PayloadAction<boolean>) {
      state.showCrabModal = action.payload;
    },
    setShowCrabModal2Action(state, action: PayloadAction<boolean>) {
      state.showCrabModal2 = action.payload;
    },
    setShowCrabModal3AAction(state, action: PayloadAction<boolean>) {
      state.showCrabModal3A = action.payload;
    },
    setShowCrabModal3BAction(state, action: PayloadAction<boolean>) {
      state.showCrabModal3B = action.payload;
    },
    setShowCrabModal3CAction(state, action: PayloadAction<boolean>) {
      state.showCrabModal3C = action.payload;
    },
    setShowBlowFishModalAction(state, action: PayloadAction<boolean>) {
      state.showBlowFishModal = action.payload;
    },
    setShowShareFanMatchModalAction(state, action: PayloadAction<{ showModal: boolean, props?: IShareFanMatchProps }>) {
      state.showShareFanMatchModal = action.payload.showModal;
      if(action.payload.props) {
        state.shareFanMatchModalProps = action.payload.props;
      }
    },
    setShowOpeningWalletModalAction(state, action: PayloadAction<{ showModal: boolean, props?: IOpeningWalletModalProps }>) {
      state.showOpeningWalletModal = action.payload.showModal;
      if (action.payload.props) {
        state.openingWalletModalProps = action.payload.props;
      }
    },
    setShowFundsClaimedModalAction(state, action: PayloadAction<boolean>) {
      state.showFundsClaimedModal = action.payload;
    },
    setShowClaimRejectedModalAction(state, action: PayloadAction<boolean>) {
      state.showClaimRejectedModal = action.payload;
    },
    setShowConnectWalletModalAction(state, action: PayloadAction<boolean>) {
      state.showConnectWalletModal = action.payload;
    },
    setShowLateralMenu(state, action: PayloadAction<boolean>) {
      state.showLateralMenu = action.payload;
    },
    setShowBuySellModal(state, action: PayloadAction<{ showModal: boolean, props?: IBuySellModalProps }>) {
      state.showBuySellModal = action.payload.showModal;
      if (action.payload.props) {
        state.buySellModalProps = action.payload.props;
      }
    },
    setShowOrderPlacedModal(state, action: PayloadAction<{ showModal: boolean, props?: IOrderPlacedModalProps }>) {
      state.showOrderPlacedModal = action.payload.showModal;
      if (action.payload.props) {
        state.orderPlacedModalProps = action.payload.props;
      }
    },
    setShowShareProfileModal(state, action: PayloadAction<{ showModal: boolean, props?: IShareProfileProps }>) {
      state.showShareProfileModal = action.payload.showModal;
      if (action.payload.props) {
        state.shareProfileModalProps = action.payload.props;
      }
    },
    setShowWrongNetworkModal(state, action: PayloadAction<{ showModal: boolean}>) {
      state.showShareProfileModal = action.payload.showModal;
    },
    setShowImportTokenModalAction(state, action: PayloadAction<boolean>) {
      state.showImportTokenModal = action.payload;
    },
    setShowAddFundsCanceledModalAction(state, action: PayloadAction<{ showModal: boolean, props?: IAddFundsCanceledModalProps }>) {
      state.showAddFundsCanceledModal = action.payload.showModal;
      if (action.payload.props) {
        state.addFundsCanceledModalProps = action.payload.props;
      }
    },
    setShowSignRejectedModalAction(state, action: PayloadAction<boolean>){
      state.showSignRejectedModal = action.payload;
    },
    setshowSigningModalAction(state, action: PayloadAction<boolean>){
      state.showSigningModal = action.payload;
    }
  },
});

export const { 
  setShowAddFundsModalAction,
  setShowFundsAddedModalAction,
  setShowClaimFundsModalAction,
  setShowPlanktonModalAction,
  setShowShrimpModalAction,
  setShowCrabModalAction,
  setShowCrabModal2Action,
  setShowCrabModal3AAction,
  setShowCrabModal3BAction,
  setShowCrabModal3CAction,
  setShowBlowFishModalAction,
  setShowOrderRejectedModalAction,
  setShowOpeningWalletModalAction,
  setShowFundsClaimedModalAction,
  setShowClaimRejectedModalAction,
  setShowConnectWalletModalAction,
  setShowLateralMenu,
  setShowBuySellModal,
  setShowOrderPlacedModal,
  setShowShareProfileModal,
  setShowShareFanMatchModalAction,
  setShowImportTokenModalAction,
  setShowWrongNetworkModal,
  setShowAddFundsCanceledModalAction,
  setShowSignRejectedModalAction,
  setshowSigningModalAction,
} = modalSlice.actions;

export default modalSlice.reducer;
