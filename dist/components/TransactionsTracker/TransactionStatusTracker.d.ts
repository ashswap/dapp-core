import { SignedTransactionsBodyType } from 'types/transactions';
interface TransactionStatusTrackerPropsType {
    sessionId: string;
    transactionPayload: SignedTransactionsBodyType;
}
export declare function TransactionStatusTracker({ sessionId, transactionPayload: { transactions, status, customTransactionInformation } }: TransactionStatusTrackerPropsType): null;
export default TransactionStatusTracker;
