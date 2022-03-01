package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"tohopedia/config"
	"tohopedia/graph/generated"
	"tohopedia/graph/model"
	"tohopedia/service"

	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *addressResolver) User(ctx context.Context, obj *model.Address) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) AddAddress(ctx context.Context, input model.NewAddress) (*model.Address, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	address := &model.Address{
		ID:         uuid.NewString(),
		Label:      input.Label,
		Receiver:   input.Receiver,
		Phone:      input.Phone,
		City:       input.City,
		PostalCode: input.PostalCode,
		Address:    input.Address,
		Main:       false,
		IsDeleted:  false,
		UserId:     userId,
	}

	return address, db.Create(&address).Error
}

func (r *mutationResolver) UpdateAddress(ctx context.Context, id string, input model.NewAddress) (*model.Address, error) {
	db := config.GetDB()

	address := new(model.Address)

	if err := db.Where("id = ?", id).First(&address).Error; err != nil {
		return nil, err
	}

	address.Label = input.Label
	address.Receiver = input.Receiver
	address.Phone = input.Phone
	address.City = input.City
	address.PostalCode = input.PostalCode
	address.Address = input.Address

	return address, db.Save(address).Error
}

func (r *mutationResolver) SetMainAddress(ctx context.Context, id string) ([]*model.Address, error) {
	db := config.GetDB()

	var address []*model.Address

	if err := db.Where("id = ?", id).Find(&address).Error; err != nil {
		return nil, err
	}

	for i := 0; i < len(address); i++ {
		if address[i].ID == id {
			address[i].Main = true
		} else {
			address[i].Main = false
		}
	}

	return address, db.Save(address).Error
}

func (r *mutationResolver) DeleteAddress(ctx context.Context, id string) (*model.Address, error) {
	db := config.GetDB()

	address := new(model.Address)

	if err := db.Where("id = ?", id).First(&address).Error; err != nil {
		return nil, err
	}

	address.IsDeleted = true

	return address, db.Save(address).Error
}

func (r *queryResolver) GetAddress(ctx context.Context, query *string) ([]*model.Address, error) {
	db := config.GetDB()

	var address []*model.Address

	if err := db.Where("receiver LIKE %?% OR address LIKE %?%", query, query).Find(&address).Error; err != nil {
		return nil, err
	}

	return address, nil
}

// Address returns generated.AddressResolver implementation.
func (r *Resolver) Address() generated.AddressResolver { return &addressResolver{r} }

type addressResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *addressResolver) IsDeleted(ctx context.Context, obj *model.Address) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *addressResolver) Main(ctx context.Context, obj *model.Address) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}
