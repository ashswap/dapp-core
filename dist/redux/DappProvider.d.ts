import React from 'react';
import { IDappProvider } from '@elrondnetwork/erdjs/out';
import { GetTransactionsByHashesType, SendSignedTransactionsAsyncType } from 'contexts/types';
import { CustomNetworkType, EnvironmentsEnum } from 'types';
interface DappProviderPropsType {
    children: React.ReactChildren | React.ReactElement;
    customNetworkConfig?: CustomNetworkType;
    externalProvider?: IDappProvider;
    environment: 'testnet' | 'mainnet' | 'devnet' | EnvironmentsEnum;
    sendSignedTransactionsAsync?: SendSignedTransactionsAsyncType;
    getTransactionsByHash?: GetTransactionsByHashesType;
}
export declare const DappProvider: ({ children, customNetworkConfig, externalProvider, environment, sendSignedTransactionsAsync, getTransactionsByHash }: DappProviderPropsType) => JSX.Element;
export {};
