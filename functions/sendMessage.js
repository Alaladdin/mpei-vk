const rand = require('../util/random');

module.exports = async (vk, {
  peerId = null,
  message = '',
  attachment = null,
  dontParseLinks = true,
}) => {
  if (!peerId) return false;

  return vk.api.messages.send({
    peer_id: peerId,
    message,
    attachment,
    random_id: rand.int({ max: 999 }),
    dont_parse_links: dontParseLinks,
  });
};
