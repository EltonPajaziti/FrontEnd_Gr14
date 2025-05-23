
# 🎓 **Student Management System – SMS (Frontend)**

Ky është komponenti **frontend** i aplikacionit **Student Management System (SMS)** – një ndërfaqe interaktive dhe miqësore për përdoruesit, e ndërtuar me **React** dhe **Vite**. Përdoruesit, sipas rolit të tyre (Admin, Student, Profesor), mund të ndërveprojnë me sistemin përmes një përvoje të personalizuar dhe funksionale.

---

## ⚙️ Teknologjitë e përdorura

* **React**
* **Vite**
* **Axios**
* **React Icons**
* **React Router DOM**
* **Formik + Yup**
* **CSS (custom & modular)**

---

## 🧠 Strukturimi dhe Organizimi i Kodit

Struktura e projektit është ndërtuar për të qenë e thjeshtë, mirë e ndarë dhe lehtësisht e mirëmbajtshme:

* `src/pages/` – Përmban faqet kryesore të organizuara sipas roleve: `Admin`, `Student`, `Professor`.
* `src/components/` – Përmban komponentë të ripërdorshëm UI si sidebar, header, tabela, forma, etj.
* `src/services/` – Përmban logjikën për thirrjet HTTP ndaj backend-it duke përdorur Axios.
* `src/CSS/` – Stilet e organizuara sipas moduleve dhe komponentëve.



---

## 🔐 Autentikimi dhe Menaxhimi i Roleve

* Përdoruesit autentikohen me email dhe fjalëkalim.
* Pas autentikimit të suksesshëm, përdoruesi ridrejtohet në dashboard-in përkatës (admin, student ose profesor).
* JWT ruhet në `localStorage` për autorizim në thirrjet e mbrojtura.

---

## 🚀 Funksionalitete të Mbuluara

### 🌐 Paneli i Administratorit

* Menaxhimi i studentëve, profesorëve, fakulteteve, departamenteve, programeve dhe kurseve.
* Krijimi, përditësimi dhe fshirja e entiteteve përmes formave të validuara.
* Kërkim dinamik, filtrim i të dhënave dhe përdorim i dropdown-ëve të avancuar (jo vetëm ID por emra realë).
* Menaxhimi i materialeve të kurseve dhe orarit të ligjëratave.

### 🎓 Paneli i Studentit

* Shfaqja e të dhënave personale dhe kurseve të regjistruara.
* Regjistrimi në kurse të hapura për semestrin aktiv.
* Aplikimi për bursa dhe ndjekja e statusit të aplikimit.
* Shfaqja e rezultateve të provimeve dhe njoftimeve të rëndësishme.

### 👨‍🏫 Paneli i Profesorit

* Shfaqja e kurseve që ai/ajo ligjëron.
* Upload i materialeve për secilin kurs.
* Menaxhimi i provimeve dhe notave të studentëve të regjistruar.

---

## 📈 Përmirësimi i Përvojës së Përdoruesit

* Validim në kohë reale me **Formik** dhe **Yup** për forma të sigurta dhe të lehta për t’u përdorur.
* Indikatorë ngarkese (`loading spinners`) dhe mesazhe gabimi për çdo veprim.
* Kontroll i aksesit sipas rolit dhe redirect automatik.

---

## ⚠️ Sfidat dhe Zgjidhjet

* Gabimet CORS – u zgjidhën me konfigurimin korrekt të backend-it.
* Sinkronizimi me backend-in – u realizua përmes DTO-ve të unifikuara dhe validimeve të qëndrueshme.
* Organizimi i kompleksitetit të UI-së – ndarje të qartë sipas roleve dhe funksioneve.

---

## 🔧 Si ta nisni projektin lokalisht

1. **Kloni projektin** nga GitHub.
2. Navigoni në direktorinë e frontend-it.
3. Ekzekutoni komanden `npm install` për të instaluar varësitë.
4. Sigurohuni që backend-i është aktiv në portin e saktë (zakonisht `http://localhost:8080`).
5. Ekzekutoni `npm run dev` për të nisur projektin në `http://localhost:5173`.

---

## ✅ Statusi i Projektit

Frontend-i është funksional dhe plotësisht i integruar me backend-in:

* Përvojë e personalizuar sipas rolit të përdoruesit.
* Ndërfaqe e qartë dhe e thjeshtë për navigim.
* Testuar për rrjedhat kryesore të përdoruesve: autentikim, menaxhim entitetesh, regjistrim në kurse, aplikime për bursa, etj.

---

## 📩 Kontributet

Ky projekt është rezultat i bashkëpunimit të ekipit tonë të zhvilluesve. Jemi të hapur për sugjerime dhe kontribues të rinj.

### Anëtarët e Grupit:

* Adrian Mehaj  
* Elton Pajaziti  
* Leutrim Hajdini  
* Isma Klinaku  
* Zana Shabani  
