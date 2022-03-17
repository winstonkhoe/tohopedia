package model

import "time"

// type Chat struct {
// 	ID        string    `json:"id"`
// 	SenderModel  ChatSenderReceiver    `json:"senderModel"`
// 	Sender    string    `json:"sender"`
// 	ReceiverModel  ChatSenderReceiver    `json:"receiverModel"`
// 	Receiver  string    `json:"receiver"`
// 	Content   string    `json:"content"`
// 	CreatedAt time.Time `json:"createdAt"`
// }

// type Chat struct {
// 	ID        string             `json:"id"`
// 	// SenderId	string			 `json:"senderId" gorm:"size:191"`
// 	// SenderId	string			 `json:"senderId" gorm:"size:191"`
// 	// Sender    ChatSenderReceiver `json:"sender"`
// 	// ReceiverId	string			 `json:"receiverId" gorm:"size:191"`
// 	// ReceiverId	string			 `json:"receiverId" gorm:"size:191"`
// 	// Receiver  ChatSenderReceiver `json:"receiver"`
// 	Content   string             `json:"content"`
// 	CreatedAt time.Time          `json:"createdAt"`
// }

type Chat struct {
	ID            string             `json:"id"`
	// SenderModel   *ChatSenderReceiver `json:"senderModel"`
	Sender        string             `json:"sender"`
	// ChatSenderReceiverId   string `json:"receiverModelId"`
	// ReceiverModel *ChatSenderReceiver `json:"receiverModel"`
	Receiver      string             `json:"receiver"`
	Content       string             `json:"content"`
	CreatedAt     time.Time          `json:"createdAt"`
}

type ChatHeader struct {
	ID             string         `json:"id"`
	Details        []*ChatDetails `json:"details"`
	CustomerId		string		  `json:"customerId" gorm:"size:191"`
	Customer       *User          `json:"customer"`
	ShopId			string		  `json:"ShopId" gorm:"size:191"`
	Shop           *Shop          `json:"shop"`
}

type ChatDetails struct {
	ID         string      `json:"id"`
	ChatHeaderId string `json:"chatHeaderId" gorm:"size:191"`
	ChatHeader *ChatHeader `json:"chatHeader"`
	Content    string      `json:"content"`
	Sender     string      `json:"sender"`
	Receiver   string      `json:"receiver"`
	CreatedAt  time.Time   `json:"createdAt"`
}
