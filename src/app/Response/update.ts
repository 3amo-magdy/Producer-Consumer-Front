export class update{
    idQ:string;
    idM:string;
    qnumber:number;
    mfree:boolean;
    constructor(idQ:string, idM:string,qnumber:number,mfree:boolean){
        this.idQ=idQ;
        this.idM=idM;
        this.qnumber=qnumber;
        this.mfree=mfree;
    }
}