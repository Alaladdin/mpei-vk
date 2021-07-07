module.exports = async (vk, {
  userIds = null,
  fields = [],
  nameCase = 'nom',
}) => {
  if (!userIds) return false;

  return vk.api.users.get({
    user_ids: userIds,
    fields,
    name_case: nameCase,
  })
    .catch((e) => {
      console.error(e);
      return e;
    });
};
