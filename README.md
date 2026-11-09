# Trukkikorttikoe

Suomenkielinen, puhelimella ja tabletilla käytettävä sovellus trukkikokeiden vastaanottamiseen. Opiskelijan useat suoritukset kootaan samaan PDF-raporttiin. Ei kirjautumista eikä palvelimelle tallennettavia opiskelijatietoja.

## Käyttö

1. Avaa sovellus verkkoyhteydessä. Odota yläreunan **Offline-valmis**-ilmoitusta.
2. Asenna selaimen valikosta kotinäytölle (Android: *Asenna sovellus / Lisää aloitusnäyttöön*, iPhone/iPad: Safari → *Jaa → Lisää Koti-valikkoon*).
3. Täytä opiskelijan ja vastaanottajan tiedot. Valitse trukki, koeaika ja lavamäärä.
4. Arvioi ajoonlähtötarkastukset ja käyttöönotto. Käynnistä ajanotto erikseen.
5. Kirjaa lavojen poistot ja hyllytykset erillisillä laskureilla. Virheet on ryhmitelty otsikoittain.
6. **Muu virhe · oma pistemäärä** -kohdassa kuvaus ja kokonaisluku 0–1000 ovat pakollisia. Merkinnän voi poistaa tapahtumaluettelosta ennen vahvistusta.
7. Päätä koe, tarkasta kirjaukset ja vahvista tulos. Vahvistettu suoritus lukitaan.
8. Palaa kokeen valintaan seuraavaa koetta varten tai lataa/jaa yhteinen PDF.

## Pisteytys 1.0

Nykyiset pistearvot on säilytetty aiemmasta mallista. Pystypylväs: lievä kosketus 25 p, mahdollinen vaurio 50 p, vakava osuma hylkäys. Muut hyllystön osat: 10 p / 30 p / hylkäys. Lavan kaataminen, pudottaminen hyllystä ja vakavat vaaratilanteet ovat suoria hylkäysperusteita.

Oletukset: 25 minuuttia, 5 lavaa, hylkäysraja vähintään 100 p. Hylätty tarkastuskohta lisää 10 p; koko kokeen hylkäys tarkastuksen perusteella on valittavissa asetuksissa. Tarkastuksessa arvioidaan opiskelijan toimintaa; havaittu ja oikein käsitelty laitevika ei sellaisenaan tarkoita opiskelijan hylkäämistä.

Aikarajan päättyminen ennen kokeen päättämistä hylkää. Tauko ei kuluta koeaikaa. Puuttuvat lavasiirrot hylkäävät oletuksena. Asetukset kopioidaan kuhunkin kokeeseen, joten myöhempi asetusten muutos ei muuta aiempaa suoritusta. Lavansiirtovaunun meno- ja paluusiirtotehtävä sovitaan kouluttajan kanssa ennen koetta.

## Tiedot ja offline

Tiedot tallentuvat tämän selaimen localStorageen. Sovellus ei lähetä koetietoja GitHubiin tai muulle palvelimelle. PDF muodostetaan laitteella; jakaminen tapahtuu vain käyttäjän valitsemalla tavalla. GitHub Pages vastaanottaa normaalit sivupyynnöt.

Selaimen tietojen tyhjennys tai laitteen vaihto voi poistaa paikalliset tiedot. Tallenna tarvittaessa JSON-varmuuskopio. JSON voidaan palauttaa tähän sovellukseen; PDF on luettava raportti. Varmuuskopiot ja raportit sisältävät opiskelijan tiedot, eikä niitä pidä lisätä tähän julkiseen koodivarastoon.

Ensimmäinen avaus vaatii verkkoyhteyden. Sen jälkeen sovelluksen käyttö ja PDF:n muodostus toimivat välimuistista. Viestin lähettäminen esimerkiksi sähköpostilla voi vaatia verkkoyhteyden. Päivitys aktivoituu, kun kaikki sovelluksen ikkunat suljetaan ja sovellus avataan uudelleen.

## Kehitys ja julkaisu

Tavallinen HTML/CSS/JavaScript, ei ulkoisia CDN-riippuvuuksia eikä asennettavia npm-paketteja.

- `node test.cjs` – pisteytyksen ja validoinnin tarkistukset.
- `node build.mjs` – luo vastaavan sivuston `dist/`-hakemistoon paikallista esikatselua varten.
- GitHub Pages: **Deploy from a branch → main → / (root)**.
- Päivityksessä muuta `sw.js`-tiedoston välimuistiversiota, jotta uusi sovellusversio voidaan asentaa.

`src/core.js` sisältää pisteytyksen, `src/app.js` käyttöliittymän, `src/pdf.js` raportin ja `src/pwa.js` offline-/asennustilan. PDF-libin ja Nimbus Sans -fonttien lisenssit ovat mukana tiedostoissa ja THIRD_PARTY_NOTICES.md:ssä.

## Varmistus

Versio 1.0: pisteytyksen automaattiset tarkistukset, selaimessa kokeen aloitus, tarkastukset, lavalaskurit, oman virheen syötevalidointi, vahvistaminen ja PDF-lataus. PDF:n teksti ja ulkoasu tarkastettu. Sovellus avautui ja aiemmat kokeet säilyivät myös esikatselupalvelimen pysäyttämisen jälkeen. Varsinainen Samsung A55/A15- ja tablettilaitetestaus tehdään käytössä.
