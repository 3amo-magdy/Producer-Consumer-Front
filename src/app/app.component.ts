import { Component, ElementRef, ViewChild } from '@angular/core';
import { IViewable } from './components/IViewable';
import { link } from './components/link';
import { M } from './components/M';
import { mode } from './components/mode';
import { Q } from './components/Q';
import { ControllerService } from './controller.service';
import { update } from './Response/update';
import { WebSocketAPI } from './WebSocket/WebSocketAPI';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'producer-consumer';
  
  @ViewChild('canvas')
  Ecanvas!: ElementRef;
  canvas!:SVGElement;
  webSocketAPI!: WebSocketAPI;
  greeting: any;
  name!: string;
  MODE!:mode;
  selected!:IViewable;

  queues!:Q[];
  services!:M[];
  links!:link[];
  service:ControllerService;
  win:Window;
  txt="";
  selectedQ!:Q;
  constructor(s:ControllerService){
    this.service=s; 
    this.win=window;
  }

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(new AppComponent(this.service));
    this.queues=[];
    this.services=[];
    this.links=[];
    this.MODE=mode.linking;

  }
  ngAfterViewInit(){
    document.addEventListener('keydown',this.KeyDown.bind(this),false);
    
    this.webSocketAPI._connect();
    this.canvas = (this.Ecanvas.nativeElement as SVGElement);

    // this.win.w=window.innerWidth;
    // this.win.h=window.innerHeight;
    // this.win.w=this.win.w-this.getOffset().left-12
    // this.win.h=this.win.h-this.getOffset().top-12
    // this.canvas.setAttribute("width",(this.win.w-this.getOffset().left-12).toString())
    // this.canvas.setAttribute("height",(this.win.h-this.getOffset().top-12).toString())
    // let offx=this.canvas.getBoundingClientRect().x;
    // let offy=this.canvas.getBoundingClientRect().y;

  }
  getOffset(){
    if(this.canvas){
      var bound =this.canvas.getBoundingClientRect();
      var html =document.documentElement;
      return{
        top:bound.top+window.pageYOffset-html.clientTop,
        left:bound.left+window.pageXOffset-html.clientLeft
      }
    }
    else{
      return{
        top:20,
        left:20
      }
      
    }
  }
  select(v:IViewable){
    console.log("selected :");
    console.log(v);
    this.selected=v;
    if(v instanceof M){
      this.MODE=mode.selectingM;
    }
    else if(v instanceof Q){
      this.MODE=mode.selectingQ;
    }
    else{
      this.MODE=mode.selectingLink;
    }
  }
  delete(v:IViewable){
    let arr;
    switch(this.MODE){
      case mode.selectingM:
        this.service.removeM(<M>v).subscribe((data:any)=>{
          console.log(data);
          arr=this.services;
          this.removefromarr(arr,v);
          this.deleteAllLinks(v);
        });
        break;
        
      case mode.selectingQ:
        this.service.removeQ(<Q>v).subscribe((data:any)=>{
          console.log(data);
          arr=this.queues
          this.removefromarr(arr,v);
          this.deleteAllLinks(v);
        });
        break;
      
      case mode.selectingLink:
        if((<link>this.selected).from instanceof Q &&(<link>this.selected).to instanceof M ){
          this.service.delinkQ_M(<Q>(<link>this.selected).from,<M>(<link>this.selected).to).subscribe((data:any)=>{
            console.log(data);
            arr=this.links;
            this.removefromarr(arr,v);
          })
        }
        else if((<link>this.selected).from instanceof M &&(<link>this.selected).to instanceof Q ){
          this.service.delinkM_Q(<M>(<link>this.selected).from).subscribe((data:any)=>{
            console.log(data);
            arr=this.links;
            this.removefromarr(arr,v);
          })
        }
        break;

      default:
        return;
    }
  }
  private removefromarr(arr:IViewable[],v:IViewable){
    for(var i=0;i<arr.length;i++){
      if(v==arr[i]){
        arr.splice(i,1);
        return;
      }
    }
  }
  resetSelection(e:MouseEvent){
    // if(this.MODE==mode.selectingQ||this.MODE==mode.selectingM){
    //   console.log("resetted selection")
    //   this.MODE=mode.linking;
    // }
    if(this.MODE==mode.creatingM){
      console.log("just created a machine")
      this.addM(e);
    }
    else if(this.MODE==mode.creatingQ){
      console.log("just created a queue")
      this.addQ(e);
    }
  }
  setQ(){
    this.MODE=mode.creatingQ;
  }
  setM(){
    this.MODE=mode.creatingM;
  }
  mouseUp(v:IViewable){
    console.log("mouse left:");
    console.log(v);
    console.log("links:");
    console.log(this.links);
    if(this.MODE==mode.selectingM&&v instanceof Q){
      this.service.linkM_Q(<M>this.selected,v).subscribe(data=>{
        console.log(data);
        if(<string>data==="F"){
          window.alert("The Service Already Got a Consumer");
          return;
        }
        else if(<string>data==="S"){
        this.links.push(new link(this.selected,v));
        }
      })
      
    }else if(this.MODE==mode.selectingQ && v instanceof M){
      this.service.linkQ_M(<Q>this.selected,v).subscribe(data=>{
        console.log(data);
        if(<string>data==="F"){
          window.alert("The same queue can't provide and consume the same machine");
          return;
        }
        else if(<string>data==="S"){
        this.links.push(new link(this.selected,v));
        }
      })
    }
    else{
      //do nothing 
    }
  }
  KeyDown(e:KeyboardEvent){
    let keyName = e.key;
    if(e.key==='Delete'||e.key==="D"||e.key==="d"){
      this.delete(this.selected);
    } 
    if(e.key==='m'||e.key==="M"){
      this.MODE=mode.creatingM;
    } 
    if(e.key==='q'||e.key==="Q"){
      this.MODE=mode.creatingQ;
    }
  }
  keyQ(e:MouseEvent,q:Q){
    if(e.shiftKey){
      this.service.setq0(q.id).subscribe(data=>{
        if(this.selectedQ){
          this.selectedQ.color="#84b3bb"
        }
        console.log(data);
        this.selectedQ=q;
        // q.color="#A0b199";
        q.color="deepskyblue";
      });
    }
  }

