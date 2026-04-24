// TELEGRAM CHAT ID TO NUMBER API - DUAL BACKEND
// Developer: WASIF ALI | Telegram: @FREEHACKS95

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { userid } = req.query;

  if (!userid) {
    return res.status(200).send(JSON.stringify({
      success: false,
      message: "User ID required",
      example: "/api?userid=6450982524",
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    }, null, 2));
  }

  let cleanId = userid.toString().replace(/\D/g, '');

  try {
    // Backend 1: ayaanmods.site
    const url1 = `https://ayaanmods.site/sms.php?key=annonymoussms&term=${cleanId}`;
    // Backend 2: abhigyan-codes API
    const url2 = `https://abhigyan-codes-tg-to-number-api.onrender.com/@abhigyan_codes/userid=${cleanId}`;

    const [res1, res2] = await Promise.allSettled([
      fetch(url1),
      fetch(url2)
    ]);

    let finalNumber = null;
    let finalCountry = null;
    let finalCountryCode = null;

    // Process Backend 1 (ayaanmods)
    if (res1.status === 'fulfilled' && res1.value.ok) {
      try {
        const data = await res1.value.json();
        if (data.success && data.result?.number) {
          finalNumber = data.result.number;
          finalCountry = data.result.country;
          finalCountryCode = data.result.country_code;
        }
      } catch(e) {}
    }

    // Process Backend 2 (abhigyan) - only if Backend 1 didn't get data
    if (!finalNumber && res2.status === 'fulfilled' && res2.value.ok) {
      try {
        const data = await res2.value.json();
        if (data.result?.success && data.result?.number) {
          finalNumber = data.result.number;
          finalCountry = data.result.country;
          finalCountryCode = data.result.country_code;
        }
      } catch(e) {}
    }

    if (!finalNumber) {
      return res.status(200).send(JSON.stringify({
        success: false,
        message: "Number not found",
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95"
      }, null, 2));
    }

    const result = {
      success: true,
      user_id: cleanId,
      country: finalCountry,
      country_code: finalCountryCode,
      number: finalNumber,
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    };

    return res.status(200).send(JSON.stringify(result, null, 2));

  } catch (error) {
    return res.status(200).send(JSON.stringify({
      success: false,
      message: "Service unavailable",
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    }, null, 2));
  }
}
