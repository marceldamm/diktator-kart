import type {TrackId} from './track-layout';
/** Original square paving palettes; tile dimensions are in pixels within a four-metre repeat. */
export const COURSE_GROUND:Record<TrackId,{name:string;base:[number,number,number];joint:string;w:number;h:number;offset:boolean;lawn:string;seed:number}>={
 stadionring:{name:'Berlin courtyard brick',base:[155,140,122],joint:'#645d51',w:128,h:64,offset:true,lawn:'#4d653b',seed:1936},
 'duce-drom':{name:'Rome warm travertine',base:[206,193,161],joint:'#8f8574',w:256,h:128,offset:true,lawn:'#6b7044',seed:1922},
 havanna:{name:'Havana coral limestone',base:[209,193,166],joint:'#8d8474',w:128,h:128,offset:false,lawn:'#52733b',seed:1959},
 pyongyang:{name:'Pyongyang cool granite',base:[151,159,159],joint:'#606b6d',w:256,h:128,offset:false,lawn:'#54704b',seed:1948},
 moscow:{name:'Moscow red granite',base:[169,134,123],joint:'#655754',w:128,h:128,offset:false,lawn:'#4d6545',seed:1924},
 beijing:{name:'Peking blue-grey brick',base:[134,146,150],joint:'#596065',w:128,h:64,offset:true,lawn:'#66744a',seed:1949},
};
/** Wrapped paint makes both axes tileable; bounded variation avoids shimmering high contrast grit. */
export function paintCourseGround(c:CanvasRenderingContext2D,id:TrackId,normal=false,road=false):void{
 const p=COURSE_GROUND[id],size=512;let seed=p.seed;
 const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 c.fillStyle=normal?'#8080ff':p.joint;c.fillRect(0,0,size,size);
 for(let row=0;row<size/p.h;row++)for(let col=-1;col<=size/p.w;col++){
  const x=col*p.w+(p.offset&&row%2?p.w/2:0),y=row*p.h,variation=(rnd()-.5)*18;
  const copies=[-size,0,size];
  for(const wrap of copies){const xx=x+wrap;
   const base=road&&id==='moscow'?[169,165,155]:p.base;
   c.fillStyle=normal?'#8080ff':`rgb(${base.map(v=>Math.round(v+variation)).join(',')})`;c.fillRect(xx+2,y+2,p.w-4,p.h-4);
   if(normal){c.fillStyle='#a180f4';c.fillRect(xx+2,y+2,2,p.h-4);c.fillStyle='#5f80f4';c.fillRect(xx+p.w-4,y+2,2,p.h-4);c.fillStyle='#80a1f4';c.fillRect(xx+2,y+2,p.w-4,2);c.fillStyle='#805ff4';c.fillRect(xx+2,y+p.h-4,p.w-4,2);}
   else{c.fillStyle='rgba(255,248,222,.08)';c.fillRect(xx+4,y+4,p.w-8,2);}
  }
 }
 if(!normal){
  for(let i=0;i<900;i++){const x=rnd()*size,y=rnd()*size,w=2+rnd()*5;c.fillStyle=rnd()<.5?'#ffffff18':'#29333416';c.fillRect(x,y,w,1+rnd()*3);}
  for(let i=0;i<12000;i++){const x=rnd()*size,y=rnd()*size;c.fillStyle=rnd()<.5?'#ffffff15':'#202c3419';c.fillRect(x,y,1,1);}
 }
}
