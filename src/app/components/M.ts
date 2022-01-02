import { IViewable } from "./IViewable";

export class M extends IViewable{
    free!:boolean;
    time!:number
    constructor(id:string,x:number,y:number,time:number){
        super(id,x,y);
        this.time=time;
        this.free=true;
    }
    override update(update: any): void {
        this.free=update as boolean;
    }
    getColor():string{
        if(this.free){
            return "green";
        }
        else{
            return "red";
        }
    }
}