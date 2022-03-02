package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"tohopedia/config"
	"tohopedia/graph/generated"
	"tohopedia/graph/model"

	"github.com/google/uuid"
)

func (r *mutationResolver) AddShipmentType(ctx context.Context, name string) (*model.ShipmentType, error) {
	db := config.GetDB()

	shipmentType := &model.ShipmentType{
		ID:   uuid.NewString(),
		Name: name,
	}

	return shipmentType, db.Save(shipmentType).Error
}

func (r *mutationResolver) AddShipment(ctx context.Context, input model.NewShipment) (*model.Shipment, error) {
	db := config.GetDB()

	shipment := &model.Shipment{
		ID:             uuid.NewString(),
		Name:           input.Name,
		Duration:       input.Duration,
		ShipmentTypeId: input.ShipmentTypeID,
		Price:          input.Price,
	}

	return shipment, db.Save(shipment).Error
}

func (r *queryResolver) ShipmentTypes(ctx context.Context) ([]*model.ShipmentType, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) GetShipments(ctx context.Context) ([]*model.Shipment, error) {
	db := config.GetDB()
	var shipments []*model.Shipment

	if err := db.Order("price").Find(&shipments).Error; err != nil {
		return nil, err
	}

	return shipments, nil
}

func (r *shipmentResolver) ShipmentType(ctx context.Context, obj *model.Shipment) (*model.ShipmentType, error) {
	db := config.GetDB()
	shipmentType := new(model.ShipmentType)

	if err := db.Where("id = ?", obj.ShipmentTypeId).First(&shipmentType).Error; err != nil {
		return nil, err
	}

	return shipmentType, nil
}

func (r *shipmentTypeResolver) Shipments(ctx context.Context, obj *model.ShipmentType) ([]*model.Shipment, error) {
	db := config.GetDB()
	var shipments []*model.Shipment

	if err := db.Where("shipment_type_id = ?", obj.ID).Find(&shipments).Error; err != nil {
		return nil, err
	}

	return shipments, nil
}

// Shipment returns generated.ShipmentResolver implementation.
func (r *Resolver) Shipment() generated.ShipmentResolver { return &shipmentResolver{r} }

// ShipmentType returns generated.ShipmentTypeResolver implementation.
func (r *Resolver) ShipmentType() generated.ShipmentTypeResolver { return &shipmentTypeResolver{r} }

type shipmentResolver struct{ *Resolver }
type shipmentTypeResolver struct{ *Resolver }
