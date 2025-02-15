import { useEffect } from 'react';
import { getTransactionsByHashes as defaultGetTxByHash } from 'apiCalls/transactions';
import {
  useCheckTransactionStatus,
  useGetAccountInfo,
  useRegisterWebsocketListener
} from 'hooks';
import { GetTransactionsByHashesType } from 'types/transactions.types';
import { useClosureRef } from './useClosureRef';

export interface TransactionsTrackerType {
  getTransactionsByHash?: GetTransactionsByHashesType;
}

export function useTransactionsTracker(props?: TransactionsTrackerType) {
  const { address } = useGetAccountInfo();
  const checkTransactionStatus = useCheckTransactionStatus();
  const checkTransactionStatusCallback = useClosureRef(checkTransactionStatus);

  const getTransactionsByHash =
    props?.getTransactionsByHash ?? defaultGetTxByHash;

  const onMessage = () => {
    checkTransactionStatusCallback.current({
      shouldRefreshBalance: true,
      getTransactionsByHash
    });
  };

  useRegisterWebsocketListener({
    onMessage,
    address
  });

  useEffect(() => {
    const interval = setInterval(onMessage, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [onMessage]);
}
