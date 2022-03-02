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

func (r *couponResolver) Shop(ctx context.Context, obj *model.Coupon) (*model.Shop, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) AddTransaction(ctx context.Context, input model.NewTransaction) (*model.Transaction, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	loc, _ := time.LoadLocation("Asia/Jakarta")
	now := time.Now().In(loc)

	transaction := &model.Transaction{
		ID:                uuid.NewString(),
		AddressId:         input.AddressID,
		ShipmentId:        input.ShipmentID,
		ShopId:            input.ShopID,
		UserId:            userId,
		Date:              now,
		Status:            0,
	}

	err := db.Create(transaction).Error

	if err == nil {
		for i := 0; i < len(input.ProductIds); i++ {
			transactionDetail := &model.TransactionDetail{
				ID:            uuid.NewString(),
				TransactionId: transaction.ID,
				ProductId:     input.ProductIds[i],
				Quantity:      input.Quantity[i],
			}

			err := db.Create(transactionDetail).Error

			if err != nil {
				return nil, err
			}
		}
	}

	return transaction, err
}

func (r *queryResolver) GetUserTransactions(ctx context.Context) ([]*model.Transaction, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionResolver) Details(ctx context.Context, obj *model.Transaction) ([]*model.TransactionDetail, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionResolver) Address(ctx context.Context, obj *model.Transaction) (*model.Address, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionResolver) Shipment(ctx context.Context, obj *model.Transaction) (*model.Shipment, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionResolver) User(ctx context.Context, obj *model.Transaction) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionResolver) Shop(ctx context.Context, obj *model.Transaction) (*model.Shop, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionResolver) TransactionCoupon(ctx context.Context, obj *model.Transaction) (*model.TransactionCoupon, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionResolver) Date(ctx context.Context, obj *model.Transaction) (*time.Time, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionCouponResolver) Transaction(ctx context.Context, obj *model.TransactionCoupon) (*model.Transaction, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionCouponResolver) Coupon(ctx context.Context, obj *model.TransactionCoupon) (*model.Coupon, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionDetailResolver) Transaction(ctx context.Context, obj *model.TransactionDetail) (*model.Transaction, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionDetailResolver) Product(ctx context.Context, obj *model.TransactionDetail) (*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionDetailResolver) Quantity(ctx context.Context, obj *model.TransactionDetail) (int, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *ulasanResolver) TransactionDetail(ctx context.Context, obj *model.Ulasan) (*model.TransactionDetail, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *ulasanResolver) User(ctx context.Context, obj *model.Ulasan) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *wishlistResolver) Product(ctx context.Context, obj *model.Wishlist) (*model.Product, error) {
	panic(fmt.Errorf("not implemented"))
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

// Transaction returns generated.TransactionResolver implementation.
func (r *Resolver) Transaction() generated.TransactionResolver { return &transactionResolver{r} }

// TransactionCoupon returns generated.TransactionCouponResolver implementation.
func (r *Resolver) TransactionCoupon() generated.TransactionCouponResolver {
	return &transactionCouponResolver{r}
}

// TransactionDetail returns generated.TransactionDetailResolver implementation.
func (r *Resolver) TransactionDetail() generated.TransactionDetailResolver {
	return &transactionDetailResolver{r}
}

// Ulasan returns generated.UlasanResolver implementation.
func (r *Resolver) Ulasan() generated.UlasanResolver { return &ulasanResolver{r} }

// Wishlist returns generated.WishlistResolver implementation.
func (r *Resolver) Wishlist() generated.WishlistResolver { return &wishlistResolver{r} }

type couponResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type transactionResolver struct{ *Resolver }
type transactionCouponResolver struct{ *Resolver }
type transactionDetailResolver struct{ *Resolver }
type ulasanResolver struct{ *Resolver }
type wishlistResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
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
