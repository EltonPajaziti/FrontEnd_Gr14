## Student Management System

Kjo është pjesa frontend e Sistemit për Menaxhimin e Studentëve (SMS), e zhvilluar duke përdorur React dhe Vite. Është krijuar për të ofruar një ndërfaqe të lehtë për t’u përdorur dhe të përshtatshme për admin, studentë dhe profesorë.

## Teknologjitë që kemi përdorur:
- React 
- Vite 
- Axios 
- React Icons 
- React Router DOM 
- Formik + Yup 
- CSS 

Në këtë projekt kemi implementuar një sistem autentikimi që u lejon përdoruesve të kyçen me email dhe fjalëkalim. Pasi përdoruesi identifikohet me sukses, në varësi të rolit të tij (admin, student ose profesor), ai ridrejtohet në panelin përkatës. 

Për admin-in kemi krijuar një dashboard të plotë, ku ai mund të menaxhojnë studentët, profesorët, kurset, fakultetet, programet dhe departamentet. Admin-i mund të shtojë, editojë ose fshijë të dhëna dhe të kërkojë lehtësisht përmes filtrave dhe fushave të kërkimit. Kur zgjedh, për shembull, një program ose departament për një profesor apo kurs, emrat shfaqen në dropdown në vend të ID-ve numerike, gjë që e bën ndërfaqen më të kuptueshme.

Nga ana tjetër, studentët pasi kyçen mund të shohin të dhënat e tyre personale, kurset ku janë të regjistruar dhe të aplikojnë për bursa. Nëse aplikojnë, ata mund të ndjekin statusin e aplikimit në kohë reale. Për të gjithë formularët kemi përdorur Formik dhe Yup, në mënyrë që të kemi validime të sakta dhe që përdoruesi të udhëzohet në rast se mungojnë të dhëna.

Struktura e projektit është e organizuar në dosjen src, ku kemi ndarë komponentët dhe faqet për admin, studentë dhe profesorë. Kemi gjithashtu një dosje të veçantë për shërbimet që bëjnë kërkesat HTTP përmes Axios, duke e bërë më të lehtë mirëmbajtjen e kodit.

## Gjatë zhvillimit hasëm disa sfida, siç ishin gabimet CORS, struktura e të dhënave të ndërlikuara JSON dhe sinkronizimi i formave me modelet në backend, por i zgjidhëm me përkushtim. Implementuam edhe mesazhe gabimi dhe indikatorë ngarkese për përvojë më të mirë përdoruesi.
