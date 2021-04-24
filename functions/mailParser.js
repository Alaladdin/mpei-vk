const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const puppeteer = require('puppeteer');
const rand = require('../utility/random');
const {
  mpeiLogin,
  mpeiPass,
  chatIds,
  waitUnread,
} = require('../config');

module.exports.mailParser = async (vk) => {
  const { upload } = vk;
  const browser = await puppeteer.launch({
    product: 'chrome',
    defaultViewport: {
      width: 1080,
      height: 720,
    },
  });
  const page = await browser.newPage();

  const saveCookies = async () => {
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies);
    if (cookieJson) {
      await fs.writeFile(path.resolve(__dirname, '../cookies.json'), cookieJson);
      console.info('[COOKIES] Cookies ws saved');
    }
  };

  const readCookies = async () => {
    try {
      return JSON.parse((await fs.readFile(path.resolve(__dirname, '../cookies.json'), 'utf-8')).trim());
    } catch (err) {
      return [];
    }
  };

  const setPageCookies = async (cookiesArr) => {
    const cookies = cookiesArr || await readCookies();

    if (cookies) {
      await page.setCookie(...cookies);
      console.info('[COOKIES] Cookies have been set');
    }
  };

  const screenShot = async (fileName, options = {}) => {
    const defaults = {
      ...options,
      type: 'jpeg',
      quality: 100,
      fullPage: false,
    };
    return page.screenshot({
      ...defaults,
      path: `./files/${fileName}`,
    });
  };

  const openUnread = async () => {
    await page.goto('https://legacy.mpei.ru/owa/');
    console.info('waiting for unread...');
    const unreadSelector = '.cntnt .bld';
    console.log(format(Date.now(), 'HH:mm:ss'));
    return page.waitForSelector(unreadSelector, { timeout: waitUnread })
      .then(async (element) => {
        await element.click();
      })
      .catch(async () => {
        await page.reload();
        await openUnread();
      });
  };

  const sendContent = async () => {
    const fileData = await fs.readFile('./files/letter.jpg');
    let mailLinks = await page.$$eval('.cntnttp .bdy a', (links) => links && links.map((link) => link.textContent.trim()));
    mailLinks = mailLinks && mailLinks.filter((link, i) => mailLinks.indexOf(link) === i && link.match(/(\/\/mpei.webex)/g));

    return chatIds.forEach((chat) => {
      upload.messagePhoto({
        peer_id: chat.peerId,
        source: {
          value: fileData,
        },
      })
        .then(async (a) => {
          await vk.api.messages.send({
            peer_id: chat.peerId,
            random_id: rand.int(999),
            message: mailLinks ? mailLinks.join('\n') : '',
            attachment: `photo${a.ownerId}_${a.id}`,
          });
        });
    });
  };

  const login = async () => {
    console.log('[LOGIN]');

    await page.type('#username', mpeiLogin);
    await page.type('#password', mpeiPass);
    await page.click('.signinTxt');

    await saveCookies();
  };

  const listenUnread = async () => {
    await openUnread()
      .then(async () => {
        const el = '.cntnttp table';
        await page.waitForSelector(el, { timeout: 0 });
        const mailBody = await page.$(el).then((elem) => elem.boundingBox());

        await screenShot('letter.jpg', {
          clip: {
            ...mailBody,
            y: mailBody.y + 30,
            height: mailBody.height - 10,
          },
        });
        await sendContent();
        await listenUnread();
      });
  };

  const run = async () => {
    console.info('[RUN]');
    await page.goto('https://legacy.mpei.ru/owa');
    await login();
    await listenUnread();
  };

  await run();
};
