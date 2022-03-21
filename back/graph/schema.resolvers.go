package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"math"
	"sort"
	"time"
	"tohopedia/config"
	"tohopedia/graph/generated"
	"tohopedia/graph/model"
	"tohopedia/helpers"
	"tohopedia/service"

	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *chatDetailsResolver) ChatHeader(ctx context.Context, obj *model.ChatDetails) (*model.ChatHeader, error) {
	db := config.GetDB()
	header := new(model.ChatHeader)

	if err := db.Where("id = ?", obj.ChatHeaderId).Find(&header).Error; err != nil {
		return nil, err
	}

	return header, nil
}

func (r *chatHeaderResolver) Details(ctx context.Context, obj *model.ChatHeader) ([]*model.ChatDetails, error) {
	db := config.GetDB()
	var details []*model.ChatDetails

	if err := db.Where("chat_header_id = ?", obj.ID).Order("created_at ASC").Find(&details).Error; err != nil {
		return nil, err
	}

	for i := range details {
		helpers.ParseTime(&details[i].CreatedAt)
	}

	return details, nil
}

func (r *chatHeaderResolver) Customer(ctx context.Context, obj *model.ChatHeader) (*model.User, error) {
	db := config.GetDB()
	customer := new(model.User)

	if err := db.Where("id = ?", obj.CustomerId).Find(&customer).Error; err != nil {
		return nil, err
	}

	return customer, nil
}

