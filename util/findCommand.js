module.exports = (commandName, commands) => {
  let command;

  if (commands.get(commandName)) return commands.get(commandName);

  commands.forEach((c) => {
    if (!command && c.aliases && c.aliases.includes((commandName))) command = c;
  });

  return command;
};
