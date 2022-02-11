const { format, add } = require('date-fns');
const { values } = require('lodash');
const { VK } = require('vk-io');
const { getters: storeGetters } = require('../store');
const { token } = require('../config');

const formatDate = (dateString, dateFormat = 'dd.MM') => format(new Date(dateString), dateFormat);
const addToDate = (dateString, duration = { days: 1 }) => add(new Date(dateString), duration);
const isAdmin = (userId) => {
  const admins = storeGetters.getAdmins();

  return values(admins).includes(userId);
};

const getCommand = (commands, commandName) => {
  let command;

  if (commands.get(commandName)) return commands.get(commandName);

  commands.forEach((c) => {
    if (!command && c.aliases && c.aliases.includes((commandName))) command = c;
  });

  return command;
};

const getRandomInt = ({ min = 0, max = 1 }) => {
  const minRange = Math.ceil(min);
  const maxRange = Math.floor(max);

  return Math.floor(Math.random() * (maxRange - minRange + 1) + minRange);
};

const getRandomArrayItem = (arr) => arr[getRandomInt({ max: arr.length - 1 })];
const getChatMembers = async (vk, { peerId = null, fields = [] }) => {
  if (!peerId) return false;

  return vk.api.messages.getConversationMembers({ peer_id: peerId, fields })
    .catch((e) => {
      console.error(e);
      throw e;
    });
};

const getUsers = async (vk, { userIds = null, fields = [], nameCase = 'nom' }) => {
  if (!userIds) return false;

  return vk.api.users.get({ user_ids: userIds, fields, name_case: nameCase })
    .catch((e) => {
      console.error(e);
      throw e;
    });
};

const sendMessage = async (vk, {
  peerId = null,
  message = '',
  attachment = null,
  dontParseLinks = true,
}) => {
  if (!peerId) return false;

  const vkApi = vk || new VK({ token, language: 'ru' });

  return vkApi.api.messages.send({
    message,
    attachment,
    peer_id         : peerId,
    random_id       : getRandomInt({ max: 999 }),
    dont_parse_links: dontParseLinks,
  })
    .catch((e) => {
      console.error(e);
      throw e;
    });
};

module.exports = {
  isAdmin,
  getCommand,
  getRandomArrayItem,
  getRandomInt,
  formatDate,
  addToDate,
  getChatMembers,
  getUsers,
  sendMessage,
};
