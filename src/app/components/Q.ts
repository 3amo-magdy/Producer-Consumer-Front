import { IViewable } from "./IViewable";

export class Q extends IViewable{
    qnumber!:number;
    color:string;
    constructor(id:string,x:number,y:number){
        super(id,x,y);
        this.qnumber=0;
        this.color="#84b3bb";
    }
    override update(update: any,qT?:any): void {
        this.qnumber=qT as number;
        
    }
}