(function(global){
'use strict';
async function create(state,C){
 const {PDFDocument,StandardFonts,rgb}=global.PDFLib;
 const pdf=await PDFDocument.create();pdf.setTitle('Trukkikokeiden raportti');pdf.setAuthor(state.person.assessor);pdf.setCreationDate(new Date());
 const font=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold),ink=rgb(.09,.17,.23),muted=rgb(.36,.43,.48),green=rgb(.09,.40,.31),red=rgb(.65,.17,.17);
 let page,y;const pages=[];const width=499;
 const safe=t=>String(t??'').replace(/[\r\t]/g,' ').replace(/[^\x20-\x7E\xA0-\xFF\n–—’“”•€]/g,'?');
 function newPage(){page=pdf.addPage([595.28,841.89]);pages.push(page);y=785;page.drawText('TRUKKIKORTTIKOE',{x:48,y,size:10,font:bold,color:green});page.drawText('ARVIOINTIRAPORTTI',{x:402,y,size:9,font:bold,color:muted});y-=30;}
 function lines(text,size=10,b=false,max=width){const f=b?bold:font;const output=[];for(const p of safe(text).split('\n')){let line='';for(const word of p.split(/\s+/)){if(f.widthOfTextAtSize(line+(line?' ':'')+word,size)>max&&line){output.push(line);line='';}if(f.widthOfTextAtSize(word,size)>max){for(const char of word){if(f.widthOfTextAtSize(line+char,size)>max){output.push(line);line='';}line+=char;}}else line+=(line?' ':'')+word;}output.push(line);}return output;}
 function text(t,{size=10,b=false,color=ink,indent=0,gap=6}={}){for(const l of lines(t,size,b,width-indent)){if(y<65)newPage();page.drawText(l,{x:48+indent,y,size,font:b?bold:font,color});y-=size*1.4;}y-=gap;}
 function heading(t){if(y<115)newPage();y-=9;text(t,{size:12,b:true,gap:8});}
 const fmt=ms=>{const n=Math.ceil(ms/1000);return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
 const name=t=>C.types.find(x=>x[0]===t)?.[1]||t;
 newPage();text('Käytännön trukkikokeet',{size:23,b:true,gap:15});text('Opiskelija: '+state.person.name,{size:12,b:true});text('Kokeen vastaanottaja: '+state.person.assessor);text('Paikka: '+(state.person.place||'Ei ilmoitettu'));text('Päivämäärä: '+state.person.date.split('-').reverse().join('.'));text('Raportti sisältää tämän opiskelijan vahvistetut kokeet. Kunkin kokeen pisteytys ja asetukset on kirjattu sen arviointiin.',{color:muted,gap:14});
 const exams=state.exams.filter(e=>e.phase==='done');heading('Suoritusten yhteenveto');
 exams.forEach((e,i)=>{const r=e.result||C.evaluate(e);text(`${i+1}. ${name(e.type)} — ${r.status==='pass'?'HYVÄKSYTTY':'HYLÄTTY'}`,{b:true,color:r.status==='pass'?green:red});text(`${r.points} virhepistettä | Aika ${fmt(C.elapsed(e))} / ${fmt(e.limitMs)} | Poistettu ${e.removed}/${e.target} | Hyllytetty ${e.stored}/${e.target}`,{gap:12});});
 for(const [index,e] of exams.entries()){newPage();text(`${index+1}. ${name(e.type)}`,{size:20,b:true});const r=e.result||C.evaluate(e);text(r.status==='pass'?'HYVÄKSYTTY':'HYLÄTTY',{b:true,size:14,color:r.status==='pass'?green:red});text(`Virhepisteet ${r.points} | Käytetty aika ${fmt(C.elapsed(e))} | Aikaraja ${fmt(e.limitMs)}`);text(`Lavat: poistettu ${e.removed}/${e.target}, hyllytetty ${e.stored}/${e.target}`);text('Vahvistettu: '+new Date(e.confirmedAt).toLocaleString('fi-FI')+' · '+state.person.assessor,{color:muted});
 if(r.reasons.length){heading('Hylkäysperusteet');for(const reason of r.reasons)text('• '+reason);}
 heading('Ajoonlähtötarkastus ja käyttöönotto');for(const c of e.checks){text(`${c.value==='pass'?'Hyväksytty':'Hylätty'} — ${c.label}`,{b:c.value==='fail',gap:3});if(c.note)text(c.note,{indent:14,color:muted,gap:7});}
 heading('Virhemerkinnät');if(!e.events.length)text('Ei kirjattuja ajosuorituksen virheitä.');
 const collected=new Map();for(const v of e.events){const key=v.key+'|'+v.points;if(!collected.has(key))collected.set(key,{...v,count:0});collected.get(key).count++;}
 let previous='';for(const v of collected.values()){if(v.group!==previous){text(v.group,{b:true,gap:4});previous=v.group;}text(`${v.label} — ${v.count} krt — ${v.points==='fail'?'Hylkäys':v.count*v.points+' p ('+v.points+' p/krt)'}`,{indent:10});}
 const bad=e.checks.filter(c=>c.value==='fail').length;if(bad)text(`Hylätyt tarkastuskohdat: ${bad} × ${e.rules.checkPenalty} p = ${bad*e.rules.checkPenalty} p`);
 heading('Huomautukset ja palaute');text(e.note||'Ei huomautuksia.');
 heading('Kokeessa käytetyt arviointisäännöt');text(`Hylkäysraja: ${e.rules.limit} pistettä tai enemmän. Hylätty tarkastuskohta: ${e.rules.checkPenalty} p. Hylätty tarkastus hylkää koko kokeen: ${e.rules.checkFail?'kyllä':'ei'}. Kesken jääneet lavasiirrot hylkäävät: ${e.rules.incompleteFail?'kyllä':'ei'}. Ajan loppuminen ennen kokeen päättämistä hylkää. Tauot eivät kuluta koeaikaa. ${e.ruleVersion}.`,{size:9,color:muted});
 }
 pages.forEach((p,i)=>{p.drawLine({start:{x:48,y:42},end:{x:547,y:42},thickness:.5,color:rgb(.8,.85,.88)});p.drawText('Trukkikorttikoe · arviointiraportti',{x:48,y:28,size:8,font,color:muted});p.drawText(`${i+1} / ${pages.length}`,{x:510,y:28,size:8,font,color:muted});});
 // Embed the actual Type 1 fonts for consistent rendering on every device.
 await pdf.flush();
 const {PDFName}=global.PDFLib;
 for(const [index,f] of [font,bold].entries()){
  const source=global.ForkFonts[index];
  const bytes=Uint8Array.from(atob(source.data),c=>c.charCodeAt(0));
  const stream=pdf.context.flateStream(bytes,{Length1:source.lengths[0],Length2:source.lengths[1],Length3:source.lengths[2]||0});
  const descriptor=pdf.context.obj({Type:'FontDescriptor',FontName:source.name,Flags:32,FontBBox:source.bbox,ItalicAngle:0,Ascent:800,Descent:-220,CapHeight:729,StemV:index?120:80,FontFile:pdf.context.register(stream)});
  const dict=pdf.context.lookup(f.ref),decoder=new TextDecoder('windows-1252'),widths=[];
  for(let code=32;code<=255;code++){try{widths.push(f.widthOfTextAtSize(decoder.decode(new Uint8Array([code])),1000));}catch{widths.push(0);}}
  dict.set(PDFName.of('BaseFont'),PDFName.of(source.name));dict.set(PDFName.of('FontDescriptor'),pdf.context.register(descriptor));dict.set(PDFName.of('FirstChar'),pdf.context.obj(32));dict.set(PDFName.of('LastChar'),pdf.context.obj(255));dict.set(PDFName.of('Widths'),pdf.context.obj(widths));
 }
 return pdf.save();
}
global.ForkPdf={create};if(typeof module!=='undefined')module.exports={create};
})(typeof window!=='undefined'?window:globalThis);
