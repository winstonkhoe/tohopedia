package service

import (
	"context"
	"tohopedia/config"
	"tohopedia/graph/model"
	"tohopedia/helpers"
	"strings"

	"github.com/google/uuid"
)

func UserCreate(ctx context.Context, input model.NewUser) (*model.User, error) {
	db := config.GetDB()

	input.Password = helpers.HashPassword(input.Password)

	user := model.User{
		ID:           uuid.New().String(),
		Name:         input.Name,
		Email:        strings.ToLower(input.Email),
		Password:     input.Password,
		IsAdmin:      false,
		IsSuspended:  false,
		
	}

	if err := db.Model(user).Create(&user).Error; err != nil {
		return nil, err
	}

	topay := &model.Topay{
		ID:      uuid.NewString(),
		UserId:  user.ID,
		Balance: 0,
		Coin:    0,
	}

	if err := db.Create(&topay).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByID(ctx context.Context, id string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("id = ?", id).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByEmail(ctx context.Context, email string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("email LIKE ?", email).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}