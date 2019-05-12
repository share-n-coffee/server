function checkUserFields(usersData) {
  const checkedUsers = usersData.filter(user => {
    return user.events && user.events.length > 0 && user.department;
  });
  return checkedUsers;
}

module.exports = checkUserFields;
