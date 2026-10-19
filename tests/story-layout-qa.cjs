'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const widths = [
  {name:'desktop',width:1440,height:900},
  {name:'laptop',width:1280,height:800},
  {name:'tablet',width:768,height:1024},
  {name:'phone',width:390,height:844},
  {name:'small-phone',width:360,height:740},
  {name:'narrow-phone',width:320,height:680}
];
const base = process.env.QA_URL || 'http://127.0.0.1:8765';
const output = path.resolve('visual-qa-screenshots');
fs.mkdirSync(output,{recursive:true});
const findings = [];
const record=(type,name,details)=>findings.push({type,name,...details});
const pause = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 try {
  for(const v of widths){
   const ctx=await browser.newContext({viewport:{width:v.width,height:v.height},deviceScaleFactor:1,reducedMotion:'reduce',isMobile:false});
   const page=await ctx.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});
   await page.locator('#story-deck').scrollIntoViewIfNeeded({timeout:20000});
   await page.waitForTimeout(450);
   await page.screenshot({path:path.join(output,v.name+'-story-cards.png')});
   const firstCard=await page.locator('.story-card.is-active').count();
   if(!firstCard)record('error',v.name,{reason:'No active story card'});
   for(let i=0;i<5;i++){
    try{
     await page.locator('.story-card.is-active').click({force:true,timeout:6500});
     await page.waitForTimeout(250);
     const info=await page.evaluate(()=>{
       const viewer=document.querySelector('#story-viewer');
       const a=document.querySelector('#viewer-public-story');
       const photo=document.querySelector('#viewer-photo');
       const image=document.querySelector('#viewer-image');
       const r=el=>{const x=el?.getBoundingClientRect();return x?{x:x.x,y:x.y,width:x.width,height:x.height,right:x.right,bottom:x.bottom}:null};
       const articleStyle=a?getComputedStyle(a):null;
       return {open:viewer?.classList.contains('is-open'),title:document.querySelector('#viewer-public-name')?.textContent,
         isText:viewer?.classList.contains('is-text-chapter'),
         imageNatural:image?.naturalWidth||0,imageHidden:image?.hidden,
         photo:r(photo),article:r(a),
         articleHeight:a?.scrollHeight,articleClient:a?.clientHeight,
         articleScroll:articleStyle?.overflowY,
         innerWidth:innerWidth,innerHeight:innerHeight,
         bodyOver:document.documentElement.scrollWidth-innerWidth};
     });
     record('scene',v.name+'-'+i,info);
     await page.screenshot({path:path.join(output,v.name+'-viewer-'+i+'.png')});
     if(!info.open)record('error',v.name+'-'+i,{reason:'Viewer did not open'});
     if(!info.article||info.article.width<90)record('error',v.name+'-'+i,{reason:'Story text panel too narrow'});
     else if(info.article.x < -5 || info.article.right > v.width+5)record('error',v.name+'-'+i,{reason:'Story text exceeds viewport'});
     if(info.articleHeight>info.articleClient+4 && info.articleScroll!=='auto' && info.articleScroll!=='scroll')
       record('error',v.name+'-'+i,{reason:'Story text is clipped without scroll'});
     if(info.photo && !info.isText && (info.photo.x<-5||info.photo.right>v.width+5))
       record('error',v.name+'-'+i,{reason:'Portrait or document beyond viewport'});
     if((i===0||i===2)&&!info.imageNatural)record('error',v.name+'-'+i,{reason:'Historic image failed to load'});
     await page.locator('#viewer-close').click({force:true,timeout:6500});
     await page.waitForTimeout(80);
     if(i<4)await page.locator('#deck-next').click({force:true,timeout:6500});
    }catch(e){
     record('error',v.name+'-'+i,{reason:String(e).slice(0,400)});
     try{await page.locator('#viewer-close').click({force:true,timeout:1500});}catch(_){}
    }
   }
   for(const section of ['community','resources','submit']){
    try{
      await page.locator('#'+section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      await page.screenshot({path:path.join(output,v.name+'-'+section+'.png')});
      const rect=await page.locator('#'+section).boundingBox();
      record('section',v.name+'-'+section,{rect});
    }catch(e){record('error',v.name+'-'+section,{reason:String(e).slice(0,300)})}
   }
   if(errors.length)record('console',v.name,{errors:errors.slice(0,10)});
   await ctx.close();
  }
 }finally{await browser.close();}
 const summary={tested:widths,issues:findings.filter(x=>x.type==='error'),notes:findings};
 fs.writeFileSync(path.join(output,'layout-audit.json'),JSON.stringify(summary,null,2));
 console.log('QA screenshots:',output);
 console.log('Hard layout failures:',summary.issues.length);
 for(const item of summary.issues)console.error(item.name,item.reason);
 if(summary.issues.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
