export class WalletModel {
    id:number | undefined;
    walletName :string| undefined;
    walletDesc:string | undefined;
    walletType:number | undefined;
    initalCreditedAmt:number | undefined;
    currency:string | undefined
    balanceAmt:number | undefined;
}

export class TransferModel {
    fromwallet :any| undefined;
    towallet:any | undefined;
    amount:number | undefined;
    description:any | undefined;
}