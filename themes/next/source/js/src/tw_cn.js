var defaultEncoding = 2; // ÍøÕ¾Ä¬ÈÏÓïÑÔ£¬1: ·±ówÖÐÎÄ, 2: ¼òÌåÖÐÎÄ
var translateDelay = 0; //ÑÓ³ÙÊ±¼ä,Èô²»ÔÚÇ°, ÒªÉè¶¨ÑÓ³Ù·­ÒëÊ±¼ä, Èç100±íÊ¾100ms,Ä¬ÈÏÎª0
var cookieDomain = "http://www.yiluup.com/"; //¸ü¸ÄÎªÄãµÄ²©¿ÍÍøÖ·
var msgToTraditionalChinese = "·±ów"; //´Ë´¦¿ÉÒÔ¸ü¸ÄÎªÄãÏëÒªÏÔÊ¾µÄÎÄ×Ö
var msgToSimplifiedChinese = "¼òÌå"; //Í¬ÉÏ£¬µ«Á½´¦¾ù²»½¨Òé¸ü¸Ä
var translateButtonId = "translateLink"; //Ä¬ÈÏ»¥»»id
var currentEncoding = defaultEncoding;
var targetEncodingCookie = "targetEncoding" + cookieDomain.replace(/\./g, "");
var targetEncoding = (getCookie(targetEncodingCookie) == null ? defaultEncoding: getCookie(targetEncodingCookie));
var translateButtonObject;
function translateText(txt) {
	if (txt == "" || txt == null) return "";
	if (currentEncoding == 1 && targetEncoding == 2) return Simplized(txt);
	else if (currentEncoding == 2 && targetEncoding == 1) return Traditionalized(txt);
	else return txt
}
function translateBody(fobj) {
	if (typeof(fobj) == "object") var objs = fobj.childNodes;
	else var objs = document.body.childNodes;
	for (var i = 0; i < objs.length; i++) {
		var obj = objs.item(i);
		if ("||BR|HR|TEXTAREA|".indexOf("|" + obj.tagName + "|") > 0 || obj == translateButtonObject) continue;
		if (obj.title != "" && obj.title != null) obj.title = translateText(obj.title);
		if (obj.alt != "" && obj.alt != null) obj.alt = translateText(obj.alt);
		if (obj.tagName == "INPUT" && obj.value != "" && obj.type != "text" && obj.type != "hidden") obj.value = translateText(obj.value);
		if (obj.nodeType == 3) obj.data = translateText(obj.data);
		else translateBody(obj)
	}
}
function translatePage() {
	if (targetEncoding == 1) {
		currentEncoding = 1;
		targetEncoding = 2;
		translateButtonObject.innerHTML = msgToTraditionalChinese;
		setCookie(targetEncodingCookie, targetEncoding, 7);
		translateBody()
	} else if (targetEncoding == 2) {
		currentEncoding = 2;
		targetEncoding = 1;
		translateButtonObject.innerHTML = msgToSimplifiedChinese;
		setCookie(targetEncodingCookie, targetEncoding, 7);
		translateBody()
	}
}
function JTPYStr() {
	return 'ÍòÓë³ó×¨Òµ´Ô¶«Ë¿¶ªÁ½ÑÏÉ¥¸öãÜ·áÁÙÎªÀö¾ÙÃ´ÒåÎÚÀÖÇÇÏ°ÏçÊéÂòÂÒÕùÓÚ¿÷ÔÆØ¨ÑÇ²úÄ¶Ç×ÙôÒÚ½ö´ÓÂØ²ÖÒÇÃÇ¼ÛÖÚÓÅ»ï»áØñÉ¡Î°´«ÉËØöÂ×Ø÷Î±ØùÌåÓàÓ¶ÙÝÏÀÂÂ½ÄÕì²àÇÈ¿ëÙ­Ù¯Ù¶Ù±Ù²Á©Ù³¼óÕ®ÇãÙÌÙÍÙÇ³¥ÙÎÙÏ´¢ÙÐ¶ù¶ÒÙðµ³À¼¹ØÐË×ÈÑøÊÞÙæÄÚ¸Ô²áÐ´¾üÅ©Ú£·ë³å¾ö¿ö¶³¾»ÆàÁ¹Áè¼õ´ÕÁÝ¼¸·ïÙìÆ¾¿­»÷ÛÊÔäÛ»»®ÁõÔò¸Õ´´É¾±ð„iØÙ¹ôØÛØÜ¼Á¹Ð½£°þ¾çÈ°°ìÎñÛ½¶¯Àø¾¢ÀÍÊÆÑ«ÛÂ„ÖÔÈØÐØÑÇøÒ½»ªÐ­µ¥ÂôÂ¬Â±ÎÔÎÀÈ´Úá³§ÌüÀúÀ÷Ñ¹ÑáØÇ²ÞÏáØÉÏÃ³ø¾ÇØËÏØ²Î…¥…¦Ë«·¢±äÐðµþÒ¶ºÅÌ¾ß´ÓõºóÏÅÂÀÂðßÄ¶ÖÌýÆôÎâß¼ß½Å»ß¿ßÂÔ±ßÃÇºÎØÓ½ßÇÁüßÌßÐßåßÔÏÌßßÏìÑÆßÕßØßÙßÜ»©ßàßâßæÓ´ßé†yßë†|ßïßð»½ßüßõØÄßùÄö†ª†®Ð¥Åçà¶à·à¿ºÇàÈÐêàÓÖöàààèÏùàëÍÅÔ°´ÑÎ§àð¹úÍ¼Ô²Ê¥ÛÛ³¡Ûà»µ¿é¼áÌ³ÛÞ°ÓÎë·Ø×¹Â¢ÛâÛäÀÝ¿ÑÛðÛÑµæÛëˆ™ˆ›ÛîÛñÛõÛ÷ÛöÛþÛûÇµ¶é‰GÇ½×³Éù¿Çºø‰×´¦±¸¸´¹»Í·¿ä¼Ð¶áÞÆÛ¼·Ü½±°Â×±¸¾Âèåüåýæ£æ©½ªÂ¦æ«æ¬½¿æ®Óéæ´æµ‹OÓ¤æ¿ÉôæÁæÈæÉæÍæÖËïÑ§ÂÏÄþ±¦Êµ³èÉóÏÜ¹¬¿í±öÇÞ¶ÔÑ°µ¼ÊÙ½«¶û³¾Ò¢ÞÏÊ¬¾¡²ãŒÁÌë½ìÊôÂÅåðÓìËêÆñá«¸Úá­á®á°µºÁëÔÀá´¿ùNá»Ï¿iá½á¿ÂÍáÀáÁÕ¸áÉÂáÎáÐáÕáÛ¹®ÛÏ±ÒË§Ê¦àøÕÊÁ±ÖÄ´øÖ¡°ïàüàýàþÃÝá¥¸É²¢¹ã×¯ÇìÂ®âÐ¿âÓ¦ÃíÅÓ·ÏŽöâÞ¿ªÒìÆúÕÅÃÖåòÍäµ¯Ç¿¹éµ±Â¼¦Ñå³¹¾¶áâÓùÒäâãÓÇâé»³Ì¬ËËâäâæâêâëÁ¯×Üí¡âøÁµ¿Ò¶ñâúâûâýâüÄÕã¢ÔÃí¨Ðüã¥Ãõ¾ª¾å²Ò³Í±¹ã«²Ñµ¬¹ßíªã³·ßã´Ô¸Éå‘\ãÀí¯ÀÁãÁí°ê§Ï·ê¨Õ½ê¯»§ÔúÆËÇ¤Ö´À©ÞÑÉ¨ÑïÈÅ¸§Å×ÞÒ¿ÙÂÕÇÀ»¤±¨µ£ÄâÂ£¼ðÓµÀ¹Å¡²¦Ôñ¹ÒÖ¿ÂÎ’¥ÎÎÌ¢Ð®ÄÓµ²ÞØÕõ¼·»Ó’¦ÀÌËð¼ñ»»µ·¾ÝÄíÂ°ÞâÖÀµ§²ôÞèÞêÀ¿Þì²ó¸éÂ§½ÁÐ¯ÉãÞó°ÚÒ¡±÷Ì¯Þü³ÅÄìß¢ß£ß¥ËÓÔÜµÐÁ²ÊýÕ«ìµ¶·Õ¶¶ÏÎÞ¾ÉÊ±¿õ•Dê¼Öç•oÏÔ½úÉ¹ÏþêÊÔÎêÍÔÝêÓÔýÊõÆÓ»úÉ±ÔÓÈ¨ÌõÀ´Ñîè¿½Ü¼«¹¹èÈÊàÔæèÀèÅèÇÇ¹·ãèÉ¹ñÄûèßèÙÕ¤±êÕ»èÎèÐ¶°èÓèÝÀ¸Ê÷ÆÜÑùèïèðèâèãèåµµèçÇÅèëèí½°×®ÃÎ—ƒ—…¼ìèùé¤èüèýé¡ÍÖÂ¥é­é´éµé·˜–¼÷éÄéÆºáéÉÓ£éÍ³÷éÖéÚéÜéÝ»¶ì£Å·¼ßéâéä²ÐéæéçéééëÅ¹»Ùì±±Ï±ÐÕ±ë§ëªÆøÇâë²ëµ»ãººÎÛÌÀÐÚí³¹µÃ»ããÅ½Á¤ÂÙ²×›hãí»¦›mÅ¢Àáí´ãñãòãøÐºÆÃÔóãþ½àÈ÷ÍÝä¤Ç³½¬½½ä¥›¸×Ç²âä«¼Ãä¯›º»ëä°Å¨ä±›»Í¿Ó¿ÌÎÀÔäµÁ°ä¶ÎÐ›é»ÁµÓÈó½§ÕÇÉ¬µíÔ¨äË×ÕäÂ½¥äÅÓæäÉÉøÎÂÓÎÍåÊªÀ£½¦äÓœ¾ää¹öÖÍäÙäÜÂúäÞÂËÀÄÂÐ±õÌ²œùäíäëäìäòÎ«Ç±äóÀ½äþ±ôå°ÃðµÆÁéÔÖ²Óì¾Â¯ìÀì¿ìÁµãÁ¶³ãË¸ÀÃÌþÖòÑÌ·³ÉÕìÇ»âÌÌ½ýÈÈ»ÀìËìâìÑìÎìÖ°®Ò¯ë¹êóÇ£Îþ¶¿êñ×´áîáïÓÌ±·áóªAÄü¶ÀÏÁÊ¨áöÕøÓüáøáýÁÔâ¨â¤ÖíÃ¨â¬Ï×Ì¡çá«_«`Âêçâ»·ÏÖ«oçôçëçå·©çç«šçõ¬QçöËöÇíÑþè¨è¯è¬è¶ÎÍê±µç»­³©î´³ëðÜÁÆÅ±ðÝÑñðß´¯·èðåðâÓ¸¾·Ñ÷ðéðì»¾ðï³Õð÷¯}ðùðü±ñÌ±ñ«ñ¨ñ®Ñ¢ñ²ñ³°¨ÖåñäÕµÑÎ¼à¸ÇµÁÅÌíîíö±€×ÅÕöíùíúÂ÷Öõ½Ãí¶·¯¿óí¸Âë×©íºÑâí¿íÂíÃÀù´¡³n¹èË¶íÌíÍ³}³~È·¼ï°­íÓí×¼îíÛíÞÀñµtìòìõµ»»öÙ÷Â»ìøÀëÍº¸ÑÖÖ»ý³Æ»à¶ŒïùË°öÕÎÈð£ÇîÇÔÇÏÒ¤´ÜÎÑ¿úñ¼ñÀÊú¾ºóÆËñ±ÊóÈ¼ãÁýóÖÖþóÙÉ¸¹YóÝ³ïÇ©¼ò¹‚óåóæóêÂáóìóïóñÂ¨ÀºÀéóýô¥ÙáÀàôÌôÐôÏÔÁ·àÁ¸ôÖô×½ôôêæù¾ÀæúºìæûÏËæüÔ¼¼¶æýæþ¼ÍÈÒÎ³ç¡À€´¿ç¢É´¸ÙÄÉÀ×ÝÂÚ·×Ö½ÎÆ·ÄÀ‚ÀƒÅ¦ç£Ïßç¤ç¥ç¦Á·×éÉðÏ¸Ö¯ÖÕç§°íç¨ç©ÉÜÒï¾­çª°óÈÞ½áç«ÈÆÀ„ç¬»æ¸øÑ¤ç­Âç¾ø½ÊÍ³ç®ç¯¾îÐåÀ…ËçÌÐ¼Ìç°¼¨Ð÷ç±À†Ðøç²ç³´Âç´çµÉþÎ¬Ãàç·±Á³ñÀ‡ç¸ç¹×ÛÕÀçºÂÌ×ºç»ç¼ç½¼êÃåÀÂç¾ç¿¼©ÀˆçÀçÁç¶¶ÐçÂÀ‰çÃçÄ»ºµÞÂÆ±àçÅÔµçÆ¸¿çÈçÇ·ìÀŠçÉ²øçÊçËçÌçÍçÎçÏçÐÓ§ËõçÑçÒçÓçÔÉÉçÕçÖç×çØçÙ½ÉçÚó¿ÍøÂÞ·£°Õî¼î¿ôÇÏÛÇÌÁ™ÁšñìñïËÊ³ÜÄôÁûÖ°ñ÷Áªñù´ÏËà³¦·ôëÉÉöÖ×ÕÍÐ²µ¨Ê¤ëÊëËëÍëÖ½ºÂöëÚÔàÆêÄÔÅ§Ùõ½ÅÍÑëáÁ³À°ëçÄNëñÄåëïëðÌÚë÷ÅHÓßô¯½¢²Õôµ¼èÑÞÜ³ÒÕ½ÚØÂÜ¼ÎßÂ«ÜÊÎ­ÜÂÜÈÜÉ²ÔÜÑËÕÜÜÆ»¾¥Ü×ÜàÜãÜä¼ë¾£¼öÇQ¼ÔÜéÜêÜñÜöÜùµ´ÈÙ»çÜþÜýÓ«Ý¡Ý£Ý¥ÒñÝ¤Ý¦Ý§Ò©Ý°Ý¯À³Á«ÝªÝ«Ý²»ñÝµÓ¨ÝºÝ»È[ÂÜÓ©ÓªÝÓÏôÈø´ÐÝÛÝÞ½¯ÝäÀ¶¼»ÝñÝ÷ÝöÝëÇ¾ÝüÝþ°ªÞ­ÔÌÞ´Þ»ÞºÂ²ÂÇÐé³æò°ò±ËäÏºò²Ê´ÒÏÂì²Ïòºò¹¹ÆòÃòÉÂùÕÝòÌòÍòÏòÓÍÉÎÏÀ¯Ó¬òå²õÐ«ò÷òîÎ…òýÏ]ÐÆÏÎ²¹³ÄÙò°ÀôÁÐ„ÍàÏ®ÑB×°ñÉÑTñÍñÏ¿ãñÐñÚñÜñßÒ[¼û¹ÛÓ_¹æÃÙÊÓêèÀÀ¾õêéêêêëÓ`êìêíêîêïõü´¥ö£Ô€ÓþÌÜÚ¥¼Æ¶©¸¼ÈÏ¼¥Ú¦Ú§ÌÖÈÃÚ¨ÆýÑµÒéÑ¶¼Ç×š½²»äÚ©ÚªÑÈÚ«Ðí¶ïÂÛ×›ËÏ·íÉè·Ã¾÷Ö¤Ú¬Ú­ÆÀ×çÊ¶×œÕ©ËßÕïÚ®Öß´ÊÚ°Ú¯×ÒëÚ±Ú²Ú³ÊÔÚ´Ê«ÚµÚ¶³ÏÖïÚ·»°µ®Ú¸Ú¹¹îÑ¯ÒèÚº¸ÃÏê²ïÚ»Ú¼×ž½ëÎÜÓïÚ½ÎóÚ¾ÓÕ»åÚ¿ËµËÐÚÀÇëÖîÚÁÅµ¶ÁÚÂ·Ì¿ÎÚÃÚÄË­ÚÅµ÷ÚÆÁÂ×»ÚÇÌ¸ÒêÄ±ÚÈµý»ÑÚÉÐ³ÚÊÚËÎ½ÚÌÚÍÚÎ²÷ÚÑÚÏÑèÚÐÃÕÚÒ× ÚÓÚÔÚÕÐ»Ò¥°ùÚÖÇ«Ú×½÷Ã¡ÚØÚÙÃýÌ·ÚÚÚÛÀ¾Æ×ÚÜÚÝÇ´ÚÞÚß¹ÈØk±´Õê¸ºÚO¹±²ÆÔðÏÍ°ÜÕË»õÖÊ··Ì°Æ¶±á¹ºÖü¹á·¡¼úêÚêÛÌù¹óêÜ´ûÃ³·ÑºØêÝÔôêÞ¼Ö»ßêßÁÞÂ¸Ôß×ÊêàêáêäêâêãÉÞ¸³¶ÄêåÊêÉÍ´ÍÚPÚQâÙÅâêæÀµÚR×¸êç×¬ÈüØÓØÍÔÞÚSÔùÉÄÓ®¸ÓÚWÕÔ¸ÏÇ÷ôõõ»Ô¾õÄõÅõÈ¼ùÛQõÎõÏõÑõÒÓ»³ì×ÙõÙõÜõæõçõé´ÚõïõòÇû³µÔþ¹ìÐùÞaéí×ªéîÂÖÈíºäéïéðéñÖáéòéóéõéôéöé÷ÇáéøÔØéù½ÎÞbéúéû½Ïéü¸¨Á¾éý±²»Ô¹õéþÞcê¡ê¢ê£·ø¼­ÞdÊäàÎÔ¯Ï½Õ·ê¤ÕÞê¥´Ç±ç±è±ßÁÉ´ïÇ¨¹ýÂõÔË»¹Õâ½øÔ¶Î¥Á¬³ÙåÇåÉ¼£ÊÊÑ¡Ñ·µÝåÎÂßÒÅÒ£µËÚ÷ÚùÓÊ×ÞÚþÁÚÓôÛ§Û£Û¦Ö£Û©ÛªÔÇµ¦ÔÍáN½´õ¦õ§ÄðÊÍÀïâ ¼øöÇöÉîÅîÆÕë¶¤îÈîÇîÉîÊÇ¥îËîÌè•·°µöîÍîÏè–îÎè—¸ÆîÐîÑ¶Û³®ÖÓÄÆ±µ¸ÖîÓîÔÔ¿ÇÕ¾ûÎÙ¹³îÖîÕîØî×Å¥îÙîÚÇ®îÛÇ¯îÜ²§îÝîÞîßîàîá×êîâîã¼ØîäÓËÌú²¬ÁåîåÇ¦Ã­îæîçîèîéîëîìè™îíîîîïîðîòîôîóèœîõÍ­ÂÁîöî÷îøÕ¡îùÏ³îúîûèîüîýîþï¢¸õÃúï£ï¤½ÂÒ¿²ùï¥ï¦ï§Òøï¨Öýï©ÆÌèžïªï«Á´ï¬ÏúËøï®ï­³ú¹øï¯ï°Ðâï±ï²·æÐ¿ï³ï´ïµÈñÌàï¶ï·ï¸ï¹ïºÕà´íÃªèŸï¾ï¿è ÎýïÀÂà´¸×¶½õÏÇïÃïÂïÄ¶§¼ü¾âÃÌïÅïÆéAïÇïÏïÈïÉïÊÇÂïñ¶ÍïËéBïÌïÍ¶ÆÃ¾ïÎéCïÒÕòéDïÓÄ÷ïÔÄøïÕïÖ¸ä°÷ï×éFïÚïÛïÝéGïÞ¾µïáïßïàéHïâïãÁÍïäïåïæïçïèïéïêïëïìÀØéIïíÁ­ïîïïïðéJÏâ³¤ÃÅãÅÉÁãÆê\±ÕÎÊ´³ÈòãÇÏÐãÈ¼äãÉãÊÃÆÕ¢ÄÖ¹ëÎÅãËÃöãÌê]·§¸óºÒãÍãÎÔÄãÏê^ãÐÑËãÑãÒãÓãÔÑÖãÕ²ûÀ»ãÖê_À«ã×ãØãÙê`ãÚãÛêa¶ÓÑôÒõÕó½×¼ÊÂ½Â¤³ÂÚêÉÂÚíÔÉÏÕËæÒþÁ¥öÁÄÑ³ûöÅö¨Îíö«Ã¹ö°ö¦¾²ØÌ÷²÷³÷µ÷¹Î¤ÈÍí‚º«è¸è¹èºÔÏÒ³¶¥ÇêñüÏîË³ÐëçïÍç¹Ë¶Ùñý°äËÌñþÔ¤Â­ÁìÆÄ¾±ò¡¼ÕïFò¢ò£ïGò¤ÒÃÆµïHÍÇò¥ïIÓ±¿ÅÌâïJò¦ò§ÑÕ¶îò¨ò©µßòªò«ïK²üò¬ò­È§·çïrïsì©ìªì«ïtì¬ïuïvÆ®ì­ì®·É÷Ï÷Ðð—¼¢ð˜â¼â½â¾â¿âÀâÁ·¹Òû½¤ÊÎ±¥ËÇð™âÂ¶üÈÄâÃðšð›½Èðœ±ýâÄð¶öâÅÄÙðžðŸâÆÏÚ¹ÝâÇÀ¡ð âÈ²öñ@âÉñAÁóâÊâËÂøâÌâÍâÎÂíÔ¦ÍÔÑ±³ÛÇýóR²µÂ¿æàÊ»æáæâ¾Ôæã×¤ÍÕæå¼ÝæäæææçÂîóS½¾æèÂæº§æéóTæê³ÒÑéóUóV¿¥æëÆïæìæíóWóXæîÆ­æïóYÉ§æðæñæòå¹æóæôÂâæõæöÖèæ÷óZæø÷Ã÷Å÷Æ÷Þ÷Ê÷ËÓã÷÷‚öÏ÷ƒÂ³öÐ÷…öÑöÒöÓöÔ÷†÷‡öÖ÷ˆ±«ö×÷‰öØöÙöÚ÷ŠöÛöÜ÷‹÷Œ÷÷ŽöÝöÞÏÊ÷ößöàöáöâöãöäÀðöåöæöçöèöé÷öê÷‘öëöì÷’öíöîöïöðöñöòöóöô¾¨÷“öõööö÷öø÷”÷•÷–÷—÷˜Èúöùöúöûöü÷™÷šöýöþ÷¡÷¢÷£÷¤÷¥÷›÷œ÷¦÷§÷¨±î÷©÷ª÷«÷ž÷¬÷­ÁÛ÷®÷Ÿ÷ ÷¯ø@Äñð¯¼¦ð°Ãùû\Å¸Ñ»û]ð±ð²ð³ð´ðµÑ¼û^Ñìû_ð·ð¶Ô§û`ÍÒð¸ðºð¹ð»ð¼ûaûb¸ëð½ºèûcð¾ð¿¾éðÀ¶ìðÁðÂðÃðÄÈµðÅðÆûdðÇÅôûeðÈûfûgûhðÉûiðÊ÷½ðËðÌðÍûkðÎûlûmûnûoðÏº×ûpðÐðÑðÒðÓðÔðÕðÖðØûrÓ¥ð×ûsðÙûtõºÂóôï»ÆÙäüd÷ò÷õö¼ö½ü…ö¾Ø»÷ú÷þÆëì´³Ýö³ý†ý‡ö´Áäöµö¶ö·ö¸ö¹öºÈ£ö»Áú¹¨íè¹êÖ¾ÖÆ×ÉÖ»ÀïÏµ·¶ËÉÃ»³¢³¢ÄÖÃæ×¼ÖÓ±ðÏÐ¸É¾¡ÔàÆ´'
}
function FTPYStr() {
	return 'ÈfÅcáhŒ£˜I…²–|½zGƒÉ‡À†Ê‚€ãÝØSÅRžéûÅeüNÁxžõ˜·†ÌÁ•àl•øÙIy Žì¶Ìë…ƒ†®a®€ÓHÒC‡¾ƒ|ƒHÄö‚}ƒx‚ƒƒr±Šƒžâ·•þ‚ø‚ã‚¥‚÷‚û‚t‚‚á‚ÎÐówðN‚òƒL‚b‚Hƒe‚É‚ÈƒSƒ~ƒŠƒz‚Rƒ‰ƒ°‚zƒ«ƒ€‚ùƒA‚ôƒEƒfƒ”ƒ¯ƒ†ƒ¦ƒ®ƒºƒ¶ƒ¼ühÌmêPÅdÆðB«F‡ÏƒÈŒùƒÔŒ‘ÜŠÞr‰VñTÐn›Q›rƒöœQœD›öœRœpœ„CŽ×øPøD‘{„P“ôšëèÆc„„¢„t„‚„“„h„e„}„q„£„¥„’„©„Ž„¦„ƒ„¡„ñÞk„Õ„ê„Ó„î„Å„Ú„Ý„ìÃÍ„ã„ò…Q…T…^átÈA…f†ÎÙu±RûuÅPÐl…sŽ„Sd•Ñ…–‰º…’…‡ŽúŽû…˜BNŽýP¿h…¢ìaì^ëp°l×ƒ”¢¯BÈ~Ì–šU‡\»náá‡˜…Î†á†w‡Â †¢…Ç‡`‡Ò‡I‡³†h†T†J†Ü†èÔ†U‡µ‡“‡zß¸‡jûyßÉí‘†¡‡}‡^†ô‡‚‡W‡ˆ‡‡†Ñ‡O†ß‡Z†¤†î†r†¾ºô‡K†Ý‡Êým‡Ó‡c‡[‡Š‡D‡¿‡ËàÀ‡†‡u‡Â‡Ú‡£Åü‡ÌÖoˆFˆ@‡è‡ú‡÷‡øˆDˆAÂ}‰¿ˆöÚæ‰Ä‰KˆÔ‰¯‰È‰Î‰]‰ž‰‹‰Å‰Å‰À‰¾‰¨ˆsˆ×‰|ˆº‰¡‰³‰Nˆß‰P‰_ˆå‰|ˆ‰q‰™‰Ï ‰ÑÂ•š¤‰Ø‰ÚÌŽ‚äÑ}‰òî^ÕFŠAŠZŠYŠJŠ^ª„ŠWŠy‹D‹Œ‹³‹ž‹‚Š™ËKŠä‹I‹Æ‹ÉŒDŠÊ‹z‹¹‹½‹ë‹È‹ð‹‹‹Ü‹å‹Ô‹ßŒOŒWŒ\ŒŽŒšŒŒ™Œ‘—ŒmŒ’ÙeŒ‹Œ¦Œ¤Œ§‰ÛŒ¢ –‰mˆòŒÀŒÆ±MŒÓŒÚŒÏŒÃŒÙŒÒŒÕŽZšqØMçsŽS¹uŽXŽ[–ŽhŽGŽF{ŽAþ˜Žn÷ˆŽMäŽVô£â¼¹Žpì–Ž€ŽÅŽ›ŽŸŽ®Ž¤ºŸŽÃŽ§Ž¬ŽÍŽÎŽ¾Ž½ƒçÒLŽÖKVÇf‘c]TŽì‘ªRý‹UF[é_®—‰ˆ›†—Ššw®”ä›§©Ø½Æ¶R‘›‘Ô‘n÷‘Ñ‘B‘Z‘“‘Yí‘z¿‚‘»‘«‘Ù‘©º‘Q‘ÃðÅÀÁ‚â‘Ò‘a‘‘ó@‘Ö‘K‘Í‘vÜ‘M‘„‘Tœ¡‘C‘‘|îŠ‘Ø‘€âð‘¿‘Ð‘¬‘ß‘â‘ò‘ê‘ð‘ì‘ô¼™“ä’LˆÌ”U’Ð’ß“P”_“á’“»“¸’à“Œ×oˆó“ú”M”n’þ“í”r”Q“Ü“ñ’ì“´”’é“ë“é’¶“Ï“õ“×’ê”D“]“Í“Æ“p“ì“Q“v“þ“Ó“ï“”S“Û“½“¥“«”ˆ“å”v”R“§”‡”y”z”d”[“u”P”‚”t“Î”f”X”]”x”\”€”³”¿”µýS”ÌôY”Ø”àŸoÅf•r•ç•ª•Ò•ƒ•îï@•x•ñ•Ô•Ï•ž•Ÿ•º•á„žÐg˜ã™Cš¢ës™à—lí—î˜q‚Ü˜O˜‹˜º˜Ð——™À—g—–˜Œ—÷—n™™™Ž™f—d–Å˜Ë—£™±™É—™¾™µ™Ú˜ä—«˜Ó™è—¨—¿˜ï˜E™n˜˜ò˜å™u˜ª˜¶‰ô™„—®™z™ô˜¡™³˜ ™å™E˜Ç™ì™Â™°™Î™x™‘™‰™½™M™{™Ñ™Á™»™©™´º™™_šgšešWšžš{š‘šˆšŒššš—š›šªš§Ýž®…”ÀšÖšÐšÚšâšäšåšè¡h›@œ«›°ßeœÏ›]ž–ažrœSœæœtœ¿œûðôœIÍž{žožTžaŠÉ›Üž¢¸D›Ñœ\{²œœÛáœyÒúžgIœ†Gâ¡ø‰Tœ¥ý³œZi¬œuœÝœoœì™¾q­ÕœYœOnž^uÆOžcBœØß[ž³ñ¢žRsU§Lœþž¹ž—Mž]žVžEž´žIž©ËžEžužtž‡žH“žzž‘ž|žlž®œçŸôì`žÄ NŸ¬ tŸõŸ˜ŸÍücŸ’Ÿë q €ŸN TŸŸŸ©ŸýŸî Z C aŸáŸ¨ F cŸºýÁïÛ ” © Ó ¿ Þ ÙŠ î«EªwªqªNûƒªžªŸªšªMª{ªœªbªzªsª«C«J«MØiØˆÎo«I«H­^­m¬„¬”¬|­h¬F¬š­t¬z«k¬m­‡­c¬q­\­I¬­‚¬Ž­a­v­‹­‘®Y®TëŠ®‹•³ÙÜ® °X¯Ÿ¯‘°O¯ƒóœ¯¯‚°’åí°b¯d°W¯{°A¯ˆ°B°V°D¯”¯Ž¯›°T°c°a°`°]°_°dÄŸ°}°™°—±Kû}±OÉw±I±P²g±{²”Öø± ²A²€²m²š³C´‰µ\µV´X´a´u³Œ³Ž´^µZµaµ[µA³Îù´T³ˆ´“´o´™´_û|µK´ƒ´~‰AïàL¶Y¶B¶[µ¶\µœ·Aµ“¶Uëx¶d¶’·N·e·Q·x·v·„¶·d·€·w¸F¸`¸[¸G¸Z¸C¸Q¸]¸MØQ¸‚ºV¹S¹P¹a¹{»\»eºBº`ºYºš¹~»Iºžº†»UºjºD»X»jº„ººˆºt»@»h»f»[¼eî¶i¼g¼c»›¼S¼Z¼Rðf¾o¿{ôé¼m¼u¼t¼qÀw¼v¼s¼‰¼wÀk¼o¼x¾•¼‹¼‡¼ƒ¼„¼†¾V¼{¼Œ¿v¾]¼Š¼ˆ¼y¼¼Ÿ¼…¼~¼‚¾€½C½X¼›¾š½M¼¼š¿—½K¿U½O½E½I½BÀ[½›½H½‰½q½Y½fÀ@½x½WÀL½o½k½{½j½^½g½y½Ž½‹½ÀC½”½—½dÀ^½¿ƒ¾w¾c¾xÀm¾_¾p¾b¾y¾iÀK¾S¾d¾R¿‡¾I¾T¾^¾J¾C¾`¾U¾G¾Y¾l¾~¾|¾}¾’À|¾Ÿ¾˜¾ƒ¿ZÀD¾Œ¾E¾„¾œ¾€¾—¿P¾¾†¿|¾Ž¾‡¾‰¿N¿`¿d¿b¿p¿\¿cÀp¿r¿O¿VÀ_¿~¿z¿wÀt¿s¿Š¿‰Ài¿¿˜¿•í\À`ÀRÀQÀUÀyÀ›¾WÁ_ÁPÁTÁ`ÁbÁuÁwÂNÂPÂEÂgÂeÂ–uÂ™Ã@ÂšÂœÂ“Â˜Â”ÃCÄcÄwÄdÄIÄ[Ã›Ã{Ä‘„Ù–VÄLÅFÃ„ÄzÃ}Ä’óvÄšÄXÄ“ÅLÄ_Ã“ÄTÄ˜ÅDáZÄsý|ÄìtÄeòvÄœÅNÝ›ÅœÅžÅ“ÆAÆDØWÆHË‡¹ÁdËGÊÌJÉÈ”ËžÇ{ÈOÉnÆrÌK™”ÌOÇoÌdÊ\‰LŸ¦ÀOÇGË]ËRÇvÊÉœÊwËCËjÊŽ˜sÈœî ÎŸÉÊnË|ÉpÊaÊ{È‡È’ËŽÉWÉ‰ÈRÉÉPÈnËW«@Ê~¬“úLÉ”ÌEÌ}Îž I¿MÊ’Ë_Ê[ÊrÊ‰ÊYÊVË{ËEÌyÊšævò‡ËNÌ`ÌAÌ@ÌIÌNË’éÂÌ\Ì”‘]Ì“ÏxÍAÏlëmÎrÏŠÎgÏÎ›ÐQÏ–Í˜ÐMÏ Ï|ÐUÏUÍÏuÎ‡Ï“Í‘ÎÏžÏ‰ÏXÏsÏÏNÏ”ÏQÏ\ÐDá…ã•ÑaÒrÐ–Ò\‹–Ñ‹ÒmÒuÒUÑbÒdÑ‚ÑžÒcÑÒMÒ@Òh¿‹ÒwÒŠÓ^ÒÒŽÒ’Ò•Ò—Ó[ÓXÓJÒ Ó]ÓCÓDÓMÓPÓUÓxÓ|Óz×„×uÖ`Ó…Ó‹Ó†Ó‡ÕJ×IÓ“ÓÓ‘×ŒÓ˜Ó™Ó–×hÓÓ›Ó•ÖvÖMÖŽÔnÓ ÔGÔSÓžÕ“ÔKÔAÖSÔOÔLÔE×CÔbÔXÔuÔ{×RÔwÔpÔVÔ\ÔgÖaÔ~ÔxÔtÔv×gÔrÕEÕCÔ‡ÔŸÔŠÔ‘ÔœÕ\ÕDÔ–Ô’ÕQÔÔÔŽÔƒÔ„ÕŠÔ“Ô”ÔŒÕŸÔ‚×pÕ]Õ_ÕZÕVÕ`ÕaÕTÕdÕNÕfÕbÕOÕˆÖTÕŒÖZ×xÕŽÕuÕnÕ†Õ˜ÕlÕ”Õ{Õ~ÕÕÕrÕ„ÕxÖ\ÖRÕ™ÖeÖGÖCÖoÖ]Ö^Ö@ÖIÖX×‹ÖJÖOÖVÖBÖiÕ›ÕšÖƒ×•ÖqÖxÖ{ÖrÕžÖtÖkÖ”Ö™Ö†×vÖ‡×T×P×S×Ž×V×H×—×l×d×·YØrØØ‘Ø“Ø’Ø•Ø”ØŸÙt”¡Ù~Ø›Ù|ØœØØšÙHÙÙAØžÙEÙvÙSÙBÙNÙFÙLÙJÙQÙMÙRÙOÙ\Ù—ÙZÙVÙDÙUÙTÚEÙYÙWÚBÙgÙcÙlÙdÙxÙ€ýVÚHÙpÙnÚFÙkÙsÙrÙyÙ‡ÙˆÙ˜ÙŽÙÙÙ‘ÚI×“ÙšÙ›Ù ÚAÚMÚXÚwÚsÚ…ÚŽÜOÜSÛ„Û•ÜVÛ`ÜJÜEÛ‹Ü]ÜQÛxÜPÛ™ÜWÜUÜbÛ˜ÜXÜfÜkÜgÜ|Ü‡ÜˆÜ‰ÜŽÜÜÞDÜ—Ý†Ü›ÞZÝMÝVÞ_ÝSÝTÝWÜ ÝFÞ]ÝUÝpÝYÝdÝeÞIÝcÝbÝ`Ý^ÝmÝoÝvÝ‚Ý…ÝxÝÝyÝˆÝzÝwÝÝ—Ý‹ÝœÝ”Þ\Þ@Ý ÝšÞAÞHÞOÞoÞqÞpß…ß|ß_ßwß^ß~ß\ß€ß@ßMßhß`ßBßtßƒÞŸÛEßmßxßdßfßŠß‰ßzßbà‡à—àwà]àuà’àôdàSàPà”ààiáBàyàájáwáuá‰á‡á„áŒÑYîÒèbèŽçYááá˜á”á“á•á‘âQâTâAáŸâlâCážå{âSåâOâ]â}âbââgânæRâcä^ä“âkâjè€šJâxæuã^â‚â[â€â^âoâZâ•åXã`ãQâ’ÀâŽãOâ˜â“ãXèãfãgâ›âšâ™èFãKâèpãUãTâ‹ãCãBãGâ”èIãoäDã™ãsäBäeäyçtã‡èKã~äXäHãŸæzåŽããŠäbäAã”çfãŒãxã“ãtã‘åPäCãqãžçPã|ç|ä@ãyãœèTç„ääoånäˆæœçHäNæiä‡ä{äzåä†ä~çnäSäsähä\äç˜ç™äJäRäZäuä|åHäæNåeå^åWä˜åKå_åaådèŒåNåFå\åväŸäžåUåVæIäåiåOå›å}å|çIæJåŠåšæ@æRå‘æ}å–æDæXåƒæVçUætæŸæ‚ænækè‡çæ‡æ“æyæ€æ^æ„ægçSçMæ çaçOçRçCæ—æ›çBç†è‘ç‚çhèuç…è|ç’è‰çjç‹èZèDèGèCç èOèdèsènè‚éLéTéVéWéZé\é]†–êJécééeébégéhé`žélô[é|Â„êYé}é‚êGéyéwéué€ôbé†éêAé“éŽé‹ô]é”é’éé‘êUê@é˜êTéŸé êHêDêFêIêRêXê ê–êŽê‡ëAëHê‘ë]êê€ê„êŸëEëUëSë[ë`ëhëyër×‡ìZìFìVüqì\ìnìoìví^íXídíxífígíhínítíyíwíí“í”í•í™í—í˜íšíœîBî™îDí îCížî@îAïBîIîHîiîRîaîcîM}ŸâîWîUîlî_îjîhîe·fîwî}î„î€î…îî~ïDî”îî‹î—ÀhîîžïAïEïLï^ïQïRïSïZï\ï`ï_ïdïhïjïjïwð‹ðï}ð‡ï€ðhï‚ðqïƒï„ï†ïˆï‹ðTï—ï–ï•ï˜ïðDðˆðAïðEïœðFïžðGðLðIðNðHðKðRðQðWð^ðlððkðtð’ðvðxðoðsð}ð~ðzð€ð‚ð–ñRñSñWñZñYòŒñ_ñgóHñzñ‚ñ†ñ€ñxò|ñvñ„ñwñ{óAñ~ò”ÁRñ—òœò‘ñ˜ñ”ñ‰óQóPòGòžòHñŸòEòUòTòSòKòRò“ò‰ò_òsòjò}ò\òˆòtòqò~òŠò…ò‹ò–óEóKóLóJótóyóxôWô|ôuô~ô€ô‡ôœôô”ô™ôŸõEõGöT÷|õOõWõVõNõU÷cõQõTõqõ^õwõnõbõjöfõ`÷d÷qõoõrõ~õœ÷\õ†÷~ö–öžõŽöˆöœõ…õõŒõzöaõ—õ›öNõšöOöEöHöKöAöFöTõ öLöYöXõ™÷aölös÷lö[ö“ögöw÷{öqövömöe÷Föcö…üö’ööŠöŽö„öö˜÷B÷L÷Mö öš÷I÷@÷Z÷X÷[÷V÷s÷h÷k÷gøBøFëuøSøQøOútøfúIødøcøù…ûRø†ø{ø„øoø|øzøxøŠørúƒúvøøŽø ø’ù@øû[ø™ùMùPûZùNù]ùZùOú‘ùYù^ùoù‘ùgúAùlùiùkù‡ùˆùtú‰ù–ùŸù˜úXú\úBúFúgú_úOúVúWú^úYúQúsûWúpúwúú„úú–ú˜ûDú—ûIûLûXûUûzûœûŸüSüZüsütüoüwüxü{üƒìŠýBýOýRýWýXýZý[ý]ýeýgý_ýfýbýlýrýpýxý}ýˆýýý”ÕIÑuÚÑëbÑe‚S¹ ó ƒÓ‡Ÿ‡Lô\üIœÊçŠ•éfÇ¬ƒÅKÞÕ'
}
function Traditionalized(cc) {
	var str = '';
	var ss = JTPYStr();
	var tt = FTPYStr();
	for (var i = 0; i < cc.length; i++) {
		if (cc.charCodeAt(i) > 10000 && ss.indexOf(cc.charAt(i)) != -1) str += tt.charAt(ss.indexOf(cc.charAt(i)));
		else str += cc.charAt(i)
	}
	return str
}
function Simplized(cc) {
	var str = '';
	var ss = JTPYStr();
	var tt = FTPYStr();
	for (var i = 0; i < cc.length; i++) {
		if (cc.charCodeAt(i) > 10000 && tt.indexOf(cc.charAt(i)) != -1) str += ss.charAt(tt.indexOf(cc.charAt(i)));
		else str += cc.charAt(i)
	}
	return str
}
function setCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString()
	} else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/"
}
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
	}
	return null
}
function translateInitilization() {
	translateButtonObject = document.getElementById(translateButtonId);
	if (translateButtonObject) {
		with(translateButtonObject) {
			if (typeof(document.all) != "object") {
				href = "javascript:translatePage();"
			} else {
				href = "#";
				onclick = new Function("translatePage(); return false;")
			}
		}
		if (currentEncoding != targetEncoding) {
			setTimeout("translateBody()", translateDelay);
			if (targetEncoding == 1) translateButtonObject.innerHTML = msgToSimplifiedChinese;
			else translateButtonObject.innerHTML = msgToTraditionalChinese
		}
	}
}