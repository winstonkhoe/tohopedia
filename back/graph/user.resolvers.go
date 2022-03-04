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

func (r *mutationResolver) UpdateUserName(ctx context.Context, name string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Name = name

	return user, db.Save(user).Error
}

func (r *mutationResolver) UpdateUserEmail(ctx context.Context, email string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Email = email

	return user, db.Save(user).Error
}

func (r *mutationResolver) UpdateUserPhone(ctx context.Context, phone string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Phone = phone

	return user, db.Save(user).Error
}

func (r *mutationResolver) UpdateUserGender(ctx context.Context, gender string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	genderInt := 0
	if gender == "female" || gender == "Female" {
		genderInt = 0
	} else if gender == "male" || gender == "Male" {
		genderInt = 1
	}

	user.Gender = genderInt

	return user, db.Save(user).Error
}

func (r *mutationResolver) UpdateUserDob(ctx context.Context, dob string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Dob = dob

	return user, db.Save(user).Error
}

func (r *mutationResolver) UpdateUserImage(ctx context.Context, image string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Image = image

	return user, db.Save(user).Error
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

func (r *userResolver) Transactions(ctx context.Context, obj *model.User) ([]*model.Transaction, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Topay(ctx context.Context, obj *model.User) (*model.Topay, error) {
	db := config.GetDB()
	topay := new(model.Topay)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.First(topay, "user_id = ?", id).Error; err != nil {
		return nil, err
	}
	return topay, nil
}

// AuthOps returns generated.AuthOpsResolver implementation.
func (r *Resolver) AuthOps() generated.AuthOpsResolver { return &authOpsResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type authOpsResolver struct{ *Resolver }
type userResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *mutationResolver) UpdateName(ctx context.Context, name string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Name = name

	return user, db.Save(user).Error
}
func (r *mutationResolver) UpdateEmail(ctx context.Context, email string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Email = email

	return user, db.Save(user).Error
}
func (r *mutationResolver) UpdatePhone(ctx context.Context, phone string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Phone = phone

	return user, db.Save(user).Error
}
func (r *mutationResolver) UpdateGender(ctx context.Context, gender string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	genderInt := 0
	if gender == "female" || gender == "Female" {
		genderInt = 0
	} else if gender == "male" || gender == "Male" {
		genderInt = 1
	}

	user.Gender = genderInt

	return user, db.Save(user).Error
}
func (r *mutationResolver) UpdateDob(ctx context.Context, dob string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Dob = dob

	return user, db.Save(user).Error
}
func (r *mutationResolver) UpdateImage(ctx context.Context, image string) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	user.Image = image

	return user, db.Save(user).Error
}
