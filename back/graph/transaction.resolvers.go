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
		ID:         uuid.NewString(),
		AddressId:  input.AddressID,
		ShipmentId: input.ShipmentID,
		ShopId:     input.ShopID,
		UserId:     userId,
		Date:       now,
		Status:     0,
		Method:     input.Method,
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

			product := new(model.Product)

			if err := db.Where("id = ?", input.ProductIds[i]).First(&product).Error; err != nil {
				return nil, err
			}

			product.Stock -= input.Quantity[i]

			if err := db.Save(product).Error; err != nil {
				return nil, err
			}

			cart := new(model.Cart)

			if err := db.Where("user_id = ? AND product_id = ?", userId, input.ProductIds[i]).First(cart).Error; err != nil {
				return nil, err
			}

			if err := db.Delete(cart).Error; err != nil {
				return nil, err
			}

		}

		if input.Method == "topay" {
			topay := new(model.Topay)

			if err := db.Where("user_id = ?", userId).First(topay).Error; err != nil {
				return nil, err
			}

			topay.Balance -= input.Total

			if err := db.Save(topay).Error; err != nil {
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
	db := config.GetDB()
	var transactionDetails []*model.TransactionDetail

	if err := db.Where("transaction_id = ?", obj.ID).Find(&transactionDetails).Error; err != nil {
		return nil, err
	}

	return transactionDetails, nil
}

func (r *transactionResolver) Address(ctx context.Context, obj *model.Transaction) (*model.Address, error) {
	db := config.GetDB()
	address := new(model.Address)

	if err := db.Where("id = ?", obj.AddressId).Find(&address).Error; err != nil {
		return nil, err
	}

	return address, nil
}

func (r *transactionResolver) Shipment(ctx context.Context, obj *model.Transaction) (*model.Shipment, error) {
	db := config.GetDB()
	shipment := new(model.Shipment)

	if err := db.Where("id = ?", obj.ShipmentId).Find(&shipment).Error; err != nil {
		return nil, err
	}

	return shipment, nil
}

func (r *transactionResolver) User(ctx context.Context, obj *model.Transaction) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if err := db.Where("id = ?", obj.UserId).Find(&user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *transactionResolver) Shop(ctx context.Context, obj *model.Transaction) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)

	if err := db.Where("id = ?", obj.ShopId).Find(&shop).Error; err != nil {
		return nil, err
	}

	helpers.ParseTime(&shop.OpenTime)
	helpers.ParseTime(&shop.CloseTime)

	return shop, nil
}

func (r *transactionResolver) TransactionCoupon(ctx context.Context, obj *model.Transaction) (*model.TransactionCoupon, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionCouponResolver) Transaction(ctx context.Context, obj *model.TransactionCoupon) (*model.Transaction, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionCouponResolver) Coupon(ctx context.Context, obj *model.TransactionCoupon) (*model.Coupon, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *transactionDetailResolver) Transaction(ctx context.Context, obj *model.TransactionDetail) (*model.Transaction, error) {
	db := config.GetDB()
	transaction := new(model.Transaction)

	if err := db.Where("id = ?", obj.TransactionId).Find(&transaction).Error; err != nil {
		return nil, err
	}

	helpers.ParseTime(&transaction.Date)

	return transaction, nil
}

func (r *transactionDetailResolver) Product(ctx context.Context, obj *model.TransactionDetail) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)

	if err := db.Where("id = ?", obj.ProductId).Find(&product).Error; err != nil {
		return nil, err
	}

	return product, nil
}

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

type transactionResolver struct{ *Resolver }
type transactionCouponResolver struct{ *Resolver }
type transactionDetailResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *transactionResolver) Date(ctx context.Context, obj *model.Transaction) (*time.Time, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *transactionDetailResolver) Note(ctx context.Context, obj *model.TransactionDetail) (*string, error) {
	panic(fmt.Errorf("not implemented"))
}
