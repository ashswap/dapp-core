import { Transaction } from '@elrondnetwork/erdjs';
import { ActiveLedgerTransactionType, MultiSignTxType } from 'types';
interface UseSignTransactionsWithLedgerPropsType {
    onCancel: () => void;
    verifyReceiverScam?: boolean;
}
declare type LedgerSignedTransactions = Record<number, Transaction>;
interface UseSignTransactionsWithLedgerReturnType {
    allTransactions: MultiSignTxType[];
    onSignTransaction: () => void;
    onNext: () => void;
    onPrev: () => void;
    onAbort: () => void;
    waitingForDevice: boolean;
    isLastTransaction: boolean;
    currentStep: number;
    callbackRoute?: string;
    signedTransactions?: LedgerSignedTransactions;
    currentTransaction: ActiveLedgerTransactionType | null;
}
export declare function useSignTransactionsWithLedger({ onCancel, verifyReceiverScam }: UseSignTransactionsWithLedgerPropsType): UseSignTransactionsWithLedgerReturnType;
export default useSignTransactionsWithLedger;
