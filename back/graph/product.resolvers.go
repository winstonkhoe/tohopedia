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

func (r *categoryResolver) Products(ctx context.Context, obj *model.Category) ([]*model.Product, error) {
	db := config.GetDB()

	var products []*model.Product

	if err := db.Where("category_id = ? AND stock > 0", obj.ID).Find(&products).Error; err != nil {
		return nil, err
	}

	for i := 0; i < len(products); i++ {
		helpers.ParseTime(&products[i].CreatedAt)
		helpers.ParseTime(&products[i].ValidTo)
	}

	return products, nil
}

func (r *mutationResolver) CreateCategory(ctx context.Context, name string) (*model.Category, error) {
	db := config.GetDB()

	category := &model.Category{
		ID:   uuid.NewString(),
		Name: name,
	}

	err := db.Create(category).Error

	return category, err
}

func (r *mutationResolver) AddProduct(ctx context.Context, input model.NewProduct) (*model.Product, error) {
	db := config.GetDB()

	shop := new(model.Shop)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.FirstOrInit(shop, "user_id = ?", userId).Error; err != nil {
		return nil, err
	}

	productId := uuid.NewString()
	product := &model.Product{
		ID:          productId,
		OriginalID:  productId,
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Discount:    input.Discount,
		Stock:       input.Stock,
		Metadata:    *input.Metadata,
		CreatedAt:   time.Now(),
		CategoryID:  input.CategoryID,
		ShopID:      shop.ID,
	}

	err := db.Create(product).Error

	if err == nil {
		for i := 0; i < len(input.Images); i++ {
			image := &model.ProductImage{
				ID:        uuid.NewString(),
				ProductID: product.OriginalID,
				Image:     input.Images[i],
			}

			err := db.Create(image).Error

			if err != nil {
				return nil, err
			}
		}
	}
	return product, err
}

func (r *productResolver) Images(ctx context.Context, obj *model.Product) ([]*model.ProductImage, error) {
	db := config.GetDB()
	var images []*model.ProductImage
	if err := db.Where("product_id = ?", obj.OriginalID).Find(&images).Error; err != nil {
		return nil, err
	}

	return images, nil
}

func (r *productResolver) Category(ctx context.Context, obj *model.Product) (*model.Category, error) {
	db := config.GetDB()
	category := new(model.Category)
	if err := db.FirstOrInit(category, "id = ?", obj.CategoryID).Error; err != nil {
		return nil, err
	}

	return category, nil
}

func (r *productResolver) Shop(ctx context.Context, obj *model.Product) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)
	if err := db.FirstOrInit(shop, "id = ?", obj.ShopID).Error; err != nil {
		return nil, err
	}

	helpers.ParseTime(&shop.OpenTime)
	helpers.ParseTime(&shop.CloseTime)

	return shop, nil
}

func (r *productImageResolver) Product(ctx context.Context, obj *model.ProductImage) (*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Categories(ctx context.Context) ([]*model.Category, error) {
	db := config.GetDB()
	var models []*model.Category
	return models, db.Order("name").Find(&models).Error
}

func (r *queryResolver) Product(ctx context.Context, id string) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)
	if err := db.FirstOrInit(product, "id = ?", id).Error; err != nil {
		return nil, err
	}

	helpers.ParseTime(&product.CreatedAt)

	return product, nil
}

func (r *queryResolver) Products(ctx context.Context) ([]*model.Product, error) {
	db := config.GetDB()
	var models []*model.Product

	err := db.Where("valid_to = ? AND stock > 0", "0000-00-00 00:00:00.000").Order("created_at DESC").Find(&models).Error

	for i := 0; i < len(models); i++ {
		helpers.ParseTime(&models[i].CreatedAt)
	}
	return models, err
}

func (r *queryResolver) GetShopProductsPaginate(ctx context.Context, slug string, limit int, offset int) ([]*model.Product, error) {
	db := config.GetDB()
	var products []*model.Product

	shop := new(model.Shop)

	if err := db.First(shop, "slug = ?", slug).Error; err != nil {
		return nil, err
	}

	if err := db.Where("shop_id = ? AND valid_to = ? AND stock > 0 ", shop.ID, "0000-00-00 00:00:00.000").Limit(limit).Offset(offset).Find(&products).Error; err != nil {
		return nil, err
	}
	for i := 0; i < len(products); i++ {
		helpers.ParseTime(&products[i].CreatedAt)
	}

	return products, nil
}

func (r *queryResolver) TopProductDiscount(ctx context.Context) ([]*model.Product, error) {
	db := config.GetDB()
	var models []*model.Product

	err := db.Where("valid_to = ? AND discount > ? AND stock > 0", "0000-00-00 00:00:00.000", 0).Order("discount DESC").Find(&models).Limit(15).Error
	for i := 0; i < len(models); i++ {
		helpers.ParseTime(&models[i].CreatedAt)
	}
	return models, err
}

// Category returns generated.CategoryResolver implementation.
func (r *Resolver) Category() generated.CategoryResolver { return &categoryResolver{r} }

// Product returns generated.ProductResolver implementation.
func (r *Resolver) Product() generated.ProductResolver { return &productResolver{r} }

// ProductImage returns generated.ProductImageResolver implementation.
func (r *Resolver) ProductImage() generated.ProductImageResolver { return &productImageResolver{r} }

type categoryResolver struct{ *Resolver }
type productResolver struct{ *Resolver }
type productImageResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *queryResolver) GetShopProducts(ctx context.Context, slug string) ([]*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
}
