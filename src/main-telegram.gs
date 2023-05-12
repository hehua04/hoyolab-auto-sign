const profiles = [
  { token: "ltoken=gBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxCY; ltuid=26XXXXX20;", genshin: true, honkai_star_rail: true, honkai_3: false }
];

const telegram_notify = true
const telegramBotToken = "6XXXXXXXXX:AAAAAAAAAAXXXXXXXXXX8888888888Peko"
const myTelegramID = "1XXXXXXX0"

/** The above is the config. Please refer to the instructions on https://github.com/canaria3406/hoyolab-auto-sign/ for configuration. **/
/** The following is the script code. Please DO NOT modify. **/

const urlDict = {
  Genshin: "https://sg-hk4e-api.hoyolab.com/event/sol/sign?lang=en-us&act_id=e202102251931481",
  Star_Rail: "https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=en-us&act_id=e202303301540311",
  Honkai_3: "https://sg-public-api.hoyolab.com/event/mani/sign?lang=en-us&act_id=e202110291205111"
}

function main(){

  let hoyolabResp = ""
  profiles.forEach(profile => {
    hoyolabResp += autoSignFunction(profile) + "\n\n";
  });

  if(telegram_notify == true){
    if(telegramBotToken && myTelegramID){
      postWebhook(hoyolabResp);
    }
  }

}

function autoSignFunction({ token, genshin, honkai_star_rail, honkai_3 }) {

  const urls = [];

  if (genshin) urls.push(urlDict.Genshin);
  if (honkai_star_rail) urls.push(urlDict.Star_Rail);
  if (honkai_3) urls.push(urlDict.Honkai_3);

  const header = {
    Cookie: token
  };

  const options = {
    method: 'POST',
    headers: header,
    muteHttpExceptions: true,
  };

  let response = "";

  urls.forEach(url => {
    let hoyolabResponse_gs = UrlFetchApp.fetch(url,options);
    const checkInResult = JSON.parse(hoyolabResponse_gs).message;
    const gameName = Object.keys(urlDict).find(key => urlDict[key] === url)?.replace(/_/g, " ");
    response += `\n${gameName}: ${checkInResult}`;
  });

  return response;
}

function postWebhook(data) {

  let payload = JSON.stringify({
    "chat_id": myTelegramID,
    "text": data,
    "parse_mode": "HTML"
  });

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: payload,
    muteHttpExceptions: true,
  };

  UrlFetchApp.fetch("https://api.telegram.org/bot" + telegramBotToken + "/sendMessage", options);
}
