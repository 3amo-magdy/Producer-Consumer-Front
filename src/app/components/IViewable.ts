export class IViewable{
    id!:string;
    x!:number;
    y!:number;
    constructor(id:string,x:number,y:number){
        this.id=id;
        this.x=x;
        this.y=y;
    }
    update(update:any,c?:string,qT?:number):void{
        throw new Error("Method was not implemented");
    }
    move(x:number,y:number){
        this.x=x;
        this.y=y;
    }

}