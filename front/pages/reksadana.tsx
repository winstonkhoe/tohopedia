import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Button } from "../components/Button/button";
import { User } from "../models/User";
import styles from "../styles/Cart.module.scss";

const Reksadana: NextPage = () => {
  const [socketConnection, setSocketConnection] = useState<WebSocket>();
  const WSAddress = `ws://localhost:8080/ws/`;
  const { addToast } = useToasts();
  const userData = useContext<User>(userDetailsContext);
  useEffect(() => {
    if (window["WebSocket"]) {
      setSocketConnection(new WebSocket(WSAddress + userData?.id));
    }

  }, [WSAddress, userData]);

  useEffect(() => {
    addToast("TADAA This is Error Message", {appearance: "error"})
  }, [])

  const CHATS_QUERY = gql`
     query GetChats($id: String!) {
       getChats(id: $id) {
         id
         sender
         receiver
         content
         createdAt
       }
     }
   `;

  if (socketConnection !== null && socketConnection !== undefined) {
    socketConnection.onclose = (evt) => {
      addToast("Your Connection is closed", { appearance: "error" });
      // alert("Your Connection is closed.");
      // setChatInput('Your Connection is closed.')
    };

    socketConnection.onmessage = (event) => {
      try {
        const socketPayload = JSON.parse(event.data);
        switch (socketPayload.eventName) {
          case "join":
          case "disconnect":
            if (!socketPayload.eventPayload) {
              return;
            }

            const userInitPayload = socketPayload.eventPayload;

            // alert("masuk daleman")
            // this.setState({
            //   chatUserList: userInitPayload.users,
            //   userID:
            //     this.state.userID === null
            //       ? userInitPayload.userID
            //       : this.state.userID,
            // });

            break;

          case "message response":
            if (!socketPayload.eventPayload) {
              return;
            }

            const messageContent = socketPayload.eventPayload;
            const sentBy = messageContent.username
              ? messageContent.username
              : "An unnamed fellow";
            const actualMessage = messageContent.message;

            // this.setState({
            //   message: `${sentBy} says: ${actualMessage}`,
            // });
            // alert(`${sentBy} says: ${actualMessage}`);
            break;

          default:
            break;
        }
      } catch (error) {
        console.log(error);
        console.warn("Something went wrong while decoding the Message Payload");
      }
    };
  }

  const handleSendChat = () => {
    try {
      if (
        socketConnection 
      ) {
        // console.log(JSON.stringify({
        //   EventName: "message",
        //   EventPayload: {
        //     userID: targetId,
        //     // userID: dat.id,
        //     // userID: "75f4575c-c2a8-4189-9302-dccb8eb6a643",
        //     message: chatInput,
        //   },
        // }))
        socketConnection.send(
          JSON.stringify({
            EventName: "public",
            EventPayload: {
              message: chatInput,
            },
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.cart_header_container}>
        <h3 className={styles.cart_header_text}>Reksadana</h3>
      </div>
      <Button disable={false} warning={false}>Buy</Button>
      <Button disable={false} warning={true}>Sell</Button>
    </main>
  );
};

export default Reksadana;
