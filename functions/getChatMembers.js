module.exports = async (vk, {
  peerId = null,
  fields = [],
}) => {
  if (!peerId) return false;

  return vk.api.messages.getConversationMembers({
    peer_id: peerId,
    fields,
  })
    .catch((e) => {
      console.error(e);
      return e;
    });
};
