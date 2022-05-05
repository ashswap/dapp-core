import { PayloadAction } from '@reduxjs/toolkit';
export interface AccountType {
    address: string;
    balance: string;
    nonce: number;
    code?: string;
    username?: string;
}
export interface LedgerAccountType {
    index: number;
    address: string;
    hasContractDataEnabled: boolean;
    version: string;
}
export interface UpdateLedgerAccountPayloadType {
    index: number;
    address: string;
}
export interface AccountInfoSliceType {
    address: string;
    shard?: number;
    account: AccountType;
    publicKey: string;
    ledgerAccount: LedgerAccountType | null;
    walletConnectAccount: string | null;
    isAccountLoading: boolean;
    accountLoadingError: string | null;
}
export declare const emptyAccount: AccountType;
export declare const accountInfoSlice: import("@reduxjs/toolkit").Slice<AccountInfoSliceType, {
    setAddress: (state: AccountInfoSliceType, action: PayloadAction<string>) => void;
    setAccount: (state: AccountInfoSliceType, action: PayloadAction<AccountType>) => void;
    setAccountNonce: (state: AccountInfoSliceType, action: PayloadAction<number>) => void;
    setAccountShard: (state: AccountInfoSliceType, action: PayloadAction<number>) => void;
    setLedgerAccount: (state: AccountInfoSliceType, action: PayloadAction<LedgerAccountType | null>) => void;
    updateLedgerAccount: (state: AccountInfoSliceType, action: PayloadAction<UpdateLedgerAccountPayloadType>) => void;
    setWalletConnectAccount: (state: AccountInfoSliceType, action: PayloadAction<string | null>) => void;
    setIsAccountLoading: (state: AccountInfoSliceType, action: PayloadAction<boolean>) => void;
    setAccountLoadingError: (state: AccountInfoSliceType, action: PayloadAction<string | null>) => void;
}, "accountInfoSlice">;
export declare const setAccount: import("@reduxjs/toolkit").ActionCreatorWithPayload<AccountType, string>, setAddress: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, string>, setAccountNonce: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, string>, setAccountShard: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, string>, setLedgerAccount: import("@reduxjs/toolkit").ActionCreatorWithPayload<LedgerAccountType | null, string>, updateLedgerAccount: import("@reduxjs/toolkit").ActionCreatorWithPayload<UpdateLedgerAccountPayloadType, string>, setWalletConnectAccount: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, string>, setIsAccountLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, string>, setAccountLoadingError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, string>;
declare const _default: import("redux").Reducer<AccountInfoSliceType, import("redux").AnyAction>;
export default _default;