func (r *chatHeaderResolver) Shop(ctx context.Context, obj *model.ChatHeader) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)

	if err := db.Where("id = ?", obj.ShopId).Find(&shop).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *couponResolver) Shop(ctx context.Context, obj *model.Coupon) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)

	if err := db.Where("id = ?", obj.ShopId).Find(&shop).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *emailTokenResolver) User(ctx context.Context, obj *model.EmailToken) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)
	if err := db.Where("id = ?", obj.UserId).First(&user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *mutationResolver) AddChat(ctx context.Context, senderID string, receiverID string, content string) (*model.Chat, error) {
	db := config.GetDB()
	user := new(model.User)
	db.First(user, "id = ?", senderID)

	chat := &model.Chat{
		ID:        uuid.NewString(),
		Sender:    senderID,
		Receiver:  receiverID,
		Content:   content,
		CreatedAt: time.Now(),
	}

	// if len(user.ID) == 0 {
	// 	chat.Sender = &model.Shop{}
	// 	chat.Receiver = &model.User{}
	// } else {
	// 	chat.Sender = &model.User{}
	// 	chat.Receiver = &model.Shop{}
	// }

	return chat, db.Create(chat).Error
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

func (r *mutationResolver) CreateEmailToken(ctx context.Context, email string) (*model.EmailToken, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	emailToken := &model.EmailToken{
		ID:       uuid.NewString(),
		UserId:   userId,
		Email:    email,
		ValidTo:  time.Now().Add(time.Minute * 5),
		Redeemed: false,
	}

	return emailToken, db.Create(emailToken).Error
}

func (r *mutationResolver) CreatePasswordToken(ctx context.Context, email string) (*model.PasswordToken, error) {
	db := config.GetDB()

	token := &model.PasswordToken{
		ID:       uuid.NewString(),
		Email:    email,
		ValidTo:  time.Now().Add(time.Minute * 5),
		Redeemed: false,
	}

	return token, db.Create(token).Error
}

func (r *mutationResolver) VerifyEmailAddress(ctx context.Context, id string) (bool, error) {
	db := config.GetDB()
	token := new(model.EmailToken)

	if err := db.Where("id = ? AND redeemed = ?", id, false).First(&token).Error; err != nil {
		return false, nil
	}

	if len(token.ID) > 0 {
		user := new(model.User)
		if err := db.Where("id = ?", token.UserId).First(&user).Error; err != nil {
			return false, nil
		}

		user.Email = token.Email

		if err := db.Save(&user).Error; err != nil {
			return false, nil
		}

		token.Redeemed = true

		if err := db.Save(&token).Error; err != nil {
			return false, nil
		}
		return true, nil
	}
	return false, nil
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

func (r *mutationResolver) AddReview(ctx context.Context, input model.NewReview) (*model.Review, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	reviewId := uuid.NewString()

	review := &model.Review{
		ID:                  reviewId,
		TransactionDetailId: input.TransactionDetailID,
		UserId:              userId,
		ShopId:              input.ShopID,
		Rating:              input.Rating,
		Message:             input.Message,
		Anonymous:           input.Anonymous,
		CreatedAt:           time.Now(),
	}
	if err := db.Create(&review).Error; err != nil {
		return nil, err
	}

	for i := range input.Images {
		image := &model.ReviewImage{
			ID:       uuid.NewString(),
			ReviewId: reviewId,
			Image:    *input.Images[i],
		}

		if err := db.Create(&image).Error; err != nil {
			return nil, err
		}
	}

	return review, nil
}

func (r *mutationResolver) AddWishlist(ctx context.Context, input model.NewWishlist) (*model.Wishlist, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	userPreferences := new(model.UserPreferences)

	product := new(model.Product)

	if err := db.Where("id = ?", input.ProductID).Find(&product).Error; err != nil {
		return nil, err
	}

	db.First(userPreferences, "user_id = ? AND category_id = ?", userId, product.CategoryID)

	if len(userPreferences.ID) == 0 {
		userPreferences := &model.UserPreferences{
			ID:         uuid.NewString(),
			UserId:     userId,
			CategoryId: product.CategoryID,
			Score:      1,
		}

		if err := db.Create(&userPreferences).Error; err != nil {
			return nil, err
		}
	} else {
		if err := db.First(userPreferences, "user_id = ? AND category_id = ?", userId, product.CategoryID).Error; err != nil {
			return nil, err
		}

		userPreferences.Score += 2

		if err := db.Save(&userPreferences).Error; err != nil {
			return nil, err
		}
	}

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

func (r *queryResolver) GetShopByID(ctx context.Context, id string) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)

	if err := db.First(shop, "id = ?", id).Error; err != nil {
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

func (r *queryResolver) GetPasswordToken(ctx context.Context, id string) (*model.PasswordToken, error) {
	db := config.GetDB()
	token := new(model.PasswordToken)

	if err := db.Where("id = ?", id).Find(&token).Error; err != nil {
		return nil, err
	}

	return token, nil
}

func (r *queryResolver) GetRecommendation(ctx context.Context) ([]*model.Product, error) {
	db := config.GetDB()
	var categories []*model.Category
	var userPreferences []*model.UserPreferences
	var otherUsers []*model.User
	totalUniqueCategories := 0
	const displayProduct = 15

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	db.Find(&categories) //Cari panjang Categories

	var vectorCurrUser = make([]int, len(categories))
	for i := range vectorCurrUser {
		vectorCurrUser[i] = 0
	}

	db.Where("user_id = ?", userId).Find(&userPreferences)
	db.Where("id <> ?", userId).Find(&otherUsers)

	fmt.Printf("Current UserID: %s\n", userId)
	fmt.Println("Current Product Recommendation")
	// fmt.Println(&userPreferences)

	//Simpenin Index Categories
	categoriesIndex := make(map[string]int)
	userCategories := make(map[string]int)

	//Simpen User Preferences -- Isi Categoriesnya
	userPrefCategoryScore := make(map[string]int)

	fmt.Println(len(userPreferences))
	for i := 0; i < len(userPreferences); i++ {
		fmt.Println(userPreferences[i].CategoryId)
		userPrefCategoryScore[userPreferences[i].CategoryId] = userPreferences[i].Score
		categoriesIndex[userPreferences[i].CategoryId] = totalUniqueCategories
		userCategories[userPreferences[i].CategoryId] = 0
		totalUniqueCategories += 1
	}
	fmt.Println("END Current Product Recommendation")
	for k, v := range userPrefCategoryScore {
		fmt.Printf("key[%s] value[%d]\n", k, v)
	}

	for k, v := range categoriesIndex {
		vectorCurrUser[v] = userPrefCategoryScore[k]
		fmt.Printf("key[%s] value[%d]\n", k, v)
	}

	fmt.Println("Vector Current User")
	for i := range vectorCurrUser {
		fmt.Print(vectorCurrUser[i])
	}
	fmt.Println("\n End Vector Current User")

	var cosineResults = make(map[string]float64, len(otherUsers))
	/*
		OTHER USER SECTION CHECK
	*/
	for i := 0; i < len(otherUsers); i++ {
		otherUserPrefCategoryScore := make(map[string]int)
		var otherUserPreferences []*model.UserPreferences
		cosineResults[otherUsers[i].ID] = 0
		fmt.Printf("User: %s | UserID: %s\n", otherUsers[i].Name, otherUsers[i].ID)
		db.Where("user_id = ?", otherUsers[i].ID).Find(&otherUserPreferences) //Find Other User's Preferences
		fmt.Println(len(otherUserPreferences))
		fmt.Println("User Product Recommendation")
		fmt.Println(len(otherUserPreferences))
		for i := 0; i < len(otherUserPreferences); i++ {
			fmt.Println(otherUserPreferences[i].CategoryId)
			otherUserPrefCategoryScore[otherUserPreferences[i].CategoryId] = otherUserPreferences[i].Score
			if _, ok := categoriesIndex[otherUserPreferences[i].CategoryId]; !ok {
				categoriesIndex[otherUserPreferences[i].CategoryId] = totalUniqueCategories
				totalUniqueCategories += 1
				// fmt.Println(otherUserPreferences[i].CategoryId + " belom exists")
			}
		}

		var vectorTempOtherUser = make([]int, len(categories))
		for i := range vectorTempOtherUser {
			vectorTempOtherUser[i] = 0
		}

		for k, v := range categoriesIndex {
			vectorTempOtherUser[v] = otherUserPrefCategoryScore[k]
		}

		fmt.Println("Vector Current User")
		for i := range vectorCurrUser {
			fmt.Printf(" %d ", vectorCurrUser[i])
		}
		fmt.Println("\n End Vector Current User")

		fmt.Println("Vector Other User")
		for i := range vectorTempOtherUser {
			fmt.Printf(" %d ", vectorTempOtherUser[i])
		}
		fmt.Println("\n End Vector Other User")

		fmt.Println("END User Product Recommendation")
		for k, v := range otherUserPrefCategoryScore {
			fmt.Printf("key[%s] value[%d]\n", k, v)
		}

		/*
			RUMUS
			==================

			  A  ·  B
			-----------
			||A|| ||B||

			==================
		*/

		dotProduct := 0
		for i := range vectorCurrUser {
			dotProduct += vectorCurrUser[i] * vectorTempOtherUser[i]
		}

		totalSquareCurrUserVector := 0
		for i := range vectorCurrUser {
			totalSquareCurrUserVector += vectorCurrUser[i] * vectorCurrUser[i]
		}

		totalSquareOtherUserVector := 0
		for i := range vectorTempOtherUser {
			totalSquareOtherUserVector += vectorTempOtherUser[i] * vectorTempOtherUser[i]
		}

		magnitudeCurrUser := math.Sqrt(float64(totalSquareCurrUserVector))
		magnitudeOtherUser := math.Sqrt(float64(totalSquareOtherUserVector))

		currCosineVal := float64(float64(dotProduct) / (magnitudeCurrUser * magnitudeOtherUser))
		if !math.IsNaN(currCosineVal) {
			cosineResults[otherUsers[i].ID] = currCosineVal
		}
		fmt.Printf("Cosine Value: %f\n", currCosineVal)
	}
	sortedUsersCosine := make(PairList, len(cosineResults))

	i := 0
	for k, v := range cosineResults {
		sortedUsersCosine[i] = Pair{k, v}
		i++
	}

	sort.Sort(sortedUsersCosine)

	for _, k := range sortedUsersCosine {
		fmt.Printf("%v\t%v\n", k.UserID, k.Value)
	}

	uniqueNewCategories := make(map[string]int) //Selain UserCategories
	// extraCategories := make([]string, 0, len(categories))
	for i := 0; i < 3 && i < len(sortedUsersCosine); i++ {
		if sortedUsersCosine[i].Value > 0 {
			var tempPref []*model.UserPreferences
			db.Where("user_id = ?", sortedUsersCosine[i].UserID).Find(&tempPref)

			for j := 0; j < len(tempPref); j++ {
				if _, exists := userCategories[tempPref[j].CategoryId]; !exists {
					if _, exists := uniqueNewCategories[tempPref[j].CategoryId]; !exists {
						uniqueNewCategories[tempPref[j].CategoryId] = 0
						// fmt.Println(otherUserPreferences[j].CategoryId + " belom exists")
					}
				}
			}

		}
	}

	fmt.Println("NEW CATEGORIES")
	stringNewCategories := ""
	iterator := 0
	for k, v := range uniqueNewCategories {
		fmt.Printf("key[%s] value[%d]\n", k, v)
		// if(iterator > 0) {
		stringNewCategories += "'"
		// }
		stringNewCategories += k
		if iterator < len(uniqueNewCategories)-1 {
			stringNewCategories += "',"
		}
		iterator += 1
	}
	stringNewCategories += "'"

	fmt.Println(stringNewCategories)

	var extraProduct []*model.Product
	productBaseQuery := "SELECT id, name, description, price, discount, stock, metadata, created_at, category_id, shop_id, original_id, valid_to FROM products WHERE category_id IN"
	query := fmt.Sprintf("%s (%s) LIMIT %d", productBaseQuery, stringNewCategories, 5)
	// query := fmt.Sprintf("%s (%s)", "SELECT id, name FROM categories WHERE id IN", stringNewCategories)
	fmt.Println(query)
	db.Raw(query).Scan(&extraProduct)
	// db.Raw("SELECT id, name FROM categories WHERE id IN (?)", stringNewCategories).Scan(&extraCategories)
	// db.Where("id IN (?)", stringNewCategories).Limit(5).Find(&extraCategories)

	fmt.Println("Extra Categories")
	for i := 0; i < len(extraProduct); i++ {
		fmt.Println(extraProduct[i].ID)
		fmt.Println(extraProduct[i].Name)
	}
	fmt.Println("END Extra Categories")
	fmt.Println(len(extraProduct))

	remaining := displayProduct - len(extraProduct)

	stringUserCategories := ""
	iterator = 0
	for k, v := range userCategories {
		fmt.Printf("key[%s] value[%d]\n", k, v)
		// if(iterator > 0) {
		stringUserCategories += "'"
		// }
		stringUserCategories += k
		if iterator < len(userCategories)-1 {
			stringUserCategories += "',"
		}
		iterator += 1
	}
	stringUserCategories += "'"

	var userProduct []*model.Product
	query = fmt.Sprintf("%s (%s) LIMIT %d", productBaseQuery, stringUserCategories, remaining)
	db.Raw(query).Scan(&userProduct)
	for i := 0; i < len(userProduct); i++ {
		fmt.Println(userProduct[i].ID)
		fmt.Println(userProduct[i].Name)
	}

	userProduct = append(userProduct, extraProduct...)
	fmt.Println("After Appended")
	for i := 0; i < len(userProduct); i++ {
		fmt.Println(userProduct[i].ID)
		fmt.Println(userProduct[i].Name)
	}

	return nil, nil
}

func (r *queryResolver) GetChats(ctx context.Context, id string) ([]*model.Chat, error) {
	db := config.GetDB()
	var chats []*model.Chat

	if err := db.Where("sender = ? OR receiver = ?", id, id).Order("created_at DESC").Find(&chats).Error; err != nil {
		return nil, err
	}

	for i := range chats {
		helpers.ParseTime(&chats[i].CreatedAt)
	}

	return chats, nil
}

func (r *queryResolver) TransactionsPerDay(ctx context.Context) (interface{}, error) {
	db := config.GetDB()
	var data []map[string]interface{}

	db.Raw(`SELECT DISTINCT
	CAST(DATE(t.date) AS DATE) AS date,
	COUNT(*) AS count
	FROM 
	transactions t, 
	(SELECT date FROM transactions) x  
	WHERE
		DATEDIFF(t.date, x.date) = 0
	GROUP BY
		t.date`).Find(&data)

	if data != nil {
		fmt.Println(data)
		for i := 0; i < len(data); i++ {
			fmt.Println(data[i]["count"])
			fmt.Println(data[i]["date"])
		}
	}

	return data, nil
}

func (r *queryResolver) TransactionsPerShipmentType(ctx context.Context) (interface{}, error) {
	db := config.GetDB()
	var data []map[string]interface{}

	db.Raw(`SELECT DISTINCT
	st.name,
	COUNT(*) AS count
	FROM 
		transactions t JOIN shipments s
		ON t.shipment_id = s.id JOIN shipment_types st
		ON s.shipment_type_id = st.id
	GROUP BY
		st.id, st.name`).Find(&data)

	return data, nil
}

func (r *queryResolver) ProductsPerCategory(ctx context.Context) (interface{}, error) {
	db := config.GetDB()
	var data []map[string]interface{}

	db.Raw(`SELECT DISTINCT
	c.name,
	COUNT(*) AS count
	FROM 
		products p JOIN categories c
		ON p.category_id = c.id
	GROUP BY
		c.id, c.name`).Find(&data)

	return data, nil
}

func (r *reviewResolver) TransactionDetail(ctx context.Context, obj *model.Review) (*model.TransactionDetail, error) {
	db := config.GetDB()
	detail := new(model.TransactionDetail)

	if err := db.First(detail, "id = ?", obj.TransactionDetailId).Error; err != nil {
		return nil, err
	}

	return detail, nil
}

func (r *reviewResolver) User(ctx context.Context, obj *model.Review) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if err := db.First(user, "id = ?", obj.UserId).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *reviewResolver) Shop(ctx context.Context, obj *model.Review) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)

	if err := db.First(shop, "id = ?", obj.ShopId).Error; err != nil {
		return nil, err
	}

	return shop, nil
}

