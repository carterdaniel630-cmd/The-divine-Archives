/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage: the list of sites

   One entry per site. status "live" means the site can be walked: it has a
   module in docs/pilgrimage/sites/<id>/ and a page docs/pilgrimage/<id>.html,
   which tools/build-pages.js writes from this entry. Every other site is
   "queued" and shows on the Pilgrimage page as coming. Adding a site later is
   one entry here (status "live") plus its module folder; nothing else changes.

     id        url slug; also the module folder name
     name      as shown
     era       era slug (null for the Rotunda)
     label     "R" lost/destroyed (a labelled reconstruction), "C" claimed or
               traditional site (the dispute is shown on site), "S" restricted or
               sensitive (exterior only unless Carter approves otherwise), or ""
     chapters  the archive chapters it links to
     vault     Vault objects shown there (found at, kept at, or related to the site)
     pending   true while the site carries the "pending full review" tag

   Source of the list: plans/pilgrimage-sites.md (the master list).
   ========================================================================== */
(function () {
  "use strict";
  window.PILGRIMAGE = { sites: [
    {"id":"mount-ararat-the-ark-tradition","name":"Mount Ararat & the Ark tradition","era":null,"label":"C","chapters":["ch01"],"vault":[],"status":"queued"},
    {"id":"gobekli-tepe","name":"Göbekli Tepe","era":"01-prehistory","label":"","chapters":["ch42","ch41"],"vault":["v60"],"status":"queued"},
    {"id":"lascaux","name":"Lascaux","era":"01-prehistory","label":"","chapters":["ch41"],"vault":[],"status":"queued"},
    {"id":"chauvet","name":"Chauvet","era":"01-prehistory","label":"","chapters":["ch41"],"vault":[],"status":"queued"},
    {"id":"catalhoyuk","name":"Çatalhöyük","era":"01-prehistory","label":"","chapters":["ch42","ch48"],"vault":["v59"],"status":"queued"},
    {"id":"stonehenge","name":"Stonehenge","era":"01-prehistory","label":"","chapters":["ch42"],"vault":["v45"],"status":"queued"},
    {"id":"newgrange","name":"Newgrange","era":"01-prehistory","label":"","chapters":["ch42"],"vault":[],"status":"queued"},
    {"id":"drakensberg-rock-art","name":"Drakensberg rock art","era":"01-prehistory","label":"","chapters":["ch66"],"vault":[],"status":"queued"},
    {"id":"uluru","name":"Uluru","era":"01-prehistory","label":"S","chapters":["ch61"],"vault":[],"status":"queued"},
    {"id":"great-pyramid","name":"The Great Pyramid of Khufu","era":"02-bronze-age","label":"","chapters":["ch02","ch49","ch47"],"vault":["v34","v20"],"status":"live","pending":true,"place":"Giza, Egypt","built":"c. 2560 BCE","blurb":"Walk the five interior spaces of Khufu’s pyramid, sized from Petrie’s survey: the descending and ascending passages, the Grand Gallery, the King’s Chamber with its granite sarcophagus, and the Queen’s Chamber."},
    {"id":"tomb-of-tutankhamun","name":"Tomb of Tutankhamun (KV62)","era":"02-bronze-age","label":"","chapters":["ch02","ch47"],"vault":["v20"],"status":"queued"},
    {"id":"tomb-of-nefertari","name":"Tomb of Nefertari (QV66)","era":"02-bronze-age","label":"","chapters":["ch02","ch47"],"vault":["v20"],"status":"queued"},
    {"id":"karnak","name":"Karnak","era":"02-bronze-age","label":"","chapters":["ch02","ch49"],"vault":["v43"],"status":"queued"},
    {"id":"ziggurat-of-ur","name":"Ziggurat of Ur","era":"02-bronze-age","label":"","chapters":["ch03"],"vault":["v52"],"status":"queued"},
    {"id":"knossos","name":"Knossos","era":"02-bronze-age","label":"","chapters":["ch67","ch08"],"vault":["v56"],"status":"queued"},
    {"id":"great-bath-mohenjo-daro","name":"Great Bath, Mohenjo-daro","era":"02-bronze-age","label":"","chapters":["ch04"],"vault":[],"status":"queued"},
    {"id":"hattusa","name":"Hattusa","era":"02-bronze-age","label":"","chapters":["ch57"],"vault":[],"status":"queued"},
    {"id":"la-venta","name":"La Venta","era":"02-bronze-age","label":"","chapters":["ch76"],"vault":[],"status":"queued"},
    {"id":"solomon-s-temple","name":"Solomon's Temple","era":"03-early-iron-age","label":"R","chapters":["ch07","ch10","ch19"],"vault":["v07","v12","v23"],"status":"queued"},
    {"id":"delphi","name":"Delphi","era":"03-early-iron-age","label":"","chapters":["ch08","ch15"],"vault":["v39"],"status":"queued"},
    {"id":"mount-olympus","name":"Mount Olympus","era":"03-early-iron-age","label":"","chapters":["ch08","ch15"],"vault":[],"status":"queued"},
    {"id":"yinxu-at-anyang","name":"Yinxu at Anyang","era":"03-early-iron-age","label":"","chapters":["ch09","ch49"],"vault":["v55"],"status":"queued"},
    {"id":"meroe-pyramids","name":"Meroë pyramids","era":"03-early-iron-age","label":"","chapters":["ch68"],"vault":[],"status":"queued"},
    {"id":"tarquinia-etruscan-tombs","name":"Tarquinia Etruscan tombs","era":"03-early-iron-age","label":"","chapters":["ch77"],"vault":[],"status":"queued"},
    {"id":"library-of-alexandria","name":"Library of Alexandria","era":"04-axial-age","label":"R","chapters":["ch15","ch17"],"vault":["v53"],"status":"queued"},
    {"id":"parthenon","name":"Parthenon","era":"04-axial-age","label":"","chapters":["ch15"],"vault":[],"status":"queued"},
    {"id":"herod-s-temple","name":"Herod's Temple","era":"04-axial-age","label":"R","chapters":["ch10","ch16","ch19"],"vault":["v44"],"status":"queued"},
    {"id":"qumran-caves","name":"Qumran caves","era":"04-axial-age","label":"","chapters":["ch10","ch16","ch17","ch19","ch50"],"vault":["v02","v48","v10","v49"],"status":"queued"},
    {"id":"persepolis","name":"Persepolis","era":"04-axial-age","label":"","chapters":["ch06","ch49"],"vault":["v35","v54"],"status":"queued"},
    {"id":"bodh-gaya","name":"Bodh Gaya (Mahabodhi)","era":"04-axial-age","label":"","chapters":["ch11","ch20"],"vault":["v46","v27"],"status":"queued"},
    {"id":"great-stupa-at-sanchi","name":"Great Stupa at Sanchi","era":"04-axial-age","label":"","chapters":["ch11","ch20"],"vault":["v46"],"status":"queued"},
    {"id":"eleusis","name":"Eleusis","era":"04-axial-age","label":"","chapters":["ch18","ch15"],"vault":["v39"],"status":"queued"},
    {"id":"pantheon","name":"Pantheon (Rome)","era":"04-axial-age","label":"","chapters":["ch13"],"vault":[],"status":"queued"},
    {"id":"temple-of-confucius-qufu","name":"Temple of Confucius, Qufu","era":"04-axial-age","label":"","chapters":["ch12"],"vault":[],"status":"queued"},
    {"id":"church-of-the-holy-sepulchre","name":"Church of the Holy Sepulchre","era":"05-late-antiquity","label":"C","chapters":["ch16","ch22","ch60"],"vault":["v15","v05"],"status":"queued"},
    {"id":"garden-tomb","name":"Garden Tomb","era":"05-late-antiquity","label":"C","chapters":["ch16","ch31"],"vault":[],"status":"queued"},
    {"id":"roman-catacombs","name":"Roman catacombs","era":"05-late-antiquity","label":"","chapters":["ch16","ch22"],"vault":["v84"],"status":"queued"},
    {"id":"hagia-sophia","name":"Hagia Sophia","era":"05-late-antiquity","label":"","chapters":["ch60","ch22","ch21"],"vault":["v57"],"status":"queued"},
    {"id":"mithraeum-under-san-clemente","name":"Mithraeum under San Clemente","era":"05-late-antiquity","label":"","chapters":["ch18"],"vault":[],"status":"queued"},
    {"id":"petra","name":"Petra","era":"05-late-antiquity","label":"","chapters":["ch70"],"vault":[],"status":"queued"},
    {"id":"aksum","name":"Aksum","era":"05-late-antiquity","label":"","chapters":["ch79","ch60"],"vault":["v07","v66"],"status":"queued"},
    {"id":"mogao-caves","name":"Mogao Caves","era":"05-late-antiquity","label":"","chapters":["ch20","ch53","ch54"],"vault":["v30"],"status":"queued"},
    {"id":"dome-of-the-rock","name":"Dome of the Rock","era":"05-late-antiquity","label":"S","chapters":["ch21"],"vault":[],"status":"queued"},
    {"id":"kaaba","name":"Kaaba","era":"05-late-antiquity","label":"S","chapters":["ch21","ch70"],"vault":["v26"],"status":"queued"},
    {"id":"great-mosque-of-cordoba","name":"Great Mosque of Córdoba","era":"06-early-medieval","label":"","chapters":["ch21"],"vault":[],"status":"queued"},
    {"id":"borobudur","name":"Borobudur","era":"06-early-medieval","label":"","chapters":["ch20","ch53"],"vault":[],"status":"queued"},
    {"id":"kailasa-temple-ellora","name":"Kailasa Temple, Ellora","era":"06-early-medieval","label":"","chapters":["ch24","ch30","ch69"],"vault":[],"status":"queued"},
    {"id":"jokhang-temple","name":"Jokhang Temple","era":"06-early-medieval","label":"","chapters":["ch53"],"vault":[],"status":"queued"},
    {"id":"lindisfarne","name":"Lindisfarne","era":"06-early-medieval","label":"","chapters":["ch22","ch14"],"vault":["v42"],"status":"queued"},
    {"id":"uppsala-temple","name":"Uppsala temple","era":"06-early-medieval","label":"R","chapters":["ch23"],"vault":["v36"],"status":"queued"},
    {"id":"ise-grand-shrine","name":"Ise Grand Shrine","era":"06-early-medieval","label":"S","chapters":["ch25"],"vault":["v61"],"status":"queued"},
    {"id":"chartres-cathedral","name":"Chartres Cathedral","era":"07-high-medieval","label":"","chapters":["ch28","ch48"],"vault":[],"status":"queued"},
    {"id":"notre-dame-de-paris","name":"Notre-Dame de Paris","era":"07-high-medieval","label":"","chapters":["ch28"],"vault":["v06"],"status":"queued"},
    {"id":"angkor-wat","name":"Angkor Wat","era":"07-high-medieval","label":"","chapters":["ch69","ch30","ch20"],"vault":[],"status":"queued"},
    {"id":"chichen-itza","name":"Chichén Itzá","era":"07-high-medieval","label":"","chapters":["ch29"],"vault":["v31"],"status":"queued"},
    {"id":"templo-mayor","name":"Templo Mayor","era":"07-high-medieval","label":"R","chapters":["ch43"],"vault":["v41","v51","v83"],"status":"queued"},
    {"id":"machu-picchu","name":"Machu Picchu","era":"07-high-medieval","label":"","chapters":["ch44"],"vault":["v62"],"status":"queued"},
    {"id":"coricancha-cusco","name":"Coricancha, Cusco","era":"07-high-medieval","label":"","chapters":["ch44"],"vault":[],"status":"queued"},
    {"id":"lalibela","name":"Lalibela","era":"07-high-medieval","label":"","chapters":["ch79","ch60"],"vault":["v66"],"status":"queued"},
    {"id":"montsegur","name":"Montségur","era":"07-high-medieval","label":"","chapters":["ch72"],"vault":[],"status":"queued"},
    {"id":"st-peter-s-basilica","name":"St. Peter's Basilica","era":"08-early-modern","label":"","chapters":["ch31","ch22"],"vault":["v25","v05"],"status":"queued"},
    {"id":"sistine-chapel-the-vatican","name":"Sistine Chapel & the Vatican","era":"08-early-modern","label":"","chapters":["ch31","ch28"],"vault":["v41","v87","v57"],"status":"queued"},
    {"id":"golden-temple","name":"Golden Temple (Harmandir Sahib)","era":"08-early-modern","label":"","chapters":["ch34"],"vault":["v33"],"status":"queued"},
    {"id":"fatehpur-sikri","name":"Fatehpur Sikri","era":"08-early-modern","label":"","chapters":["ch82"],"vault":[],"status":"queued"},
    {"id":"taj-mahal","name":"Taj Mahal","era":"08-early-modern","label":"","chapters":["ch82","ch27"],"vault":[],"status":"queued"},
    {"id":"wittenberg-castle-church","name":"Wittenberg Castle Church","era":"08-early-modern","label":"","chapters":["ch31"],"vault":[],"status":"queued"},
    {"id":"benin-royal-palace","name":"Benin royal palace","era":"08-early-modern","label":"R","chapters":["ch33"],"vault":["v64"],"status":"queued"},
    {"id":"hill-cumorah","name":"Hill Cumorah","era":"09-modern","label":"","chapters":["ch35"],"vault":["v75"],"status":"queued"},
    {"id":"shrine-of-the-bab","name":"Shrine of the Báb","era":"09-modern","label":"","chapters":["ch65"],"vault":["v76"],"status":"queued"},
    {"id":"lily-dale","name":"Lily Dale","era":"09-modern","label":"","chapters":["ch36"],"vault":[],"status":"queued"},
    {"id":"bois-caiman","name":"Bois Caïman","era":"09-modern","label":"","chapters":["ch40"],"vault":["v77"],"status":"queued"},
    {"id":"azusa-street-mission","name":"Azusa Street Mission","era":"09-modern","label":"R","chapters":["ch64"],"vault":[],"status":"queued"}
  ] };
})();
