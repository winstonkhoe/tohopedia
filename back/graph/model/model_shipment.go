package model

type Shipment struct {
	ID             string        `json:"id"`
	Name           string        `json:"name"`
	Duration       int           `json:"duration"`
	ShipmentTypeId string        `json:"shipmentTypeId" gorm:"size:191"`
	ShipmentType   *ShipmentType `json:"shipmentType"`
	Price          int           `json:"price"`
}

type ShipmentType struct {
	ID        string      `json:"id"`
	Name      string      `json:"name"`
	Shipments []*Shipment `json:"shipments"`
}