addQ(ev:MouseEvent){
  this.service.addQ().subscribe((data:any)=>{
    console.log(data);
    let q=new Q(data.id,ev.clientX-this.getOffset().left,ev.clientY-this.getOffset().top);
    this.queues.push(q);
    })
  }
  addM(ev:MouseEvent){
    this.service.addM().subscribe((data:any)=>{
      console.log(data);
      var m=new M(data.id,ev.clientX-this.getOffset().left,ev.clientY-this.getOffset().top,100);
      this.services.push(m);
    })
  }
  connect(){
    this.webSocketAPI._connect();
  }

  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(){
    this.webSocketAPI._send(this.name);
  }

  handleMessage(up:update){
    let q=this.getV(this.queues,up.idQ);
    q.update(up.qnumber);
    let m=this.getV(this.services,up.idM);
    m.update(up.mfree);
  }
  getV(arr:IViewable[], id:string ){
    for (var i=0;i<arr.length;i++) {
      if(arr[i].id===id){
        return arr[i];
      }
    }
    throw new Error("couldn't find the id :"+id);
  }

  deleteAllLinks(v:IViewable){
    for (let index = 0; index < this.links.length; index++) {
      let l = this.links[index];
      if (l.from==v||l.to==v){
        console.log("yes");
        this.links.splice(index,1);
        index--;
      }
    }
  }
  changeRate(e:any){
    if(!this.selectedQ){window.alert("Pick a starting queue first by holding shift while clicking on a queue");return;}
    this.service.setinput(e.target.value).subscribe(data=>{
      console.log(data);    
    });
  }
  start(){
    this.service.start().subscribe(data=>{
      console.log(data);    
    })
  }
  stop(){
    this.service.stop().subscribe(data=>{
      console.log(data);    
    })
  }
  pause(){
    this.service.pause().subscribe(data=>{
      console.log(data);    
    })
  }
  resume(){
    this.service.resume().subscribe(data=>{
      console.log(data);    
    })
  }
}