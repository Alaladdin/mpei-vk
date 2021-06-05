const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const sendMessage = require('./sendMessage');
const sendMessageToAdmins = require('./sendMessageToAdmins');
const { texts } = require('../data/messages');
const {
  mpeiLogin,
  mpeiPass,
  chatIds,
} = require('../config');

const { status: statusTexts } = texts;

module.exports.mailParser = async (vk) => {
  const { upload } = vk;
  const filesPath = path.join(__dirname, '../files');
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    defaultViewport: {
      width: 1080,
      height: 720,
    },
  });
  const page = await browser.newPage();

  // create files folder, if not exists
  if (!fs.existsSync(filesPath)) fs.mkdirSync(filesPath);

  // takes page screen shot
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

  // open unread
  const openUnread = async () => {
    const unreadSelector = '.cntnt .bld';
    await page.goto('https://legacy.mpei.ru/owa/');

    if (!await page.url().match(/https:\/\/legacy.mpei.ru\/owa\//)) {
      await sendMessageToAdmins(vk, `${statusTexts.loginError}\nСтраница: ${await page.url()}`);
      await browser.close();
    }

    return page.waitForSelector(unreadSelector, { timeout: 50000 })
      .then(async (element) => {
        const unreadTitle = await page.$eval(unreadSelector, (titleEl) => titleEl.textContent.trim());
        // open letter
        await element.click();
        if (unreadTitle.match(/(github|disarmed|spam|ticket|Изменение статуса отчёта)/gi)) {
          await sendMessageToAdmins(vk, ['Пропущено сообщение', `Заголовок: ${unreadTitle}`].join('\n'));
          throw new Error('not allowed letter');
        }
      });
  };

  // send mail content
  const sendMailContent = async () => {
    const fileData = await fs.promises.readFile(path.resolve(__dirname, '../files/letter.jpg'));
    const pageText = await page.$eval('body', (el) => el.textContent);
    const filteredPageText = pageText.match(/(^((?!.*(тема|webex|набрать|можно|присоед).*).))(.*(совещания|совещание).*)/gim) || [];
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
          await sendMessage(vk, {
            peerId: chat.peerId,
            attachment: `photo${a.ownerId}_${a.id}`,
            message: [...filteredPageText, ...mailLinks].join('\n') || '',
          });
        });
    });
  };

  // login
  const login = async () => {
    await page.type('#username', mpeiLogin);
    await page.type('#password', mpeiPass);
    await page.click('.signinTxt');
  };

  const listenUnread = async () => openUnread()
    .then(async () => {
      const mailEl = '.cntnttp table';
      await page.waitForSelector(mailEl, { timeout: 0 });
      const mailBody = await page.$(mailEl).then((body) => body.boundingBox());

      await screenShot('letter.jpg', {
        clip: {
          ...mailBody,
          y: mailBody.y + 30,
          height: mailBody.height - 10,
        },
      });
      await sendMailContent();
      await listenUnread();
    })
    .catch(() => browser.close());

  // run
  const run = async () => {
    await page.goto('https://legacy.mpei.ru/owa');
    await login();
    await listenUnread();
  };

  // call run and catch errors
  run()
    .catch((err) => {
      console.info('[MAIL PARSER] error');
      console.error(err);
      sendMessageToAdmins(vk, `[MAIL PARSER] ${statusTexts.crashError}`);
    })
    .then(() => browser.close());
};
