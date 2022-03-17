package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"time"
	"tohopedia/config"
	"tohopedia/graph/model"

	// "github.com/google/uuid"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
    writeWait      = 10 * time.Second
    pongWait       = 60 * time.Second
    pingPeriod     = (pongWait * 9) / 10
    maxMessageSize = 512
)

// CreateNewSocketUser creates a new socket user
func CreateNewSocketUser(hub *Hub, connection *websocket.Conn, username string) {
    // uniqueID := uuid.New()
    client := &Client{
        hub:                 hub,
        webSocketConnection: connection,
        send:                make(chan SocketEventStruct),
        username:            username,
        userID:              username,
        // userID:              uniqueID.String(),
    }

	fmt.Println(client.hub)
	fmt.Println(client.webSocketConnection)
	fmt.Println(client.send)
	fmt.Println(client.username)
	fmt.Println(client.userID)

    go client.writePump()
    go client.readPump()

    client.hub.register <- client
}

// HandleUserRegisterEvent will handle the Join event for New socket users
func HandleUserRegisterEvent(hub *Hub, client *Client) {
    hub.clients[client] = true
    handleSocketPayloadEvents(client, SocketEventStruct{
        EventName:    "join",
        EventPayload: client.userID,
    })
}

// HandleUserDisconnectEvent will handle the Disconnect event for socket users
func HandleUserDisconnectEvent(hub *Hub, client *Client) {
    _, ok := hub.clients[client]
    if ok {
        delete(hub.clients, client)
        close(client.send)

        handleSocketPayloadEvents(client, SocketEventStruct{
            EventName:    "disconnect",
            EventPayload: client.userID,
        })
    }
}

// EmitToSpecificClient will emit the socket event to specific socket user
func EmitToSpecificClient(hub *Hub, payload SocketEventStruct, userID string) {
	log.Println("Emit To Specific Client")
    for client := range hub.clients {
        if client.userID == userID {
			log.Println("Client UserID: " + client.userID)
			log.Println(client.webSocketConnection)
			log.Println(client.hub)
            select {
            case client.send <- payload:
            default:
                close(client.send)
                delete(hub.clients, client)
            }
        }
    }
}

// BroadcastSocketEventToAllClient will emit the socket events to all socket users
func BroadcastSocketEventToAllClient(hub *Hub, payload SocketEventStruct) {
    for client := range hub.clients {
        select {
        case client.send <- payload:
        default:
            close(client.send)
            delete(hub.clients, client)
        }
    }
}

func handleSocketPayloadEvents(client *Client, socketEventPayload SocketEventStruct) {
    var socketEventResponse SocketEventStruct
    switch socketEventPayload.EventName {
    case "join":
        log.Printf("Join Event triggered")
        BroadcastSocketEventToAllClient(client.hub, SocketEventStruct{
            EventName: socketEventPayload.EventName,
            EventPayload: JoinDisconnectPayload{
                UserID: client.userID,
                Users:  getAllConnectedUsers(client.hub),
            },
        })

    case "disconnect":
        log.Printf("Disconnect Event triggered")
        BroadcastSocketEventToAllClient(client.hub, SocketEventStruct{
            EventName: socketEventPayload.EventName,
            EventPayload: JoinDisconnectPayload{
                UserID: client.userID,
                Users:  getAllConnectedUsers(client.hub),
            },
        })

    case "message":
        log.Printf("Message Event triggered")
        selectedUserID := socketEventPayload.EventPayload.(map[string]interface{})["userID"].(string)
		log.Println("Selected User ID: " + selectedUserID)
        socketEventResponse.EventName = "message response"
        socketEventResponse.EventPayload = map[string]interface{}{
            "username": selectedUserID,
            // "username": getUsernameByUserID(client.hub, selectedUserID),
            "message":  socketEventPayload.EventPayload.(map[string]interface{})["message"],
            "userID":   selectedUserID,
        }
        EmitToSpecificClient(client.hub, socketEventResponse, selectedUserID)
        if(keyExists(socketEventPayload.EventPayload.(map[string]interface{}), "message")) {
            db := config.GetDB()
            chatHeader := new(model.ChatHeader)

            db.Where("(customer_id = ? OR shop_id = ?) AND (customer_id = ? OR shop_id = ?)", selectedUserID, selectedUserID, client.userID, client.userID).Find(&chatHeader)

            if len(chatHeader.ID) > 0 {
                log.Println("Ada Chat Header")
                log.Println(chatHeader.ID)
                detail := &model.ChatDetails{
                	ID:           uuid.NewString(),
                	ChatHeaderId: chatHeader.ID,
                	Content:      socketEventPayload.EventPayload.(map[string]interface{})["message"].(string),
                	Sender:       client.userID,
                	Receiver:     selectedUserID,
                	CreatedAt:    time.Now(),
                }

                db.Create(detail)

            } else {
                log.Println("Gak Ada Chat Header")
                user := new(model.User)

                db.Where("id = ?", client.userID).First(&user)

                if user != nil && len(user.ID) > 0 {
                    chatHeader = &model.ChatHeader{
                        ID:         uuid.NewString(),
                        CustomerId: client.userID,
                        ShopId:     selectedUserID,
                    }
                } else {
                    chatHeader = &model.ChatHeader{
                        ID:         uuid.NewString(),
                        CustomerId: selectedUserID,
                        ShopId:     client.userID,
                    }
                }

                db.Create(chatHeader)

                detail := &model.ChatDetails{
                	ID:           uuid.NewString(),
                	ChatHeaderId: chatHeader.ID,
                	Content:      socketEventPayload.EventPayload.(map[string]interface{})["message"].(string),
                	Sender:       client.userID,
                	Receiver:     selectedUserID,
                	CreatedAt:    time.Now(),
                }

                db.Create(detail)
            }
        }
    }
}

