import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Button } from "../components/Button/button";
import RupiahFormat from "../misc/currency";
import { User } from "../models/User";
import styles from "../styles/Cart.module.scss";

const Reksadana: NextPage = () => {
  const [socketConnection, setSocketConnection] = useState<WebSocket>();
  const [reksadanaPrice, setReksadanaPrice] = useState(0)
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

  const REKSADANA_QUERY = gql`
     query reksadanas{
      reksadanas {
        id
        price
        createdAt
      }
    }
   `;
  
  const {
     loading: load,
     error: err,
     data: data,
  } = useQuery(REKSADANA_QUERY);
  
  useEffect(() => {
    if (data?.reksadanas) {
      setReksadanaPrice(data?.reksadanas[0]?.price)
    }
  }, [data])

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

  const handleBuyReksadana = (price: number) => {
    try {
      if (
        socketConnection 
      ) {
        
        socketConnection.send(
          JSON.stringify({
            EventName: "public",
            EventPayload: {
              message: price,
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
      <h2>Reksadana Price: {RupiahFormat(reksadanaPrice)}</h2>
      <span>
        <Button disable={false} warning={false}>Buy</Button>
      </span>
      <span>
      <Button disable={false} warning={true}>Sell</Button>

      </span>
    </main>
  );
};

export default Reksadana;
