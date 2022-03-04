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

func (r *couponResolver) Shop(ctx context.Context, obj *model.Coupon) (*model.Shop, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) CreateTopayWallet(ctx context.Context, userID string) (*model.Topay, error) {
	db := config.GetDB()

	// if ctx.Value("auth") == nil {
	// 	return nil, &gqlerror.Error{
	// 		Message: "Error, token gaada",
	// 	}
	// }

	// userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	topay := &model.Topay{
		ID:      uuid.NewString(),
		UserId:  userID,
		Balance: 0,
		Coin:    0,
	}

	return topay, db.Create(topay).Error
}

func (r *mutationResolver) CreateTopayToken(ctx context.Context, code string, value int) (*model.TopayToken, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	loc, _ := time.LoadLocation("Asia/Jakarta")
	now := time.Now()

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	topayToken := &model.TopayToken{
		ID:       uuid.NewString(),
		Code:     code,
		UserId:   userId,
		Value:    value,
		ValidTo:  time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second(), now.Nanosecond(), loc).Add(time.Minute * 5),
		Redeemed: false,
	}

	helpers.ParseTime(&topayToken.ValidTo)

	return topayToken, db.Create(topayToken).Error
}

func (r *mutationResolver) AddTopayBalance(ctx context.Context, code string) (*model.Topay, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	topayToken := new(model.TopayToken)

	if err := db.First(topayToken, "code = ?", code).Error; err != nil {
		return nil, err
	}

	topay := new(model.Topay)

	if err := db.First(topay, "user_id = ?", userId).Error; err != nil {
		return nil, err
	}

	topay.Balance += topayToken.Value

	topayToken.Redeemed = true

	if err := db.Save(topayToken).Error; err != nil {
		return nil, err
	}

	return topay, db.Save(topay).Error
}

func (r *mutationResolver) AddUlasan(ctx context.Context, input model.NewUlasan) (*model.Ulasan, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	ulasan := &model.Ulasan{
		ID:                  uuid.NewString(),
		TransactionDetailId: input.TransactionDetailID,
		UserId:              userId,
		Rating:              input.Rating,
		Message:             input.Message,
		Anonymous:           input.Anonymous,
	}

	return ulasan, db.Create(ulasan).Error
}

func (r *mutationResolver) AddWishlist(ctx context.Context, input model.NewWishlist) (*model.Wishlist, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	wishlist := &model.Wishlist{
		ID:        uuid.NewString(),
		ProductID: input.ProductID,
		UserId:    userId,
	}

	return wishlist, db.Create(wishlist).Error
}

func (r *mutationResolver) RemoveWishlist(ctx context.Context, id string) (*model.Wishlist, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) GetShop(ctx context.Context, slug string) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)

	if err := db.First(shop, "slug = ?", slug).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *queryResolver) GetTopayToken(ctx context.Context, code string) (*model.TopayToken, error) {
	db := config.GetDB()
	topayToken := new(model.TopayToken)

	if err := db.Where("code = ?", code).First(&topayToken).Error; err != nil {
		return nil, err
	}

	if topayToken != nil {
		helpers.ParseTime(&topayToken.ValidTo)
	}

	return topayToken, nil
}

func (r *topayResolver) User(ctx context.Context, obj *model.Topay) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if err := db.First(user, "user_id = ?", obj.UserId).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *topayTokenResolver) User(ctx context.Context, obj *model.TopayToken) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *ulasanResolver) TransactionDetail(ctx context.Context, obj *model.Ulasan) (*model.TransactionDetail, error) {
	db := config.GetDB()
	transactionDetail := new(model.TransactionDetail)

	if err := db.First(transactionDetail, "user_id = ?", obj.UserId).Error; err != nil {
		return nil, err
	}

	return transactionDetail, nil
}

func (r *ulasanResolver) User(ctx context.Context, obj *model.Ulasan) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if err := db.First(user, "user_id = ?", obj.UserId).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *wishlistResolver) Product(ctx context.Context, obj *model.Wishlist) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)

	if err := db.First(product, "user_id = ?", obj.UserId).Error; err != nil {
		return nil, err
	}

	return product, nil
}

func (r *wishlistResolver) User(ctx context.Context, obj *model.Wishlist) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

// Coupon returns generated.CouponResolver implementation.
func (r *Resolver) Coupon() generated.CouponResolver { return &couponResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Topay returns generated.TopayResolver implementation.
func (r *Resolver) Topay() generated.TopayResolver { return &topayResolver{r} }

// TopayToken returns generated.TopayTokenResolver implementation.
func (r *Resolver) TopayToken() generated.TopayTokenResolver { return &topayTokenResolver{r} }

// Ulasan returns generated.UlasanResolver implementation.
func (r *Resolver) Ulasan() generated.UlasanResolver { return &ulasanResolver{r} }

// Wishlist returns generated.WishlistResolver implementation.
func (r *Resolver) Wishlist() generated.WishlistResolver { return &wishlistResolver{r} }

type couponResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type topayResolver struct{ *Resolver }
type topayTokenResolver struct{ *Resolver }
type ulasanResolver struct{ *Resolver }
type wishlistResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *ulasanResolver) CreatedAt(ctx context.Context, obj *model.Ulasan) (*time.Time, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *transactionDetailResolver) Quantity(ctx context.Context, obj *model.TransactionDetail) (int, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *transactionResolver) Coupon(ctx context.Context, obj *model.Transaction) (*model.TransactionCoupon, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *transactionCouponResolver) TransactionHeader(ctx context.Context, obj *model.TransactionCoupon) (*model.Transaction, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *transactionDetailResolver) TransactionHeader(ctx context.Context, obj *model.TransactionDetail) (*model.Transaction, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *shipmentResolver) ShipmentTypeID(ctx context.Context, obj *model.Shipment) (*model.ShipmentType, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *shipmentResolver) Type(ctx context.Context, obj *model.Shipment) (*model.ShipmentType, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *cartResolver) Checked(ctx context.Context, obj *model.Cart) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *mutationResolver) AddCart(ctx context.Context, input model.NewCart) (*model.Cart, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	cart := &model.Cart{
		ID:        uuid.NewString(),
		ProductID: input.ProductID,
		UserId:    userId,
		Quantity:  input.Quantity,
	}

	err := db.Create(cart).Error

	return cart, err
}
func (r *productResolver) OriginalID(ctx context.Context, obj *model.Product) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
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
