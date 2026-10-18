/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage: the list of sites

   One entry per site. status "live" means the site can be walked: it has a
   module in docs/pilgrimage/sites/<id>/ and a page docs/pilgrimage/<id>.html,
   which tools/build-pages.js writes from this entry. Every other site is
   "queued" and shows on the Pilgrimage page as coming. "preview" means the site is
   built and walkable at its own address (noindex) but kept off the menu: the
   Pilgrimage page still shows it as coming and the museum has no portal to it,
   until Carter approves it going live. Adding a site later is
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
     note      optional: replaces the default "sizes come from published survey
               measurements" line on the site page. Required wherever that line
               would be untrue (sizes estimated or conjectured, not surveyed).

   Source of the list: plans/pilgrimage-sites.md (the master list).
   ========================================================================== */
(function () {
  "use strict";
  window.PILGRIMAGE = { sites: [
    {"id":"mount-ararat-the-ark-tradition","name":"Mount Ararat & the Ark tradition","era":null,"label":"C","chapters":["ch01"],"vault":[],"status":"preview","pending":true,"place":"Ağrı Dağı / Masis, eastern Turkey","built":"a volcano; the tradition medieval and modern","blurb":"The mountain long identified as the Ark's landing place: look up at its two cones from the plain, walk round the boat-shaped Durupınar formation and compare it with the size Genesis gives, and stand on the summit ice, with the traditions, the searches and the geology set side by side.","note":"The mountain is a scale model whose heights are published and whose shape is our own, and the formation's width and height are estimates;"},
    {"id":"gobekli-tepe","name":"Göbekli Tepe","era":"01-prehistory","label":"","chapters":["ch42","ch41"],"vault":["v60"],"status":"preview","pending":true,"place":"Şanlıurfa Province, south-eastern Turkey","built":"c. 9500–8000 BCE","blurb":"Look down into the main excavation from the rim, then walk among the T-pillars of Enclosures D and C, the oldest known megaliths, carved with arms, belts, foxes, snakes and a vulture, and end at the quarry where a seven-metre pillar still lies unfinished.","note":"The main sizes come from the excavators’ published figures; the layout of the enclosures and the place of each pillar are approximate, and the carvings are our own simplified renderings;"},
    {"id":"lascaux","name":"Lascaux","era":"01-prehistory","label":"","chapters":["ch41"],"vault":[],"status":"queued"},
    {"id":"chauvet","name":"Chauvet","era":"01-prehistory","label":"","chapters":["ch41"],"vault":[],"status":"queued"},
    {"id":"catalhoyuk","name":"Çatalhöyük","era":"01-prehistory","label":"","chapters":["ch42","ch48"],"vault":["v59"],"status":"queued"},
    {"id":"stonehenge","name":"Stonehenge","era":"01-prehistory","label":"","chapters":["ch42"],"vault":["v45"],"status":"preview","pending":true,"place":"Salisbury Plain, Wiltshire, England","built":"c. 3000 – 1500 BCE, in stages","blurb":"Walk up the Avenue past the Heel Stone, cross the ditch of the henge, and go in among the stones: the sarsen circle and its lintels, the trilithon horseshoe, the bluestones and the Altar Stone, shown as the monument stands today.","note":"The layout and the main sizes come from published plans and figures; the place of each stone and the state of the ruin are simplified;"},
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
    {"id":"delphi","name":"Delphi","era":"03-early-iron-age","label":"","chapters":["ch08","ch15"],"vault":["v39"],"status":"preview","pending":true,"place":"Phocis, central Greece, on the slope of Mount Parnassus","built":"temple rebuilt c. 330 BCE; shown as about 170 CE","blurb":"Climb the Sacred Way past the treasuries and the offerings of the cities, enter the Temple of Apollo to the room where the Pythia sat, and go up to the theatre and the stadium.","note":"The sizes of the temple, two treasuries, the theatre and the stadium come from published figures; where each building stands, the line of the Sacred Way (straightened here) and the inner rooms of the temple are approximate, and the statues and inscriptions are stand-ins;"},
    {"id":"mount-olympus","name":"Mount Olympus","era":"03-early-iron-age","label":"","chapters":["ch08","ch15"],"vault":[],"status":"queued"},
    {"id":"yinxu-at-anyang","name":"Yinxu at Anyang","era":"03-early-iron-age","label":"","chapters":["ch09","ch49"],"vault":["v55"],"status":"queued"},
    {"id":"meroe-pyramids","name":"Meroë pyramids","era":"03-early-iron-age","label":"","chapters":["ch68"],"vault":[],"status":"queued"},
    {"id":"tarquinia-etruscan-tombs","name":"Tarquinia Etruscan tombs","era":"03-early-iron-age","label":"","chapters":["ch77"],"vault":[],"status":"queued"},
    {"id":"library-of-alexandria","name":"Library of Alexandria","era":"04-axial-age","label":"R","chapters":["ch15","ch17"],"vault":["v53"],"status":"live","pending":true,"note":"No plan of the Library survives and no remains have been securely identified, so every size here is conjecture, after ordinary Hellenistic buildings of the kind, not after evidence from Alexandria;","place":"Alexandria, Egypt (the royal quarter; exact site unknown)","built":"founded c. 300 BCE; lost by late antiquity","blurb":"A labelled reconstruction. Almost nothing of the Library's plan survives, so this walk follows the one ancient description of the Museum, Strabo's, and says at every step what is attested and what is guesswork."},
    {"id":"parthenon","name":"Parthenon","era":"04-axial-age","label":"","chapters":["ch15"],"vault":[],"status":"queued"},
    {"id":"herod-s-temple","name":"Herod's Temple","era":"04-axial-age","label":"R","chapters":["ch10","ch16","ch19"],"vault":["v44"],"status":"queued"},
    {"id":"qumran-caves","name":"Qumran caves","era":"04-axial-age","label":"","chapters":["ch10","ch16","ch17","ch19","ch50"],"vault":["v02","v48","v10","v49"],"status":"live","pending":true,"note":"Every size here is approximate: our estimate of the proportions in the excavation reports, whose plans could not be checked for this model, so none of it is a survey measurement;","place":"Qumran, on the north-western shore of the Dead Sea","built":"caves used c. 2nd century BCE – 68 CE","blurb":"Stand on the marl terrace above Wadi Qumran, then climb into three of the caves where the Dead Sea Scrolls were found: Cave 4, cut by hand into the marl, Cave 1 in the cliffs, and Cave 3, where the Copper Scroll lay."},
    {"id":"persepolis","name":"Persepolis","era":"04-axial-age","label":"","chapters":["ch06","ch49"],"vault":["v35","v54"],"status":"queued"},
    {"id":"bodh-gaya","name":"Bodh Gaya (Mahabodhi)","era":"04-axial-age","label":"","chapters":["ch11","ch20"],"vault":["v46","v27"],"status":"queued"},
    {"id":"great-stupa-at-sanchi","name":"Great Stupa at Sanchi","era":"04-axial-age","label":"","chapters":["ch11","ch20"],"vault":["v46"],"status":"queued"},
    {"id":"eleusis","name":"Eleusis","era":"04-axial-age","label":"","chapters":["ch18","ch15"],"vault":["v39"],"status":"queued"},
    {"id":"pantheon","name":"Pantheon (Rome)","era":"04-axial-age","label":"","chapters":["ch13"],"vault":[],"status":"queued"},
    {"id":"temple-of-confucius-qufu","name":"Temple of Confucius, Qufu","era":"04-axial-age","label":"","chapters":["ch12"],"vault":[],"status":"queued"},
    {"id":"golgotha-and-the-tomb","name":"Golgotha and the Tomb, c. 30 CE","era":"05-late-antiquity","label":"C","chapters":["ch16","ch10"],"vault":["v15"],"status":"preview","pending":true,"place":"Jerusalem, outside the Second Wall (the site of the Church of the Holy Sepulchre)","built":"a reconstruction of Passover, c. 30–33 CE","blurb":"A labelled reconstruction of the old quarry outside Jerusalem's wall where the Gospels place the crucifixion and burial: the road by the gate with three empty crosses, the unquarried rock, the garden plots, and a new rock-cut tomb you can enter. Places, not people: no figures are shown.","note":"The layout follows excavation reports and the typology of Jerusalem tombs, but the distances between features and every size not from Josephus are reconstruction;"},
    {"id":"church-of-the-holy-sepulchre","name":"Church of the Holy Sepulchre","era":"05-late-antiquity","label":"C","chapters":["ch16","ch22","ch60"],"vault":["v15","v05"],"status":"queued"},
    {"id":"garden-tomb","name":"Garden Tomb","era":"05-late-antiquity","label":"C","chapters":["ch16","ch31"],"vault":[],"status":"queued"},
    {"id":"roman-catacombs","name":"Roman catacombs","era":"05-late-antiquity","label":"","chapters":["ch16","ch22"],"vault":["v84"],"status":"queued"},
    {"id":"hagia-sophia","name":"Hagia Sophia","era":"05-late-antiquity","label":"","chapters":["ch60","ch22","ch21"],"vault":["v57"],"status":"queued"},
    {"id":"mithraeum-under-san-clemente","name":"Mithraeum under San Clemente","era":"05-late-antiquity","label":"","chapters":["ch18"],"vault":[],"status":"queued"},
    {"id":"petra","name":"Petra","era":"05-late-antiquity","label":"","chapters":["ch70"],"vault":[],"status":"queued"},
    {"id":"aksum","name":"Aksum","era":"05-late-antiquity","label":"","chapters":["ch79","ch60"],"vault":["v07","v66"],"status":"queued"},
    {"id":"mogao-caves","name":"Mogao Caves","era":"05-late-antiquity","label":"","chapters":["ch20","ch53","ch54"],"vault":["v30"],"status":"preview","pending":true,"place":"Dunhuang, Gansu, north-west China, on the old Silk Road","built":"caves cut from the 4th to the 14th century; shown as today","blurb":"Walk along the cliff of caves, step into the small room where some 50,000 manuscripts lay sealed for nine centuries, stand at the feet of the great Buddha of 695, and walk round the central pillar of a cave of the Northern Wei.","note":"The number of caves, the height of the great Buddha and what is in Caves 17 and 254 come from published sources; the size and place of every cave, the cliff and the nine-storey building are approximate, and the statues and paintings are our own simple renderings, not copies;"},
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
    {"id":"chichen-itza","name":"Chichén Itzá","era":"07-high-medieval","label":"","chapters":["ch29"],"vault":["v31"],"status":"preview","pending":true,"place":"Yucatán, Mexico","built":"a Maya city from about the 6th century; shown as today","blurb":"Cross the plaza to the pyramid of Kukulkan and switch on the serpent of light, walk the largest ball court of ancient Mesoamerica, follow the white road to the Sacred Cenote, and end at the round tower of El Caracol.","note":"The size of the pyramid and its stairways, the ball court, the causeway and the cenote come from published figures; where each building stands, the distances between them and the other buildings are approximate, and the carvings are our own simple renderings;"},
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
