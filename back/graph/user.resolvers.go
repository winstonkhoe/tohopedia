package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"tohopedia/config"
	"tohopedia/graph/generated"
	"tohopedia/graph/model"
	"tohopedia/helpers"
	"tohopedia/service"

	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *authOpsResolver) Login(ctx context.Context, obj *model.AuthOps, email string, password string) (interface{}, error) {
	return service.UserLogin(ctx, email, password)
}

func (r *authOpsResolver) Register(ctx context.Context, obj *model.AuthOps, input model.NewUser) (interface{}, error) {
	return service.UserRegister(ctx, input)
}

func (r *mutationResolver) Auth(ctx context.Context) (*model.AuthOps, error) {
	return &model.AuthOps{}, nil
}

func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	return service.UserGetByID(ctx, id)
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	db := config.GetDB()
	var models []*model.User
	return models, db.Find(&models).Error
}

func (r *queryResolver) GetCurrentUser(ctx context.Context) (*model.User, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	return service.UserGetByID(ctx, id)
}

func (r *userResolver) Shop(ctx context.Context, obj *model.User) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)
	if err := db.FirstOrInit(shop, "user_id = ?", obj.ID).Error; err != nil {
		return nil, err
	}

	helpers.ParseTime(&shop.OpenTime)
	helpers.ParseTime(&shop.CloseTime)

	return shop, nil
}

func (r *userResolver) Carts(ctx context.Context, obj *model.User) ([]*model.Cart, error) {
	db := config.GetDB()
	var carts []*model.Cart
	if err := db.Where("user_id = ?", obj.ID).Order("created_at DESC").Find(&carts).Error; err != nil {
		return nil, err
	}

	return carts, nil
}

func (r *userResolver) Addresses(ctx context.Context, obj *model.User) ([]*model.Address, error) {
	panic(fmt.Errorf("not implemented"))
}

// AuthOps returns generated.AuthOpsResolver implementation.
func (r *Resolver) AuthOps() generated.AuthOpsResolver { return &authOpsResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type authOpsResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
