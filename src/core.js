(function(global){
'use strict';
const groups=[
 {id:'observe',title:'Havainnointi ja muiden huomioiminen',items:[
 ['look','Ympäristön tarkistus puuttuu',30,'Liikkeellelähtö tai suunnanmuutos ilman vapaan reitin varmistamista.'],
 ['reverse','Peruuttaminen katsomatta',30,'Ajonsuunnan seuranta puuttuu. Kirjaa sama havaintopuute yhdestä tilanteesta vain kerran.'],
 ['swing','Liikeradan huomioiminen puuttuu',30,'Trukin perän, haarukoiden tai kuorman pyyhkäisy jää huomioimatta.'],
 ['blind','Katvekohtaan varmistamatta',30,'Ei hidasta ja varmista turvallista kulkua.'],
 ['pedestrian','Jalankulkijan huomioiminen puuttuu',50,'Koealueen sovitun väistämis- tai pysähtymiskäytännön laiminlyönti.'],
 ['dangerperson','Välitön vaara ihmiselle','fail','Välitön törmäys- tai puristumisvaara.']
 ]},
 {id:'drive',title:'Ajotapa ja trukin hallinta',items:[
 ['speed','Tilanteeseen sopimaton ajonopeus',30,'Huomioi näkyvyys, käytettävissä oleva tila ja kuorma.'],
 ['turn','Hallitsematon käännös',30,'Nopeus tai ohjausliike ei vastaa tilannetta.'],
 ['brake','Hallitsematon jarrutus tai kiihdytys',30,'Tarpeettoman äkillinen liike vaarantaa hallinnan.'],
 ['highload','Kuljetusajo kuorma liian korkealla',30,'Erottele kuljetusajo hyllytyksen välttämättömistä liikkeistä. Arvioi laiteohjeen mukaan.'],
 ['highfork','Kuljetusajo haarukat liian korkealla',20,'Tyhjien haarukoiden kuljetuskorkeus ei vastaa laiteohjetta.'],
 ['ground','Ajaminen haarukat maassa',20,'Haarukat koskevat maahan kuljetusajossa.']
 ]},
 {id:'load',title:'Lavan ja kuorman käsittely',items:[
 ['condition','Lavan tai kuorman tarkistus puuttuu',20,'Ei varmista lavan kuntoa, kuorman vakautta tai soveltuvuutta hyllypaikalle.'],
 ['capacity','Kapasiteettien varmistaminen puuttuu',30,'Kuorman paino, trukin nostokyky nostokorkeudella ja hyllypaikan kantavuus.'],
 ['forks','Haarukoiden sijoitus on sopimaton',20,'Sopimaton haarukkaväli tai riittämätön työntösyvyys.'],
 ['bump','Kevyt töytäisy lavaan tai seinään',10,'Hyllyosumat kirjataan omassa ryhmässään.'],
 ['collision','Kova törmäys lavaan tai seinään',50,'Vakavan vaaratilanteen seuraamus kirjataan suorana hylkäyksenä.'],
 ['tip','Lavan tai kuorman kaataminen','fail','Sovittu suora hylkäysperuste.'],
 ['drop','Lavan pudottaminen hyllystä','fail','Sovittu suora hylkäysperuste.'],
 ['dropother','Lavan pudottaminen muussa käsittelyssä','fail','Suora hylkäysperuste.'],
 ['unstable','Putoamisvaarallinen lava tai hallinnan menetys','fail','Myös silloin, kun putoaminen saadaan estettyä.']
 ]},
 {id:'rackwork',title:'Hyllystötyöskentely',items:[
 ['drag','Lavan raahaaminen vaakapalkkien päällä',30,'Nosta pystysuoraan irti ennen vaakasuuntaista siirtoa. Laske pystysuoraan vaakapalkeille. Turvallinen korjaus nostamalla ei ole virhe.'],
 ['clearance','Välien ja esteiden huomioiminen puuttuu',30,'Yläpuolinen vaakapalkki, viereinen kuorma ja haarukoiden ulottuminen lavan taakse.'],
 ['support','Haarukoiden poisveto tuentaa varmistamatta',50,'Varmista lavan vakaa ja oikea tuenta molemmille vaakapalkeille.'],
 ['collapse','Välitön sortumis- tai putoamisvaara','fail','Voimakas osuma tai rakenteen siirtyminen. Vaurio ei välttämättä näy heti.']
 ]},
 {id:'after',title:'Toiminta osuman tai vaaratilanteen jälkeen',items:[
 ['report','Jatkaminen pysähtymättä ja ilmoittamatta',30,'Osuman lisäksi kirjattava erillinen toimintavirhe. Jatkaminen vastaanottajan luvalla.'],
 ['continue','Jatkaminen selvästi vaarallisessa tilanteessa','fail','Vastaanottaja kirjaa tilanteen perustelun.'],
 ['intervention','Vakavan vaaran estämiseksi puuttuminen','fail','Yksi vakava tilanne. Tavallinen tehtäväohjeen tarkentaminen ei ole tämä virhe.'],
 ['instruction','Pysäytyskäskyn tai turvallisuusohjeen sivuuttaminen','fail','Täsmennä huomautukseen, mitä ohjetta ei noudatettu.']
 ]},
 {id:'park',title:'Pysäköinti ja kokeen päättäminen',items:[
 ['parking','Sopimaton pysäköintipaikka',20,'Ei pysäköi sovittuun turvalliseen paikkaan.'],
 ['lower','Haarukoiden laskeminen puuttuu',20,'Haarukat eivät ole turvallisessa pysäköintiasennossa.'],
 ['parkbrake','Paikallaan pysymistä ei varmisteta',20,'Seisontajarru ja laitekohtaiset pysäköintitoimet.'],
 ['power','Virran katkaisu tai käytön estäminen puuttuu',20,'Sovitut lopetustoimet jäävät tekemättä.'],
 ['exit','Turvaton poistuminen trukista',20,'Turvallisen poistumistavan laiminlyönti.']
 ]}
];
const parts=['Pystypylväs','Vaakapalkki','Alavaakatuki','Diagonaali','Keskiside','Vaakapalkin varmistin'];
const types=[['counter','Vastapainotrukki','Monipuolinen kuormankäsittely'],['reach','Työntömastotrukki','Hyllytyöskentely'],['stacker','Tukipyörätrukki','Nostot ja siirrot'],['pallet','Lavansiirtovaunu','Lavojen siirtäminen']];
const checks=[['tires','Renkaiden kunto'],['frame','Rungon ja ohjaamon kunto'],['mast','Maston, nostoketjujen ja kuorman takatuen kunto'],['fork','Haarukoiden kunto ja kiinnitys'],['hydraulics','Hydrauliikan kunto'],['leaks','Vuodot ja trukin ympäristö'],['battery','Akun kunto, kiinnitys ja varaustaso'],['gas','Nestekaasupullon kiinnitys ja liitosten kunto'],['fluids','Nestemäärät ja polttoaine'],['seat','Istuimen ja turvavyön kunto ja toiminta'],['attachments','Lisälaitteiden ja jatkohaarukoiden kiinnitys'],['commission','Trukin käyttöönotto']];
const defaults={limit:100,checkPenalty:10,checkFail:false,incompleteFail:true};
const uid=()=>global.crypto?.randomUUID?.()||'id'+Date.now()+Math.random().toString(36).slice(2);
function fresh(){return {version:1,person:{name:'',assessor:'',place:'',date:new Date().toLocaleDateString('sv-SE')},settings:{minutes:25,target:5,type:'counter',energy:'electric',cab:true,attachments:false,rules:{...defaults}},exams:[],activeId:null};}
function selectedChecks(settings){return checks.filter(([id])=>!(id==='gas'&&settings.energy!=='gas')&&!(id==='battery'&&settings.energy==='gas')&&!(id==='seat'&&!settings.cab)&&!(id==='attachments'&&!settings.attachments)&&!(id==='mast'&&settings.type==='pallet'));}
function createExam(state){const c=selectedChecks(state.settings);return {id:uid(),type:state.settings.type,energy:state.settings.energy,target:state.settings.target,limitMs:state.settings.minutes*60000,rules:{...state.settings.rules},date:state.person.date,createdAt:Date.now(),phase:'ready',clock:{elapsed:0,runningSince:null},removed:0,stored:0,checks:c.map(([id,label])=>({id,label,value:null,note:''})),events:[],note:'',endedAt:null,confirmedAt:null,expired:false,result:null,open:['checks'],ruleVersion:'Pisteytys 1.0 · 9.11.2026'};}
function elapsed(e,now=Date.now()){return Math.max(0,e.clock.elapsed+(e.clock.runningSince===null?0:Math.max(0,now-e.clock.runningSince)));}
function pause(e,now=Date.now()){e.clock.elapsed=Math.min(e.limitMs,elapsed(e,now));e.clock.runningSince=null;}
function end(e,now=Date.now(),expired=false){pause(e,now);e.expired=expired;e.endedAt=now;e.phase='review';if(expired)e.clock.elapsed=e.limitMs;}
function total(e){return e.events.reduce((n,v)=>n+(typeof v.points==='number'?v.points:0),0)+e.checks.filter(c=>c.value==='fail').length*e.rules.checkPenalty;}
function evaluate(e){const reasons=[];if(e.expired)reasons.push('Koeaika päättyi ennen kokeen päättämistä');if(total(e)>=e.rules.limit)reasons.push('Virhepisteiden hylkäysraja saavutettu ('+e.rules.limit+' p)');for(const v of e.events.filter(v=>v.points==='fail'))reasons.push(v.label);if(e.rules.checkFail&&e.checks.some(c=>c.value==='fail'))reasons.push('Hylätty ajoonlähtötarkastuksen kohta');if(e.rules.incompleteFail&&(e.removed<e.target||e.stored<e.target))reasons.push('Lavojen siirrot jäivät kesken');const missing=e.checks.filter(c=>c.value===null).length;return {status:reasons.length?'fail':missing?'pending':'pass',reasons:[...new Set(reasons)],missing,points:total(e)};}
function addEvent(e,{key,label,points,group}){e.events.push({id:uid(),key,label,points,group,at:Date.now(),elapsed:Math.min(elapsed(e),e.limitMs)});}
function addCustomEvent(e,label,rawPoints){
 const name=String(label||'').trim(),raw=String(rawPoints??'').trim(),points=Number(raw);
 if(!name||name.length>240)throw Error('Kirjoita virheen kuvaus (enintään 240 merkkiä).');
 if(raw===''||!Number.isInteger(points)||points<0||points>1000)throw Error('Anna pistemääräksi kokonaisluku väliltä 0–1000.');
 if(e.phase==='done')throw Error('Vahvistettua koetta ei voi muuttaa.');
 addEvent(e,{key:'custom-'+uid(),label:name,points,group:'Muut virheet'});
}
function validate(s){if(!s||s.version!==1||!s.person||!s.settings||!Array.isArray(s.exams)||s.exams.length>200)throw Error('Tiedosto ei ole tämän sovelluksen varmuuskopio.');for(const k of ['name','assessor','place','date'])if(typeof s.person[k]!=='string'||s.person[k].length>500)throw Error('Virheelliset perustiedot.');function number(x,min,max){return Number.isFinite(x)&&x>=min&&x<=max;}function rule(r){return r&&number(r.limit,1,1000)&&number(r.checkPenalty,0,100)&&typeof r.checkFail==='boolean'&&typeof r.incompleteFail==='boolean';}if(!rule(s.settings.rules)||!number(s.settings.minutes,1,180)||!number(s.settings.target,1,100)||!types.some(t=>t[0]===s.settings.type))throw Error('Virheelliset koeasetukset.');const ids=new Set();for(const e of s.exams){if(!e||typeof e.id!=='string'||ids.has(e.id)||!types.some(t=>t[0]===e.type)||!['ready','running','review','done'].includes(e.phase)||!rule(e.rules)||!number(e.target,1,100)||!number(e.limitMs,60000,10800000)||!e.clock||!number(e.clock.elapsed,0,e.limitMs)||!(e.clock.runningSince===null||number(e.clock.runningSince,0,1e15))||!number(e.removed,0,e.target)||!number(e.stored,0,e.target)||!Array.isArray(e.checks)||e.checks.length>30||!Array.isArray(e.events)||e.events.length>5000||typeof e.note!=='string'||e.note.length>20000)throw Error('Virheellinen koesuoritus.');ids.add(e.id);for(const c of e.checks)if(!c||typeof c.label!=='string'||typeof c.id!=='string'||typeof c.note!=='string'||![null,'pass','fail'].includes(c.value))throw Error('Virheellinen tarkastuskohta.');for(const v of e.events)if(!v||typeof v.label!=='string'||typeof v.key!=='string'||typeof v.id!=='string'||!(v.points==='fail'||number(v.points,0,1000)))throw Error('Virheellinen virhemerkintä.');if(!Array.isArray(e.open))e.open=['checks'];}if(s.activeId!==null&&!ids.has(s.activeId))throw Error('Keskeneräinen koe puuttuu.');if(s.exams.filter(e=>['ready','running'].includes(e.phase)).length>1)throw Error('Useita käynnissä olevia kokeita.');return s;}
const api={groups,parts,types,checks,defaults,uid,fresh,selectedChecks,createExam,elapsed,pause,end,total,evaluate,addEvent,addCustomEvent,validate};
if(typeof module!=='undefined')module.exports=api;global.ForkCore=api;
})(typeof window!=='undefined'?window:globalThis);