func (r *reviewResolver) Images(ctx context.Context, obj *model.Review) ([]*model.ReviewImage, error) {
	db := config.GetDB()
	var images []*model.ReviewImage

	if err := db.Where("review_id = ?", obj.ID).Find(&images).Error; err != nil {
		return nil, err
	}

	return images, nil
}

func (r *reviewImageResolver) Review(ctx context.Context, obj *model.ReviewImage) (*model.Review, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *topayResolver) User(ctx context.Context, obj *model.Topay) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if err := db.First(user, "id = ?", obj.UserId).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *topayTokenResolver) User(ctx context.Context, obj *model.TopayToken) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userPreferencesResolver) User(ctx context.Context, obj *model.UserPreferences) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userPreferencesResolver) Category(ctx context.Context, obj *model.UserPreferences) (*model.Category, error) {
	panic(fmt.Errorf("not implemented"))
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

// ChatDetails returns generated.ChatDetailsResolver implementation.
func (r *Resolver) ChatDetails() generated.ChatDetailsResolver { return &chatDetailsResolver{r} }

// ChatHeader returns generated.ChatHeaderResolver implementation.
func (r *Resolver) ChatHeader() generated.ChatHeaderResolver { return &chatHeaderResolver{r} }

// Coupon returns generated.CouponResolver implementation.
func (r *Resolver) Coupon() generated.CouponResolver { return &couponResolver{r} }

// EmailToken returns generated.EmailTokenResolver implementation.
func (r *Resolver) EmailToken() generated.EmailTokenResolver { return &emailTokenResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Review returns generated.ReviewResolver implementation.
func (r *Resolver) Review() generated.ReviewResolver { return &reviewResolver{r} }

// ReviewImage returns generated.ReviewImageResolver implementation.
func (r *Resolver) ReviewImage() generated.ReviewImageResolver { return &reviewImageResolver{r} }

// Topay returns generated.TopayResolver implementation.
func (r *Resolver) Topay() generated.TopayResolver { return &topayResolver{r} }

// TopayToken returns generated.TopayTokenResolver implementation.
func (r *Resolver) TopayToken() generated.TopayTokenResolver { return &topayTokenResolver{r} }

// UserPreferences returns generated.UserPreferencesResolver implementation.
func (r *Resolver) UserPreferences() generated.UserPreferencesResolver {
	return &userPreferencesResolver{r}
}

// Wishlist returns generated.WishlistResolver implementation.
func (r *Resolver) Wishlist() generated.WishlistResolver { return &wishlistResolver{r} }

type chatDetailsResolver struct{ *Resolver }
type chatHeaderResolver struct{ *Resolver }
type couponResolver struct{ *Resolver }
type emailTokenResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type reviewResolver struct{ *Resolver }
type reviewImageResolver struct{ *Resolver }
type topayResolver struct{ *Resolver }
type topayTokenResolver struct{ *Resolver }
type userPreferencesResolver struct{ *Resolver }
type wishlistResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *queryResolver) AdminData(ctx context.Context, typeArg string) (interface{}, error) {
	db := config.GetDB()
	var data []map[string]interface{}

	db.Raw(`SELECT DISTINCT
	CAST(DATE(t.date) AS DATE) AS date,
	COUNT(*) AS 'Total Transaction'
	FROM 
	transactions t, 
	(SELECT date FROM transactions) x  
	WHERE
		DATEDIFF(t.date, x.date) = 0
	GROUP BY
		t.date`).Find(&data)

	if data != nil {
		fmt.Println(data)
		for i := 0; i < len(data); i++ {
			fmt.Println(data[i]["Total Transaction"])
			fmt.Println(data[i]["date"])
		}
	}

	return data, nil
}

type trans struct {
	date             string
	totalTransaction int
}

func (r *ReviewResolver) TransactionDetail(ctx context.Context, obj *model.Review) (*model.TransactionDetail, error) {
	db := config.GetDB()
	transactionDetail := new(model.TransactionDetail)

	if err := db.First(transactionDetail, "transaction_detail_id = ?", obj.TransactionDetailId).Error; err != nil {
		return nil, err
	}

	return transactionDetail, nil
}
func (r *ReviewResolver) User(ctx context.Context, obj *model.Review) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if err := db.First(user, "user_id = ?", obj.UserId).Error; err != nil {
		return nil, err
	}

	return user, nil
}

