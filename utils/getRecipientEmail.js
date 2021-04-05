/**this going to taking an array taking the user who is currently
 * logged in and basically return a string user so that we have a string
 * value of the recipient the user is talking to
*/

const getRecipientEmail = (users, userLoggedIn) =>
  users?.filter(userToFilter => userToFilter !== userLoggedIn?.email)[0];

export default getRecipientEmail;