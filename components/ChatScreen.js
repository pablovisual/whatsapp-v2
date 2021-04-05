import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import { useRef, useState } from "react";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);

  /**what we are going to do is map to the <Input> field */
  const [input, setInput] = useState("");

  /**this will connect a pointer to that element and basically
   * scroll to that recent message that was sent from either
   * party in the chat
  */
  const endOfMessageRef = useRef(null);

  const router = useRouter();

  /**we go into the chats collection and then go into the doc to get the id by going into
   * root query to get that id.*/
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
  );

  /**an anon. function that return some jsx with some logic*/
  const showMessages = () => {
    /**first  map and get the messages*/
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        /**have Message being rendered on the screen so each individual message will be
         * its own component because that will make the whole thing
         * a lot more reusable, easier to use.
        */
        //pass some props from messagesSnapshot being mapped
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))
    }

    /**else we return by parsing after we json stringigy from
     * the server then pass the message that we get back. we map
     * and just call Message component with key, user and message
     * props
     */
    else {
      return JSON.parse(messages).map(message => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  /**for endOfMessage, get the current thing youre pointing at
   * then scroll into view and then you add these two
   * for behavior to be smooth and block start for a nice
   * trick
  */
  const ScrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    /**this will update the last seen message */
    db.collection("users").doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    /**then we go into collection of chats and go 
     * into the router query of id which is what 
     * tells which chat we are in and add in the
     * timestamp of whereever they are in the world,
     * their message with user email and photo url 
    */
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    })

    /**set the input to a blank string after adding the message to the
     * to database
    */
    setInput("");
    ScrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>Last Active: {" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : "Unavailable"}
            </p>
          ) : (
            <p>Loading Last Active...</p>
          )}
          {console.log(new Date(recipient?.lastSeen?.toDate().toUTCString()))}
        </HeaderInformation>

        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {/**show messages */}
        {showMessages()}
        <EndofMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div``;

/**this div has the whole avatar, header info and the two buttons */
const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1; //take the majority of space and make the two buttons at the far right

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh; 
`;

const EndofMessage = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: whitesmoke;
  margin-left: 15px;
  margin-right: 15px;
`;
