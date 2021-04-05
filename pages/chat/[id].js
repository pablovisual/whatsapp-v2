/**the whole purpose of this chat/[id].js is for the complexity
 * of clicking to a chat route page with having the id hash on the link
 * for example localhost:3000/chat/N8vpZq07y8Ysj6nBquM8
*/
import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chatting with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />

      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}

export default Chat;

/**context allows you to access the params of the url and 
 * the root url when you are on the server.
 */
export async function getServerSideProps(context) {
  /**the first reference is going to be the collection of chats
   * then go into the document of the chat ogf the chat id which is the
   * big hash (localhost:3000/chat/N8vpZq07y8Ysj6nBquM8
  */
  const ref = db.collection("chats").doc(context.query.id);

  //prep the messages before hand
  const messagesRes = await ref.collection("messages").orderBy("timestamp", "asc").get();

  const messages = messagesRes.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(), //spread the data to simplify the array that we are going to send to the client
    })).map((messages) => ({
      ...messages,
      //you will lose the timestamp when sending from the backend server to the frontend client side so we do
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  //prep the chats
  const chatRes = await ref.get();

  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  }

  /**return an object where we pass in the messages using stringfy(messages) 
   * because we cant pass complicated or just an object throughout the network
   * we need to turn to a string to send and then parse it
  */
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    }
  }
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /**IE and Edge */
  scrollbar-width: none; /**Firefox */
`;

