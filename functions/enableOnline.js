module.exports = (vk) => {
  const { groups: groupsApi } = vk.api;
  let currentGroup = {};

  groupsApi.getById()
    .then((groups) => {
      [currentGroup] = groups;

      return groupsApi.getOnlineStatus({ group_id: currentGroup.id });
    })
    .then((res) => {
      if (res.status === 'online') {
        console.info('[ONLINE] Already online');
        return true;
      }

      console.info('[ONLINE] Online set');

      return groupsApi.enableOnline({ group_id: currentGroup.id });
    })

    .catch(console.error);
};