type ReviewResolver struct{ *Resolver }

func (r *chatResolver) SenderModel(ctx context.Context, obj *model.Chat) (model.ChatSenderReceiver, error) {
	db := config.GetDB()
	user := new(model.ChatSenderReceiver)
	shop := new(model.ChatSenderReceiver)

	err := db.Model(&model.User{}).Where("id = ?", obj.Sender).Find(&user).Error
	// err := db.Model(&model.Shop{}).Where("id = ?", obj.Sender).Find(&shop).Error
	// err := db.Table("users").("JOIN shops ON users.id = ") Where("id = ?", obj.Sender).Find(&user).Error
	// err := db.Model(&user).Where("id = ?", obj.Sender).Find(&user).Error

	if user != nil {
		return *user, err
	}

	return *shop, db.Model(&model.Shop{}).Where("id = ?", obj.Sender).Find(&shop).Error
}
func (r *chatResolver) ReceiverModel(ctx context.Context, obj *model.Chat) (model.ChatSenderReceiver, error) {
	fmt.Println("Receiver Model")
	// db := config.GetDB()
	// user := new(model.User)
	// shop := new(model.Shop)

	// err := db.Model(&user).Where("id = ?", obj.Receiver).Find(&user).Error

	// if len(user.ID) > 0 {
	// 	return user, err
	// }

	// return shop, db.Model(&shop).Where("id = ?", obj.Receiver).Find(&shop).Error
	db := config.GetDB()
	user := new(model.ChatSenderReceiver)
	shop := new(model.ChatSenderReceiver)

	err := db.Model(&model.User{}).Where("id = ?", obj.Receiver).Find(&user).Error
	// err := db.Model(&model.Shop{}).Where("id = ?", obj.Sender).Find(&shop).Error
	// err := db.Table("users").("JOIN shops ON users.id = ") Where("id = ?", obj.Sender).Find(&user).Error
	// err := db.Model(&user).Where("id = ?", obj.Sender).Find(&user).Error

	fmt.Println(user)
	if user != nil {
		return *user, err
	}
	fmt.Println(shop)

	return *shop, db.Model(&model.Shop{}).Where("id = ?", obj.Receiver).Find(&shop).Error
}

type chatResolver struct{ *Resolver }
type Pair struct {
	UserID string
	Value  float64
}
type PairList []Pair

func (p PairList) Len() int           { return len(p) }
func (p PairList) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
func (p PairList) Less(i, j int) bool { return p[i].Value > p[j].Value }
func (r *ReviewResolver) CreatedAt(ctx context.Context, obj *model.Review) (*time.Time, error) {
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
	db := config.GetDB()
	transaction := new(model.Transaction)

	if err := db.Where("id = ?", obj.TransactionId).Find(&transaction).Error; err != nil {
		return nil, err
	}

	return transaction, nil
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
