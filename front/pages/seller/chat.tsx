import { gql, useLazyQuery, useQuery } from "@apollo/client";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { ShopIcon } from "../../components/ShopDetails/ShopDetails";
import { UserNavbar } from "../../components/Bars/user_navbar";
import { GreenLabel } from "../../components/transaction/TransactionStatus";
import {
  datesAreOnSameDay,
  toHourMinute,
  toIndonesianDateShort,
} from "../../misc/date";
import { stateContext } from "../../services/StateProvider";
import { userDetailsContext } from "../../services/UserDataProvider";
import styles from "./chat.module.scss";
import SellerLayout from "./layout";
import { Shop } from "../../models/Shop";

export default function SellerChat (props: { children: any }) {
  const { addToast } = useToasts();
  const [socketConnection, setSocketConnection] = useState<WebSocket>();
  const [chatInput, setChatInput] = useState("");
  const [chatList, setChatList] = useState<
    { content: string; opponent: boolean; time: Date }[]
  >([]);
  const [chatDestination, setChatDestination] = useState("");
  const WSAddress = `ws://localhost:8080/ws/`;

  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Chat | Tohopedia");
  }, [setPageTitle]);

  const shopData: Shop = useContext(userDetailsContext)?.shop;

  useEffect(() => {
    if (window["WebSocket"]) {
      setSocketConnection(new WebSocket(WSAddress + shopData?.id));
    }

  }, [WSAddress, shopData]);

  function getChatObj(customerId: string) {
    return shopData?.chats?.filter((chat: any) => {
      return chat?.customer?.id === customerId;
    })[0];
  }

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

            setChatList([
              ...chatList,
              { content: actualMessage, opponent: true, time: new Date() },
            ]);

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
        socketConnection &&
        chatDestination !== "" &&
        chatInput.trim().length > 0
      ) {
        socketConnection.send(
          JSON.stringify({
            EventName: "message",
            EventPayload: {
              userID: chatDestination,
              // userID: dat.id,
              // userID: "75f4575c-c2a8-4189-9302-dccb8eb6a643",
              message: chatInput,
            },
          })
        );
        setChatList([
          ...chatList,
          { content: chatInput, opponent: false, time: new Date() },
        ]);
        setChatInput("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className={styles.main}>
      {/* <div className={styles.main_container}> */}
        <div className={styles.main_inner_container}>
          {/* <UserNavbar /> */}

          {/* Menu Settings */}
          <div className={styles.main_right_container}>
            <div className={styles.right_flex_container}>
              <div className={styles.chat_list_wrapper}>
                <div className={styles.chat_list_top_wrapper}>
                  <div className={styles.chat_list_top_header}>
                    <h1>Chat</h1>
                  </div>
                  <div className={styles.chat_list_search_wrapper}></div>
                </div>
                <div className={styles.chat_list_bottom_wrapper}>
                  {/* {shopData?.chats?.map((chat: any, index: number) => { */}
                  {shopData?.chats?.map((chat: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className={styles.chat_list_item_wrapper}
                        onClick={() => {
                          setChatDestination(chat?.customer?.id);
                        }}
                      >
                        {/* ${styles.chat_list_item_flex} --> untuk inactive */}
                        <div
                          className={`${
                            chatDestination == chat?.shop?.id
                              ? styles.chat_list_item_flex_active
                              : styles.chat_list_item_flex
                          }`}
                        >
                          <div className={styles.shop_image_wrapper}>
                            <div className={styles.shop_image_relative}>
                              <Image
                                src={`/uploads/${chat?.customer?.image}`}
                                alt=""
                                layout="fill"
                              />
                            </div>
                          </div>
                          <div className={styles.shop_name_wrapper}>
                            <div className={styles.shop_name_flex}>
                              <h3>{chat?.customer?.name}</h3>
                              {/* <GreenLabel text="Penjual" /> */}
                            </div>
                            <div className={styles.shop_chat_hints_container}>
                              {/* <div>{getChatObj(receiverId)[0]?.content}</div> */}
                              <div>
                                {
                                  chat?.details[chat?.details?.length - 1]
                                    ?.content
                                }
                              </div>
                            </div>
                          </div>
                          <div className={styles.chat_time_wrapper}>
                            <div className={styles.chat_time_container}>
                              {toHourMinute(chat?.details[chat?.details?.length - 1]?.createdAt)}
                              {/* {toHourMinute(getChatObj(receiverId)[0]?.createdAt)} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.chat_details_wrapper}>
                {chatDestination === "" ? (
                  <div className={styles.empty_chat_image_wrapper}>
                    <div className={styles.empty_chat_image}>
                      <div className={styles.empty_chat_image_content}>
                        <div className={styles.empty_chat_image_relative}>
                          <Image
                            src={"/assets/chat_empty.png"}
                          alt=""
                            layout="fill"
                          />
                        </div>
                        <h1>Mari memulai obrolan!</h1>
                        <p>
                          Pilih pesan di samping untuk mulai chat dengan
                          penjual.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.chat_details_flex}>
                    <div className={styles.chat_details_top_wrapper}>
                      <div className={styles.chat_details_top_profile}>
                        <Image
                          src={`/uploads/${
                            getChatObj(chatDestination)?.customer?.image
                          }`}
                          alt=""
                          layout="fill"
                        />
                      </div>
                      <div className={styles.chat_details_top_shop_detail}>
                        <div className={styles.profile_name_wrapper}>
                          {/* <div className={styles.shop_type}>
                            <ShopIcon type={2} />
                          </div> */}
                          <p>{getChatObj(chatDestination)?.customer?.name}</p>
                          {/* <GreenLabel text="Penjual" /> */}
                        </div>
                        <p>Terakhir online 3 jam yang lalu</p>
                      </div>
                      <div className={styles.chat_details_top_icon}></div>
                    </div>
                    <div className={styles.chat_details_bottom_wrapper}>
                      <div className={styles.chat_content_wrapper}>
                        <div className={styles.chat_content_container}>
                          <div
                            className={styles.chat_content_overflow_container}
                          >
                            <div
                              className={styles.chat_content_inner_container}
                            >
                              {/* <div className={styles.chat_content_date}>
                                <span>8 Mar 2022</span>
                              </div> */}
                              {getChatObj(chatDestination)?.details.map(
                                (detail: any, index: number) => {
                                  return (
                                    <div key={index}>
                                      {index == 0 ||
                                      (index > 0 &&
                                        !datesAreOnSameDay(
                                          new Date(
                                            getChatObj(
                                              chatDestination
                                            )?.details[index - 1]?.createdAt
                                          ),
                                          new Date(detail?.createdAt)
                                        )) ? (
                                        <div
                                          key={detail?.createdAt}
                                          className={styles.chat_content_date}
                                        >
                                          <span>
                                            {toIndonesianDateShort(
                                              detail?.createdAt
                                            )}
                                          </span>
                                          {/* <span>8 Mar 2022</span> */}
                                        </div>
                                      ) : null}

                                      <div
                                        className={`${styles.chat_item} ${
                                          styles.inbox
                                        } ${
                                          detail?.sender === shopData?.id
                                            ? styles.sender
                                            : null
                                        }`}
                                      >
                                        <div className={styles.message_wrapper}>
                                          <div
                                            className={`${styles.message_content} ${styles.inline}`}
                                          >
                                            <span>{detail?.content}</span>
                                          </div>
                                          <div
                                            className={
                                              styles.message_time_status
                                            }
                                          >
                                            <div>
                                              <span>
                                                {toHourMinute(
                                                  detail?.createdAt
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                              {chatList.map((chat: any, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className={`${styles.chat_item} ${
                                      styles.inbox
                                    } ${
                                      chat.opponent === false
                                        ? styles.sender
                                        : null
                                    }`}
                                  >
                                    <div className={styles.message_wrapper}>
                                      <div
                                        className={`${styles.message_content} ${styles.inline}`}
                                      >
                                        <span>{chat?.content}</span>
                                      </div>
                                      <div
                                        className={styles.message_time_status}
                                      >
                                        <div>
                                          <span>
                                            {toHourMinute(chat?.time)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className={styles.chat_input_wrapper}>
                          <div className={styles.chat_input_text_wrapper}>
                            <div className={styles.chat_input_text_container}>
                              <textarea
                                name=""
                                id=""
                                rows={1}
                                placeholder="Tulis pesan..."
                                value={chatInput}
                                onChange={(e) => {
                                  setChatInput(e.target.value);
                                }}
                              ></textarea>
                            </div>
                          </div>
                          <button
                            className={styles.button_send_chat}
                            onClick={handleSendChat}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="22"
                              height="22"
                              fill="var(--N0, #FFFFFF)"
                            >
                              <path d="M21.35 11.32L5.66 3.19a1.81 1.81 0 00-1.81.28 1.8 1.8 0 00-.55 1.77L4.72 12 3.3 18.71a1.75 1.75 0 00.7 1.81 1.68 1.68 0 001 .34c.266 0 .528-.069.76-.2l15.61-8a.759.759 0 00.41-.67.77.77 0 00-.43-.67zM5 19.34a.14.14 0 01-.15 0 .27.27 0 01-.1-.27L6 13.36l6.8-.87a.5.5 0 000-1L6 10.61 4.76 4.93a.33.33 0 01.07-.32.32.32 0 01.17-.06L19.36 12 5 19.34z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <input type="file" accept="image/*" hidden />
              </div>
            </div>
          </div>
          {/* END Menu Settings */}
        </div>
      {/* </div> */}
    </main>
  );
};

SellerChat.getLayout = function getLayout(page: any) {
  return <SellerLayout>{page}</SellerLayout>;
};
