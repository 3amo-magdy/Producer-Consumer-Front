import { IViewable } from "./IViewable";

export class link extends IViewable{
    from:IViewable;
    to:IViewable;
    x0:number
    y0:number
    x1:number
    y1:number
    m0:number
    m1:number
    constructor(f:IViewable,t:IViewable){
        super("",0,0);
        this.from=f;
        this.to=t;
        this.x0=f.x;
        this.y0=f.y;
        this.x1=t.x;
        this.y1=t.y;
        this.m0=(t.x+f.x)/2;
        this.m1=(t.y+f.y)/2;
    }
}