import { IViewable } from "./IViewable";

export class M extends IViewable{
    free!:boolean;
    time!:number
    color!:string;
    constructor(id:string,x:number,y:number,time:number,color?:string){
        super(id,x,y);
        this.time=time;
        this.free=true;
        color=color
    }
    override update(update: any,c?:any): void {
        this.free=update as boolean;
        this.color=c as string;
    }
    turnOff(){
        this.free=true
    }
    getColor():string{
        if(this.free){
            return "rgb(184, 184, 184)";
        }
        else{
            return this.color;
        }
    }
}