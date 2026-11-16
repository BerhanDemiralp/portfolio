// The cream robot rig and pose curves from the animation preview.
export function mountResidentRig(robot) {
 robot.innerHTML=`<svg viewBox="0 0 160 200"><defs><linearGradient id="cream" x2=".7" y2="1"><stop stop-color="#fff6dd"/><stop offset=".6" stop-color="#e7dcba"/><stop offset="1" stop-color="#b9ad8a"/></linearGradient><linearGradient id="mint" x2=".5" y2="1"><stop stop-color="#c4e4b8"/><stop offset="1" stop-color="#7fa88e"/></linearGradient><linearGradient id="visor" x2=".8" y2="1"><stop stop-color="#354847"/><stop offset="1" stop-color="#122526"/></linearGradient></defs>
<ellipse id="shadow" cx="80" cy="185" rx="32" ry="6" fill="#071312" opacity=".4"/>
<g id="orientation"><g id="legL"><path d="M67 145L65 174" stroke="#40534a" stroke-width="10" stroke-linecap="round"/><path d="M53 178Q53 166 65 167Q78 169 77 181L56 182Q52 182 53 178" fill="url(#cream)"/><path d="M55 181H76" stroke="#8b856c" stroke-width="3" stroke-linecap="round"/></g>
<g id="legR"><path d="M93 145L95 174" stroke="#40534a" stroke-width="10" stroke-linecap="round"/><path d="M83 178Q84 167 95 167Q108 167 108 181L86 182Q82 182 83 178" fill="url(#cream)"/><path d="M86 181H106" stroke="#8b856c" stroke-width="3" stroke-linecap="round"/></g>
<g id="body"><g id="armL"><path d="M56 120Q43 129 43 147" fill="none" stroke="#44564b" stroke-width="8" stroke-linecap="round"/><ellipse cx="42" cy="148" rx="8" ry="11" fill="url(#cream)"/></g><g id="armR"><path d="M104 120Q117 129 117 147" fill="none" stroke="#44564b" stroke-width="8" stroke-linecap="round"/><ellipse cx="118" cy="148" rx="8" ry="11" fill="url(#cream)"/></g>
<path d="M57 113Q80 106 103 113L105 140Q103 155 80 156Q57 154 55 140Z" fill="url(#mint)" stroke="#283f36" stroke-width="2"/><path d="M64 117Q80 121 96 117" fill="none" stroke="#e1f2ce" stroke-width="2" opacity=".7"/><rect x="73" y="137" width="14" height="4" rx="2" fill="#34584b"/><circle cx="91" cy="139" r="2" fill="#e8bc67"/>
<g id="head"><rect x="68" y="105" width="24" height="13" rx="6" fill="#53695a"/><ellipse cx="34" cy="72" rx="9" ry="17" fill="#c49e5c"/><ellipse cx="126" cy="72" rx="9" ry="17" fill="#c49e5c"/><ellipse cx="35" cy="71" rx="4" ry="12" fill="#ffe0a1"/><ellipse cx="125" cy="71" rx="4" ry="12" fill="#ffe0a1"/><path d="M80 24C109 24 128 45 128 74C128 103 109 115 80 115C51 115 32 103 32 74C32 45 51 24 80 24Z" fill="url(#cream)"/><g id="screen"><path d="M43 66Q45 43 80 43Q115 43 117 66L116 82Q114 101 80 102Q46 101 44 82Z" fill="url(#visor)"/><path d="M50 60Q58 49 77 50" fill="none" stroke="#a0b7a5" stroke-width="3" stroke-linecap="round" opacity=".2"/><g id="face"><g id="eyes"><ellipse cx="63" cy="74" rx="7" ry="8" fill="#b0f1c3"/><ellipse cx="97" cy="74" rx="7" ry="8" fill="#b0f1c3"/></g><path d="M76 91Q80 94 84 91" stroke="#9cdab3" fill="none" stroke-width="2" stroke-linecap="round"/></g></g><path d="M48 42Q64 28 87 31" stroke="#fffbea" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/></g></g></g><g id="curiosity-marks" opacity="0" fill="#c4e9c8" font-family="system-ui,sans-serif" font-weight="650"><text x="113" y="19" font-size="25" transform="rotate(-12 113 19)">?</text><text x="137" y="37" font-size="18" fill="#f1c576" transform="rotate(14 137 37)">?</text></g></svg>`;
 const parts=Object.fromEntries(
  ['orientation','screen','head','body','face','eyes','armL','armR','legL','legR','shadow']
   .map(id=>[id,robot.querySelector('#'+id)])
 );
 const curiosityMarks=robot.querySelector('#curiosity-marks');
 let phase=0,runWeight=0,walkWeight=0,poseIndex=0,look=0,tilt=0;
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 const smooth=(a,b,k,dt)=>a+(b-a)*(1-Math.exp(-k*dt));
 const easePose=value=>{const t=clamp(value,0,1);return t*t*t*(t*(t*6-15)+10)};
 const waveDuration=2,standDuration=1.15,stretchDuration=3.15;
const svgNS='http://www.w3.org/2000/svg';
function limb(part,x,far=false,side=false){
 const leg=part.startsWith('leg'),y=leg?148:122,out=x<80?-1:1;
 return `<g data-part="${part}" data-pivot="${x} ${y}">
 <path data-bone d="M${x} ${y} Q${x+(leg?1:out*5)} ${y+11} ${x+(leg?0:out*6)} ${y+(leg?24:20)}" fill="none" stroke="${far?'#34483f':'#506456'}" stroke-width="${leg?8:7}" stroke-linecap="round"/>
 ${leg?`<g data-foot><path d="M${x-8} 176 Q${x-9} 169 ${x} 169 Q${x+10} 169 ${x+(side?17:10)} 178 L${x+(side?17:10)} 182 L${x-8} 182Z" fill="url(#cream)"/><path d="M${x-7} 182H${x+(side?16:9)}" stroke="#8b856c" stroke-width="3" stroke-linecap="round"/></g>`:`<ellipse cx="${x+out*6}" cy="145" rx="7" ry="9" fill="url(#cream)"/>`}
 </g>`;
}
const profileHead=`<path d="M79 25C104 25 119 43 121 65L124 81Q122 106 94 113L68 111Q42 105 40 79Q37 45 60 30Z" fill="url(#cream)"/>
 <path d="M98 44Q116 48 119 66L120 84Q117 99 100 102Q94 81 98 44Z" fill="url(#visor)"/>
 <g data-eyes><ellipse cx="111" cy="74" rx="4.8" ry="7.5" fill="#b0f1c3"/></g><path d="M112 91L115 90" stroke="#9cdab3" stroke-width="2" stroke-linecap="round"/>
 <ellipse cx="65" cy="75" rx="18" ry="20" fill="#a58e59"/><ellipse cx="65" cy="74" rx="14" ry="16" fill="#efd49a"/><ellipse cx="65" cy="74" rx="9" ry="11" fill="#c7a866"/><path d="M59 62Q66 57 73 65" fill="none" stroke="#fff0ca" stroke-width="2"/>
 <path d="M49 48Q59 30 83 32" fill="none" stroke="#fffbea" stroke-width="3" opacity=".7"/>`;
const rearHead=`<ellipse cx="34" cy="72" rx="8" ry="16" fill="#c5a466"/><ellipse cx="126" cy="72" rx="8" ry="16" fill="#c5a466"/>
 <path d="M80 24C109 24 128 45 128 74C128 103 109 115 80 115C51 115 32 103 32 74C32 45 51 24 80 24Z" fill="url(#cream)"/>
 <path d="M50 44Q80 34 110 44M45 86Q80 100 115 86" fill="none" stroke="#b5a989" stroke-width="1.5" opacity=".65"/>
 <rect x="65" y="76" width="30" height="17" rx="7" fill="#c8bd9c"/><path d="M71 81H89M71 86H89" stroke="#968d72" stroke-width="2" stroke-linecap="round"/><circle cx="80" cy="102" r="2.5" fill="#a9e8ba"/>
 <path d="M48 42Q64 28 87 31" stroke="#fffbea" stroke-width="3" fill="none" opacity=".6"/>`;
const quarterHead=`<ellipse cx="123" cy="72" rx="6" ry="15" fill="#c49e5c"/>
 <path d="M79 24Q119 26 126 63Q134 97 108 111Q86 120 61 109Q35 98 36 70Q36 32 79 24Z" fill="url(#cream)"/>
 <path d="M76 44Q106 39 119 60Q128 82 115 97Q98 108 75 98Q60 87 64 66Q66 51 76 44Z" fill="url(#visor)"/>
 <g data-eyes><ellipse cx="83" cy="74" rx="6.6" ry="8" fill="#b0f1c3"/><ellipse cx="111" cy="73" rx="4.5" ry="7" fill="#b0f1c3"/></g>
 <path d="M95 92Q99 94 102 91" fill="none" stroke="#9cdab3" stroke-width="2"/>
 <ellipse cx="45" cy="74" rx="12" ry="18" fill="#b3955e"/><ellipse cx="45" cy="74" rx="8" ry="13" fill="#f0d39a"/>
 <path d="M48 43Q61 29 84 31" stroke="#fffbea" stroke-width="3" fill="none" opacity=".6"/>`;
const rearQuarterHead=`<path d="M78 24Q112 25 123 57Q135 90 112 108Q89 121 62 111Q37 99 37 72Q36 36 78 24Z" fill="url(#cream)"/>
 <path d="M53 43Q82 34 109 44M48 87Q74 99 99 90" fill="none" stroke="#b5a989" stroke-width="1.5"/>
 <path d="M62 78Q74 73 85 77L87 89Q74 94 63 88Z" fill="#c8bd9c"/><path d="M68 81L81 80M68 86L81 85" stroke="#968d72" stroke-width="2"/>
 <ellipse cx="111" cy="75" rx="14" ry="19" fill="#ac915b"/><ellipse cx="111" cy="74" rx="10" ry="14" fill="#efd49a"/>
 <path d="M49 43Q64 30 84 31" stroke="#fffbea" stroke-width="3" fill="none" opacity=".6"/>`;
const openQuarterHead=`<ellipse cx="127" cy="73" rx="6" ry="12" fill="#b3955e"/>
 <path d="M80 24C108 24 128 44 128 74C128 102 110 115 82 115C54 115 34 103 34 75C34 46 52 24 80 24Z" fill="url(#cream)"/>
 <path d="M49 66Q53 43 86 43Q116 44 120 65L119 83Q115 101 87 102Q56 101 51 84Z" fill="url(#visor)"/>
 <g data-eyes fill="#b0f1c3"><ellipse cx="72" cy="74" rx="7" ry="8"/><ellipse cx="102" cy="73" rx="6" ry="7.5"/></g>
 <path d="M83 91Q87 94 91 91" fill="none" stroke="#9cdab3" stroke-width="2" stroke-linecap="round"/>
 <path d="M49 42Q65 29 87 31" fill="none" stroke="#fffbea" stroke-width="3" opacity=".6"/>
 <g>
  <ellipse cx="35" cy="73" rx="10" ry="16" fill="#a78954"/>
  <ellipse cx="34" cy="73" rx="7" ry="13" fill="#efd49a"/>
  <ellipse cx="34" cy="73" rx="3.5" ry="8" fill="#d5b577"/>
 </g>`;
function directionRig(index, style = 'original'){
 const profile=index===2||index===6,rear=index===4,backQuarter=index===3||index===5,left=index>=5;
 const nearX=profile?78:rear?96:65,farX=profile?88:rear?64:95;
 const torso=profile?'M66 112Q82 107 99 114L100 142Q94 155 73 154L64 143Z':'M58 113Q81 107 102 115L105 140Q99 155 79 156Q58 153 55 139Z';
 const shell=profile?profileHead:rear?rearHead:backQuarter?rearQuarterHead:style==='open'?openQuarterHead:quarterHead;
 const backPanel=rear||backQuarter?'<rect x="67" y="122" width="25" height="24" rx="6" fill="#6f9480" stroke="#a8ccb0"/><path d="M73 129H86M73 134H86" stroke="#395d4c" stroke-width="2"/><circle cx="80" cy="141" r="2" fill="#d8bf7c"/>':'<path d="M79 137H91" stroke="#34584b" stroke-width="4" stroke-linecap="round"/>';
 const view=document.createElementNS(svgNS,'g');view.id=`pose-${index}-${style}`;view.style.display='none';
 view.innerHTML=`<g ${left?'transform="translate(160 0) scale(-1 1)"':''}>
 ${limb('legFar',farX,true,profile)}<g data-part="torso">
 ${limb('armFar',profile?96:102,true)}
 <path d="${torso}" fill="url(#mint)" stroke="#283f36" stroke-width="2"/>${backPanel}
 </g>${limb('legNear',nearX,false,profile)}<g data-part="upper">
 <rect x="70" y="106" width="22" height="10" rx="5" fill="#53695a"/>
 <g data-part="head">${shell}</g>${limb('armNear',profile?72:56)}
 </g></g>`;
 robot.querySelector('svg').append(view);return view;
}
const directionViews=Array.from({length:7},(_,i)=>directionRig(i+1));
// Each foot has a planted phase and a lifted return phase. The ankle stays
// level during ground contact; two leg segments follow it instead of rotating the shoe.
parts.legL.innerHTML=limb('legFrontL',65);
parts.legR.innerHTML=limb('legFrontR',95);
for(const leg of [parts.legL,parts.legR]){
 const foot=leg.querySelector('[data-foot]');
 const hip=Number(foot.parentElement.dataset.pivot.split(' ')[0]);
 const sole=document.createElementNS(svgNS,'g');
 sole.setAttribute('data-sleep-sole','');
 sole.setAttribute('opacity','0');
 sole.setAttribute('transform',`translate(${hip} 176)`);
 sole.innerHTML='<rect x="-8" y="-10" width="16" height="19" rx="6" fill="url(#cream)" stroke="#b9ad8a" stroke-width="1.2"/><circle cx="0" cy="0" r="4.2" fill="#827964" opacity=".24"/>';
 foot.append(sole);
}

const openViews = {1: directionRig(1, 'open'), 7: directionRig(7, 'open')};
function footCycle(offset){
 const u=((phase/(Math.PI*2)+offset)%1+1)%1;
 const contact=.62-.19*runWeight;
 if(u<contact){
  const t=u/contact;
  return {reach:1-2*t,lift:0,roll:-13*Math.max(0,1-t*5)+19*Math.max(0,(t-.75)*4),knee:0};
 }
 const t=(u-contact)/(1-contact),e=t*t*(3-2*t),lift=Math.sin(Math.PI*t);
 return {reach:-1+2*e,lift:lift*(11+6*runWeight),roll:19-32*e,knee:lift*7};
}
function placeFoot(part,offset,sideways){
 const hip=Number(part.dataset.pivot.split(' ')[0]),c=footCycle(offset);
 const dx=c.reach*(21+5*runWeight)*sideways*walkWeight;
 const dy=(-c.lift+c.reach*2*(1-sideways))*walkWeight;
 const angle=c.roll*sideways*walkWeight;
 // Keep the contacting edge of the sole above the floor as the shoe rolls.
 const soleLift=c.lift===0?Math.abs(Math.sin(angle*Math.PI/180))*9:0;
 const ax=hip+dx,ay=174+dy-soleLift;
 const kx=hip+dx*.48+c.knee*sideways*walkWeight,ky=(148+ay)/2;
 part.querySelector('[data-bone]').setAttribute('d',`M${hip} 148Q${kx} ${ky} ${ax} ${ay}`);
 part.querySelector('[data-foot]').setAttribute('transform',`translate(${dx} ${dy-soleLift}) rotate(${angle} ${hip} 182)`);
}
function animateDirections(swing,bob,inspectCurve,index=poseIndex){
 const view=openViews[index] || directionViews[index-1];
 if(!view)return;
 const side=index===1||index===7?.78:index===2||index===6?1:0;
 for(const name of ['torso','upper'])view.querySelector(`[data-part="${name}"]`).setAttribute('transform',`translate(${swing*.4} ${bob}) rotate(${swing*.9+runWeight*(poseIndex>4?-7:7)} 80 149)`);
 placeFoot(view.querySelector('[data-part="legNear"]'),0,side);
 placeFoot(view.querySelector('[data-part="legFar"]'),.5,side);
 for(const [name,offset] of [['armNear',0],['armFar',.5]]){
  const part=view.querySelector(`[data-part="${name}"]`),pivot=part.dataset.pivot;
  part.setAttribute('transform',`rotate(${Math.cos(phase+offset*Math.PI*2)*walkWeight*(19+12*runWeight)} ${pivot})`);
 }
 const head=view.querySelector('[data-part="head"]');
 head.setAttribute('transform',`rotate(${-7*inspectCurve} 80 108)`);
}
const sleepMouth=parts.face.querySelector('path');
const yawnMouth=document.createElementNS(svgNS,'ellipse');
for(const [name,value] of Object.entries({cx:80,cy:90,fill:'#9cdab3',opacity:0})){
 yawnMouth.setAttribute(name,String(value));
}
parts.face.append(yawnMouth);
const frontRightArm={path:parts.armL.querySelector('path'),palm:parts.armL.querySelector('ellipse'),mirror:''};
const frontLeftArm={path:parts.armR.querySelector('path'),palm:parts.armR.querySelector('ellipse'),mirror:'translate(160 0) scale(-1 1) '};
frontLeftArm.path.setAttribute('transform',frontLeftArm.mirror);
frontLeftArm.palm.setAttribute('cx','42');

function poseRaisedArm({path,palm,mirror},lift,forearmSwing=0){
 const elbowX=46.25-8.25*lift;
 const elbowY=131.25-17.25*lift;
 const waveAngle=.18*forearmSwing;
 const forearmX=43-12*lift-elbowX;
 const forearmY=147-42*lift-elbowY;
 const sine=Math.sin(waveAngle);
 const cosine=Math.cos(waveAngle);
 const wristX=elbowX+forearmX*cosine-forearmY*sine;
 const wristY=elbowY+forearmX*sine+forearmY*cosine;
 const controlX=43-5*lift-elbowX;
 const controlY=138-19*lift-elbowY;
 path.setAttribute('d',lift>0
  ? `M56 120 C${51.67-2*lift} ${123-2*lift} ${elbowX+2.17+2.83*lift} ${elbowY-4.5+9.5*lift} ${elbowX} ${elbowY} C${elbowX-2.17-2.83*lift} ${elbowY+4.5-9.5*lift} ${elbowX+(controlX+forearmX)*.5*cosine-(controlY+forearmY)*.5*sine} ${elbowY+(controlX+forearmX)*.5*sine+(controlY+forearmY)*.5*cosine} ${wristX} ${wristY}`
  : 'M56 120Q43 129 43 147');
 palm.setAttribute('transform',`${mirror}translate(${wristX-43} ${wristY-147}) rotate(${-10*lift+waveAngle*180/Math.PI} 42 148)`);
}
 return function draw({time,dt,still,sleeping,waking,moving,action,elapsed,heading,
  direction,stepPhase,walk,run,wakeSeatedPose}) {
  phase=stepPhase; walkWeight=walk; runWeight=run; poseIndex=heading;
  const cornerPhase=action==='inspect';
  const curiosity=action==='curious';
  const pointLeft=action==='point-left';
  const pointing=(action==='point-right'||pointLeft)&&!still;
  const pointReach=pointing?easePose(elapsed/.45)*(1-easePose((elapsed-1.95)/.45)):0;
  const pointBeat=clamp((elapsed-.15)/1.8,0,1);
  const pointAngle=pointReach*(32+8*(1-Math.cos(4*Math.PI*pointBeat)));
  const inspect=cornerPhase||curiosity;
  const standardInspection=curiosity;
  const inspectCurve=curiosity?Math.sin(Math.PI*elapsed/2.7):0;
  const wakeElapsed=waking?elapsed:0;
  const sleepStart=time-(sleeping?elapsed:0);
  const waveStart=action==='wave'?time-elapsed:-Infinity;
const stretchTime=wakeElapsed-standDuration;
// Reach continuously, hold overhead, then lower both arms.
const wakeStretch=waking?easePose(stretchTime/1.35)*easePose((stretchDuration-stretchTime)/1.05):0;
const stretchEyeClose=waking
 ? easePose((stretchTime-.85)/.55)*(1-easePose((stretchTime-2.05)/.55)):0;
const sleepElapsed=time-sleepStart;
const sitProgress=sleeping?clamp(sleepElapsed/.23,0,1)**2:waking?wakeSeatedPose*(1-easePose(wakeElapsed/standDuration)):0;
const sitSettle=sleeping&&sleepElapsed>.23
 ? 2*Math.sin(Math.PI*easePose((sleepElapsed-.23)/.24)):0;
const sleepCycle=sleepElapsed%12;
const sleepStir=sleeping
 ? easePose((sleepCycle-4.8)/1.45)*(1-easePose((sleepCycle-6.25)/2.1)):0;
const sleepyHeadSway=sleeping?.45*Math.sin(sleepElapsed*1.35)*easePose((sleepElapsed-.23)/.6):0;
const seatedDrop=26*sitProgress-sitSettle;
const waveElapsed=time-waveStart;
const waving=!still&&!moving&&waveElapsed>=0&&waveElapsed<waveDuration;
const waveLift=waving?easePose(waveElapsed/.45)*easePose((waveDuration-waveElapsed)/.5):0;
const waveSwing=waving?waveLift*Math.sin(Math.PI*2*(waveElapsed-.45)*2.3):0;
const cornerLean=cornerPhase?.55*easePose((elapsed-.12)/.88)*(1-easePose((elapsed-1.65)/1.05)):0;
const cornerGaze=cornerPhase?.6*easePose(elapsed/.65)*(1-easePose((elapsed-1.8)/.9)):0;
const curiosityLift=curiosity?easePose(elapsed/.65)*(1-easePose((elapsed-1.9)/.8)):0;
const marksLift=curiosity?easePose((elapsed-.48)/.45)*(1-easePose((elapsed-1.95)/.6)):0;
curiosityMarks.setAttribute('opacity',String(marksLift));
curiosityMarks.setAttribute('transform',`translate(0 ${4*(1-marksLift)})`);
look=smooth(look,still||sleeping?0:moving?direction*5:standardInspection?5:Math.sin(time*.45)*1.4,5,dt);
tilt=smooth(tilt,standardInspection?-9*inspectCurve:moving?direction*.6:0,5,dt);
if(still||cornerPhase||curiosity||pointing||waving||sleeping||waking)poseIndex=0;
const currentView=poseIndex;
const openView=openViews[currentView];
parts.orientation.style.display=currentView===0?'':'none';
directionViews.forEach((view,index)=>{
 view.style.display=!openView&&index+1===currentView?'':'none';
});
Object.values(openViews).forEach(view=>{
 view.style.display=view===openView?'':'none';
});
robot.dataset.facing=['front','front-right','right','back-right','back','back-left','left','front-left'][poseIndex];
const swing=Math.sin(phase)*walkWeight,bob=-(Math.cos(phase)**2)*(1.5+4*runWeight)*walkWeight;const resting=!still&&!moving&&!inspect&&!pointing&&!waving&&!sleeping&&!waking;
const idleSway=resting?Math.sin(time*1.6):0;
const breath=sleeping?.22*Math.sin(sleepElapsed*1.35)*easePose((sleepElapsed-.23)/.6)-1.35*sleepStir:still?0:Math.sin(time*1.7)*(resting?1.05:.45)*(1-walkWeight);
const eyeOpen=sleeping?.12+.07*sleepStir:waking
 ? (.12+.38*easePose(wakeElapsed/standDuration)+.5*easePose((stretchTime-2.05)/.85))*(1-.76*stretchEyeClose)
 : 1;
parts.eyes.setAttribute('transform',`translate(0 ${74*(1-eyeOpen)}) scale(1 ${eyeOpen})`);
sleepMouth.setAttribute('opacity',String(sleeping?0:1-wakeStretch));
yawnMouth.setAttribute('opacity',String(wakeStretch));
yawnMouth.setAttribute('rx',String(4*wakeStretch));
yawnMouth.setAttribute('ry',String(6*wakeStretch));
const waistY=149;
const upperBodyRoll=swing*.9+runWeight*(poseIndex>4?-7:7)+4*cornerLean+idleSway*.9-4*wakeStretch;
// Shift the hips back while the chest folds forward over the planted feet.
const upperBodyWidth=Math.cos(cornerLean*22*Math.PI/180);
parts.body.setAttribute('transform',`translate(${swing*.4+6*cornerLean+3*waveLift} ${bob+breath+2*cornerLean+seatedDrop-2*wakeStretch}) rotate(${upperBodyRoll} 80 ${waistY}) translate(80 ${waistY}) skewX(${16*cornerLean}) skewY(${-3*cornerLean}) scale(${upperBodyWidth} ${1-.08*cornerLean}) translate(-80 ${-waistY})`);
// Forward nod: lower the head and foreshorten it vertically, exposing more crown.
// Cancel the torso roll at the neck so the head cannot arc backwards.
const headPitch=1-.13*cornerGaze-.05*sitProgress+.035*sleepStir;
parts.head.setAttribute('transform',`translate(${-5*cornerGaze+waveLift} ${11*cornerGaze+4*sitProgress-2.6*sleepStir}) rotate(${tilt-4*cornerLean-idleSway*.6+sleepyHeadSway-1.8*sleepStir} 80 108) translate(80 74) scale(1 ${headPitch}) translate(-80 -74)`);
const visorWidth=1-.07*cornerGaze;
const visorHeight=1-.14*cornerGaze;
parts.screen.setAttribute('transform',`translate(${80*(1-visorWidth)-5*cornerGaze} ${74*(1-visorHeight)+8*cornerGaze-1.5*sleepStir}) scale(${visorWidth} ${visorHeight})`);
parts.face.setAttribute('transform',`translate(${look-5*cornerGaze+(pointLeft?-4:4)*pointReach} ${4*cornerGaze-inspectCurve*2-curiosityLift*3+2*pointReach})`);
// The raised right hand stays in front of the head throughout the wave.
if(waving&&parts.armL!==parts.body.lastElementChild){
 parts.body.append(parts.armL);
}else if(!waving&&parts.armL===parts.body.lastElementChild){
 parts.body.prepend(parts.armL);
}
poseRaisedArm(frontRightArm,waving?waveLift:wakeStretch,waveSwing);
poseRaisedArm(frontLeftArm,wakeStretch);
parts.armL.setAttribute('transform',`rotate(${-swing*13+12*cornerLean+idleSway*.9-5*sitProgress+(pointLeft?pointAngle:0)} 55 120)`);
parts.armR.setAttribute('transform',`rotate(${swing*13+19*cornerLean-idleSway*.9-5*waveLift+5*sitProgress-(pointLeft?0:pointAngle)} 105 120)`);
// Draw the extended shoes in front of the seated body.
if(sleeping&&sitProgress>0&&parts.orientation.lastElementChild===parts.body){
 parts.orientation.append(parts.legL,parts.legR);
}else if((!sleeping||sitProgress===0)&&parts.orientation.lastElementChild!==parts.body){
 parts.orientation.append(parts.body);
}
for(const [leg,offset] of [[parts.legL,0],[parts.legR,.5]]){
 const limb=leg.querySelector('[data-part]');
 placeFoot(limb,offset,0);
 const sole=limb.querySelector('[data-sleep-sole]');
 const footExtension=waking?wakeSeatedPose*(1-easePose(wakeElapsed/.4)):sitProgress;
 const soleReveal=clamp((footExtension-.3)/.7,0,1);
 sole.setAttribute('opacity',String(soleReveal));
 for(const shoePath of sole.parentElement.children){
  if(shoePath!==sole)shoePath.setAttribute('opacity',String(1-soleReveal));
 }
 if(sitProgress>0){
  const hip=Number(limb.dataset.pivot.split(' ')[0]);
  const outward=hip<80?-1:1;
  const kneeX=hip+outward*8*sitProgress;
  const shoeX=hip+outward*6*footExtension;
  const shoeForward=19*footExtension;
  const kneeY=160+16*sitProgress;
  limb.querySelector('[data-bone]').setAttribute('d',
   `M${hip} ${148+seatedDrop-2*wakeStretch} Q${kneeX} ${kneeY} ${shoeX} ${172+shoeForward}`);
  limb.querySelector('[data-foot]').setAttribute('transform',
   `translate(${shoeX} ${182+shoeForward}) scale(${1+.18*footExtension} ${1+.15*footExtension}) translate(${-hip} -182)`);
 }
}
animateDirections(swing,bob+breath,inspectCurve);

 };
}
