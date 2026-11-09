(function(){
'use strict';
let prompt=null,offlineReady=false,failed=false;
function status(){return offlineReady?(navigator.onLine?'Offline-valmis':'Offline-tilassa'):failed?'Offline-valmistelu epäonnistui':'Valmistellaan offline-käyttöä…';}
function update(){document.querySelectorAll('[data-offline]').forEach(el=>el.textContent=status());}
window.ForkPwa={status,async install(){if(!prompt)return false;const p=prompt;prompt=null;await p.prompt();await p.userChoice;return true;}};
window.addEventListener('beforeinstallprompt',ev=>{ev.preventDefault();prompt=ev;});
window.addEventListener('appinstalled',()=>{prompt=null;});
window.addEventListener('online',update);window.addEventListener('offline',update);
if('serviceWorker' in navigator&&location.protocol!=='file:'){
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(()=>navigator.serviceWorker.ready).then(()=>{offlineReady=true;update();}).catch(()=>{failed=true;update();});
}else{failed=true;}
})();
