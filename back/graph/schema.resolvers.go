package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"time"
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

func (r *authOpsResolver) Login(ctx context.Context, obj *model.AuthOps, email string, password string) (interface{}, error) {
	return service.UserLogin(ctx, email, password)
}

func (r *authOpsResolver) Register(ctx context.Context, obj *model.AuthOps, input model.NewUser) (interface{}, error) {
	return service.UserRegister(ctx, input)
}

func (r *cartResolver) Product(ctx context.Context, obj *model.Cart) (*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *cartResolver) User(ctx context.Context, obj *model.Cart) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *categoryResolver) Products(ctx context.Context, obj *model.Category) ([]*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) Auth(ctx context.Context) (*model.AuthOps, error) {
	return &model.AuthOps{}, nil
}

func (r *mutationResolver) OpenShop(ctx context.Context, input model.NewShop) (*model.Shop, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	user := new(model.User)
	if err := db.First(user, "id = ?", id).Error; err != nil {
		return nil, err
	}

	shop := &model.Shop{
		ID:         uuid.NewString(),
		Name:       input.Name,
		Slug:       input.Slug,
		Phone:      input.Phone,
		City:       input.City,
		PostalCode: input.PostalCode,
		Address:    input.Address,
	}
	err := db.Create(shop).Error

	// Update Shop Id in User's Model
	user.ShopID = shop.ID

	if err := db.Save(user).Error; err != nil {
		return nil, err
	}

	return shop, err
}

func (r *mutationResolver) EditShop(ctx context.Context, id string, image string, name string, slug string, slogan string, description string, openTime time.Time, closeTime time.Time, isOpen bool) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)
	if err := db.First(shop, "id = ?", id).Error; err != nil {
		return nil, err
	}

	shop.Image = image
	shop.Name = name
	shop.Slug = slug
	shop.Slogan = slogan
	shop.Description = description
	shop.OpenTime = openTime
	shop.CloseTime = closeTime
	shop.IsOpen = isOpen

	if err := db.Save(shop).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *productResolver) Images(ctx context.Context, obj *model.Product) ([]*model.ProductImage, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *productResolver) Category(ctx context.Context, obj *model.Product) (*model.Category, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *productResolver) Shop(ctx context.Context, obj *model.Product) (*model.Shop, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *productImageResolver) Product(ctx context.Context, obj *model.ProductImage) (*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
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

func (r *shopResolver) User(ctx context.Context, obj *model.Shop) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *shopResolver) Products(ctx context.Context, obj *model.Shop) ([]*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Shop(ctx context.Context, obj *model.User) (*model.Shop, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Carts(ctx context.Context, obj *model.User) ([]*model.Cart, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Addresses(ctx context.Context, obj *model.User) ([]*model.Address, error) {
	panic(fmt.Errorf("not implemented"))
}

// Address returns generated.AddressResolver implementation.
func (r *Resolver) Address() generated.AddressResolver { return &addressResolver{r} }

// AuthOps returns generated.AuthOpsResolver implementation.
func (r *Resolver) AuthOps() generated.AuthOpsResolver { return &authOpsResolver{r} }

// Cart returns generated.CartResolver implementation.
func (r *Resolver) Cart() generated.CartResolver { return &cartResolver{r} }

// Category returns generated.CategoryResolver implementation.
func (r *Resolver) Category() generated.CategoryResolver { return &categoryResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Product returns generated.ProductResolver implementation.
func (r *Resolver) Product() generated.ProductResolver { return &productResolver{r} }

// ProductImage returns generated.ProductImageResolver implementation.
func (r *Resolver) ProductImage() generated.ProductImageResolver { return &productImageResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Shop returns generated.ShopResolver implementation.
func (r *Resolver) Shop() generated.ShopResolver { return &shopResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type addressResolver struct{ *Resolver }
type authOpsResolver struct{ *Resolver }
type cartResolver struct{ *Resolver }
type categoryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type productResolver struct{ *Resolver }
type productImageResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type shopResolver struct{ *Resolver }
type userResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *shopResolver) Phone(ctx context.Context, obj *model.Shop) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *shopResolver) City(ctx context.Context, obj *model.Shop) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *shopResolver) PostalCode(ctx context.Context, obj *model.Shop) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *shopResolver) Address(ctx context.Context, obj *model.Shop) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *userResolver) Phone(ctx context.Context, obj *model.User) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *userResolver) Gender(ctx context.Context, obj *model.User) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *userResolver) Dob(ctx context.Context, obj *model.User) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *userResolver) ProfilePic(ctx context.Context, obj *model.User) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *userResolver) Role(ctx context.Context, obj *model.User) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *userResolver) IsSuspended(ctx context.Context, obj *model.User) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *queryResolver) Protected(ctx context.Context) (string, error) {
	return "Success", nil
}