func keyExists(decoded map[string]interface{}, key string) bool {
    val, ok := decoded[key]
    return ok && val != nil
}

func getUsernameByUserID(hub *Hub, userID string) string {
    var username string
    for client := range hub.clients {
        if client.userID == userID {
            username = client.username
        }
    }
    return username
}

func getAllConnectedUsers(hub *Hub) []UserStruct {
    var users []UserStruct
    for singleClient := range hub.clients {
        users = append(users, UserStruct{
            Username: singleClient.username,
            UserID:   singleClient.userID,
        })
    }
    return users
}

func (c *Client) readPump() {
    var socketEventPayload SocketEventStruct

    defer unRegisterAndCloseConnection(c)

    setSocketPayloadReadConfig(c)

    for {
        _, payload, err := c.webSocketConnection.ReadMessage()

        decoder := json.NewDecoder(bytes.NewReader(payload))
        decoderErr := decoder.Decode(&socketEventPayload)

        if decoderErr != nil {
            log.Printf("error: %v", decoderErr)
            break
        }

        if err != nil {
            if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
                log.Printf("error ===: %v", err)
            }
            break
        }

        handleSocketPayloadEvents(c, socketEventPayload)
    }
}

func (c *Client) writePump() {
    ticker := time.NewTicker(pingPeriod)
    defer func() {
        ticker.Stop()
        c.webSocketConnection.Close()
    }()
    for {
        select {
        case payload, ok := <-c.send:
            reqBodyBytes := new(bytes.Buffer)
            json.NewEncoder(reqBodyBytes).Encode(payload)
            finalPayload := reqBodyBytes.Bytes()

            c.webSocketConnection.SetWriteDeadline(time.Now().Add(writeWait))
            if !ok {
                c.webSocketConnection.WriteMessage(websocket.CloseMessage, []byte{})
                return
            }

            w, err := c.webSocketConnection.NextWriter(websocket.TextMessage)
            if err != nil {
                return
            }

            w.Write(finalPayload)

            n := len(c.send)
            for i := 0; i < n; i++ {
                json.NewEncoder(reqBodyBytes).Encode(<-c.send)
                w.Write(reqBodyBytes.Bytes())
            }

            if err := w.Close(); err != nil {
                return
            }
        case <-ticker.C:
            c.webSocketConnection.SetWriteDeadline(time.Now().Add(writeWait))
            if err := c.webSocketConnection.WriteMessage(websocket.PingMessage, nil); err != nil {
                return
            }
        }
    }
}

func unRegisterAndCloseConnection(c *Client) {
    c.hub.unregister <- c
    c.webSocketConnection.Close()
}

func setSocketPayloadReadConfig(c *Client) {
    c.webSocketConnection.SetReadLimit(maxMessageSize)
    c.webSocketConnection.SetReadDeadline(time.Now().Add(pongWait))
    c.webSocketConnection.SetPongHandler(func(string) error { c.webSocketConnection.SetReadDeadline(time.Now().Add(pongWait)); return nil })
}