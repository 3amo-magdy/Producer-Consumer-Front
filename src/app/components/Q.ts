import { IViewable } from "./IViewable";

export class Q extends IViewable{
    qnumber!:number;
    constructor(id:string,x:number,y:number){
        super(id,x,y);
    }
    override update(update: any): void {
        this.qnumber+=update as number;
    }
}