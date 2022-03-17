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
	"tohopedia/helpers"
	"tohopedia/service"

	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *mutationResolver) OpenShop(ctx context.Context, input model.NewShop) (*model.Shop, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	user := new(model.User)
	if err := db.First(user, "id = ?", userId).Error; err != nil {
		return nil, err
	}

	loc, _ := time.LoadLocation("Asia/Jakarta")
	now := time.Now()
	// now := time.Now().In(loc)

	shop := &model.Shop{
		ID:              uuid.NewString(),
		Name:            input.Name,
		Slug:            input.Slug,
		Phone:           input.Phone,
		Slogan:          "",
		Description:     "",
		Image:           "",
		OpenTime:        time.Date(now.Year(), now.Month(), now.Day(), 8, 0, 0, 0, loc),
		CloseTime:       time.Date(now.Year(), now.Month(), now.Day(), 18, 0, 0, 0, loc),
		IsOpen:          true,
		ReputationPoint: 0,
		UserId:          userId,
		City:            input.City,
		PostalCode:      input.PostalCode,
		Address:         input.Address,
		Type:            0,
	}
	helpers.ParseTime(&shop.OpenTime)
	helpers.ParseTime(&shop.CloseTime)

	err := db.Create(shop).Error

	return shop, err
}

func (r *mutationResolver) EditShop(ctx context.Context, id string, image *string, name string, slug string, slogan *string, description *string, openTime time.Time, closeTime time.Time, isOpen bool) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)
	if err := db.First(shop, "id = ?", id).Error; err != nil {
		return nil, err
	}

	shop.Image = *image
	shop.Name = name
	shop.Slug = slug
	shop.Slogan = *slogan
	shop.Description = *description
	shop.OpenTime = openTime
	shop.CloseTime = closeTime
	shop.IsOpen = isOpen

	if err := db.Save(shop).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *queryResolver) GetCurrentShop(ctx context.Context) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	fmt.Println(id)

	if err := db.First(shop, "user_id = ?", id).Error; err != nil {
		return nil, err
	}

	fmt.Println(shop.Name)

	helpers.ParseTime(&shop.OpenTime)
	helpers.ParseTime(&shop.CloseTime)

	return shop, nil
}

func (r *shopResolver) User(ctx context.Context, obj *model.Shop) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)
	if err := db.Where("id = ?", obj.UserId).Find(&user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *shopResolver) Products(ctx context.Context, obj *model.Shop) ([]*model.Product, error) {
	db := config.GetDB()
	var products []*model.Product
	if err := db.Where("shop_id = ?", obj.ID).Find(&products).Error; err != nil {
		return nil, err
	}

	for i := 0; i < len(products); i++ {
		helpers.ParseTime(&products[i].CreatedAt)
		// models[i].CreatedAt = helpers.ParseTime(models[i].CreatedAt)
	}

	return products, nil
}

func (r *shopResolver) Chats(ctx context.Context, obj *model.Shop) ([]*model.ChatHeader, error) {
	db := config.GetDB()
	var chats []*model.ChatHeader

	if err := db.Where("shop_id = ?", obj.ID).Find(&chats).Error; err != nil {
		return nil, err
	}

	return chats, nil
}

// Shop returns generated.ShopResolver implementation.
func (r *Resolver) Shop() generated.ShopResolver { return &shopResolver{r} }

type shopResolver struct{ *Resolver }
