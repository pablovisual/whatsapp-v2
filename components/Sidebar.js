import styled from "styled-components";
import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from "./Chat";

const Sidebar = () => {
  /**keeps track of the users authentication */
  const [user] = useAuthState(auth);

  /**what this does is goes to our firestore database and
   * basically queiries the user arrays and checks where our email
   * is seen not for the other person
   */
  const userChatRef = db.collection("chats").where("users", "array-contains", user.email);

  /**gives me a snapshot of the database */
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    //prompt the user to who they want to chat with
    const input = prompt("Please enter an email for the user you wish to chat with");

    /**protect code from invalidation */
    if (!input) return null;

    /**check to see if the email is valid or not
     * and if its not the same person/email
     */
    if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
      /**we heed to add the chat into the DB "chats" collection, and if the chat with that 
       * persons email doesnt already exists and is valid*/
      db.collection('chats').add({
        users: [user.email, input],
      });
    }
  };

  /**the person you're intending to chat with
   * and check if a chat exists or not
  */
  const chatAlreadyExists = (recipientEmail) => 
    /**check to see if imma find a record */
    /**this either return an element but if it doesnt find anything then
     * return null or undefined
    */

    /**the double !! will turn it into either true if it returns to show there already is
     * a person with that email in the chat or false if not */
    !!chatsSnapshot?.docs.find(
      (chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0);

  return (
    <Container>
      <Header>
        {/**have user logo be logout button */}
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput />
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {/** List of chats */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  )
}

export default Sidebar

/** */
const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 300px;
  overflow-y: scroll hidden;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const IconsContainer = styled.div``;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;