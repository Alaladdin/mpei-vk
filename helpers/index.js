const { format, add, sub, differenceInMinutes } = require('date-fns');
const { find } = require('lodash');

const formatDate = (dateString, dateFormat = 'dd.MM') => format(new Date(dateString), dateFormat);
const addToDate = (dateString, duration = { days: 1 }) => add(new Date(dateString), duration);
const removeFromDate = (dateString, duration = { days: 1 }) => sub(new Date(dateString), duration);
const getDateDiffInMinutes = (dateLeft, dateRight) => differenceInMinutes(dateLeft, dateRight);

const getCommand = (commands, commandName) => {
  const command = commands.get(commandName);

  if (!command) {
    const commandsArray = Array.from(commands.values());

    return find(commandsArray, (c) => !!c.aliases && c.aliases.includes((commandName)));
  }

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

  return vk.api.messages.send({
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

const handleError = (error, vk) => {
  console.error(error);

  return sendMessage(vk, {
    peerId : 161372337,
    message: `Error: ${error}`,
  });
};

module.exports = {
  getCommand,
  getRandomArrayItem,
  getRandomInt,
  formatDate,
  addToDate,
  removeFromDate,
  getDateDiffInMinutes,
  getChatMembers,
  getUsers,
  sendMessage,
  handleError,
};
