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

func (r *productResolver) Sold(ctx context.Context, obj *model.Product) (int, error) {
	db := config.GetDB()
	var data map[string]interface{}

	query := db.Raw(`
	SELECT 
		CAST(SUM(td.quantity) AS INT) AS 'sold'
	FROM 
		products p 
		JOIN transaction_details td ON p.id = td.product_id
	WHERE
		p.id = ?
	GROUP BY
		p.id
	`, obj.ID)

	if err := query.Find(&data).Error; err != nil {
		return 0, err
	}

	if num, ok := data["sold"].(int64); ok {
		return int(num), nil
	}

	return 0, nil
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

	if ctx.Value("auth") != nil {
		userPreferences := new(model.UserPreferences)
		userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

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

			userPreferences.Score += 1

			if err := db.Save(&userPreferences).Error; err != nil {
				return nil, err
			}
		}
	}

	helpers.ParseTime(&product.CreatedAt)

	return product, nil
}

func (r *queryResolver) Products(ctx context.Context, id *string, slug *string, categoryID *string, keyword *string, limit *int, offset *int, order *string, recommendation *bool, shopTypes []*int, bestSeller *bool) ([]*model.Product, error) {
	db := config.GetDB()
	var products []*model.Product
	defaultOffset := 0
	defaultLimit := 9999999999

	if offset != nil {
		defaultOffset = *offset
	}

	// fmt.Printf("Default Limit Value: %d\n", defaultLimit)
	if limit != nil {
		// fmt.Printf("Limit Value: %d\n", *limit)
		defaultLimit = *limit
	}
	// fmt.Printf("Default Limit Value: %d\n", defaultLimit)

	if id != nil && *id != "" {
		if err := db.Where("id = ?", *id).Find(&products).Error; err != nil {
			return nil, err
		}

		// return products, nil
	} else if slug != nil && *slug != "" {
		shop := new(model.Shop)

		if err := db.First(shop, "slug = ?", slug).Error; err != nil {
			return nil, err
		}
		if bestSeller != nil {
			fmt.Println()
			query := db.Raw(`SELECT
			p.*
			FROM 
				products p JOIN transaction_details td
				ON p.id = td.product_id join transactions t
				ON t.id = td.transaction_id JOIN shops s
				ON s.id = t.shop_id
			WHERE
				s.slug = ?
			GROUP BY
				p.id,
				p.name  
			ORDER BY SUM(td.quantity) DESC
			LIMIT ?`, *slug, defaultLimit)

			if err := query.Find(&products).Error; err != nil {
				return nil, err
			}
		} else if recommendation != nil && *recommendation {
			fmt.Println("Masuk Shop Recommendation")
			if ctx.Value("auth") != nil {
				fmt.Println("Masuk CTX AUTH SHOP")
				// userId := "1234"
				userId := ctx.Value("auth").(*service.JwtCustomClaim).ID
				var minmax map[string]interface{}
				db.Raw(`
				SELECT
				MIN(p.price) AS 'min',
				MAX(p.price) AS 'max'
				FROM 
				transactions t 
				JOIN transaction_details td ON t.id = td.transaction_id
				JOIN products p ON p.id = td.product_id
				WHERE
				t.user_id = ?
				`, userId).Find(&minmax)

				var categories []*model.Category
				var userPreferences []*model.UserPreferences
				var otherUsers []*model.User
				totalUniqueCategories := 0

				db.Find(&categories) //Cari panjang Categories

				var vectorCurrUser = make([]int, len(categories))
				for i := range vectorCurrUser {
					vectorCurrUser[i] = 0
				}

				db.Where("user_id = ?", userId).Find(&userPreferences)
				db.Where("id <> ?", userId).Find(&otherUsers)

				//Simpenin Index Categories
				categoriesIndex := make(map[string]int)
				userCategories := make(map[string]int)

				//Simpen User Preferences -- Isi Categoriesnya
				userPrefCategoryScore := make(map[string]int)

				for i := 0; i < len(userPreferences); i++ {
					userPrefCategoryScore[userPreferences[i].CategoryId] = userPreferences[i].Score
					categoriesIndex[userPreferences[i].CategoryId] = totalUniqueCategories
					userCategories[userPreferences[i].CategoryId] = 0
					totalUniqueCategories += 1
				}

				for k, v := range categoriesIndex {
					vectorCurrUser[v] = userPrefCategoryScore[k]
				}

				var cosineResults = make(map[string]float64, len(otherUsers))
				/*
					OTHER USER SECTION CHECK
				*/
				for i := 0; i < len(otherUsers); i++ {
					otherUserPrefCategoryScore := make(map[string]int)
					var otherUserPreferences []*model.UserPreferences
					cosineResults[otherUsers[i].ID] = 0
					db.Where("user_id = ?", otherUsers[i].ID).Find(&otherUserPreferences) //Find Other User's Preferences
					for i := 0; i < len(otherUserPreferences); i++ {
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

					// fmt.Printf("Cosine Value: %f\n", currCosineVal)
				}
				sortedUsersCosine := make(PairList, len(cosineResults))

				i := 0
				for k, v := range cosineResults {
					sortedUsersCosine[i] = Pair{k, v}
					i++
				}

				sort.Sort(sortedUsersCosine)

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
				stringAllCategories := ""
				stringNewCategories := ""
				iterator := 0
				for k, _ := range uniqueNewCategories {
					// if(iterator > 0) {
					stringNewCategories += "'"
					stringAllCategories += "'"
					// }
					stringNewCategories += k
					stringAllCategories += k
					if iterator < len(uniqueNewCategories)-1 {
						stringNewCategories += "',"
					}
					stringAllCategories += "',"
					iterator += 1
				}
				stringNewCategories += "'"

				// var extraProduct []*model.Product
				// productBaseQuery := "SELECT id, name, description, price, discount, stock, metadata, created_at, category_id, shop_id, original_id, valid_to FROM products WHERE category_id IN"
				// query := fmt.Sprintf("%s (%s) LIMIT %d", productBaseQuery, stringNewCategories, 5)
				// query := fmt.Sprintf("%s (%s)", "SELECT id, name FROM categories WHERE id IN", stringNewCategories)
				// db.Raw(query).Scan(&extraProduct)
				// db.Raw("SELECT id, name FROM categories WHERE id IN (?)", stringNewCategories).Scan(&extraCategories)
				// db.Where("id IN (?)", stringNewCategories).Limit(5).Find(&extraCategories)

				// remaining := displayProduct - len(extraProduct)

				stringUserCategories := ""
				iterator = 0
				for k, _ := range userCategories {
					// if(iterator > 0) {
					stringUserCategories += "'"
					// }
					stringAllCategories += "'"
					stringUserCategories += k
					stringAllCategories += k

					if iterator < len(userCategories)-1 {
						stringUserCategories += "',"
						stringAllCategories += "',"
					}
					iterator += 1
				}
				stringUserCategories += "'"
				stringAllCategories += "'"

				// fmt.Printf("Length Extra Product: %d\n", len(extraProduct))

				// for i := range extraProduct {
				// 	fmt.Println(extraProduct[i].Name)
				// }

				// var userProduct []*model.Product
				// query = fmt.Sprintf("%s (%s) LIMIT %d", productBaseQuery, stringUserCategories, remaining)
				// db.Raw(query).Scan(&userProduct)

				// userProduct = append(userProduct, extraProduct...)
				// products = userProduct

				shopRecommendationBaseQuery := fmt.Sprintf(`
		SELECT 
			p.* 
		FROM
			products p
			JOIN shops s ON p.shop_id = s.id
			JOIN categories c ON p.category_id = c.id
		WHERE
			s.slug = '%s'
			AND c.id IN (%s)`, *slug, stringAllCategories)

				if minmax["min"] != nil && minmax["max"] != nil { //ada min max
					minPrice := int(minmax["min"].(int64))
					maxPrice := int(minmax["max"].(int64))
					withMinMaxQuery := fmt.Sprintf("%s AND (p.price BETWEEN %d AND %d) LIMIT 10", shopRecommendationBaseQuery, minPrice, maxPrice)

					// db.Raw(`
					// SELECT
					// 	p.*
					// FROM
					// 	products p
					// 	JOIN shops s ON p.shop_id = s.id
					// 	JOIN categories c ON p.category_id = c.id
					// WHERE
					// 	s.slug = 'detailguy'
					// 	AND c.id IN ()
					// 	AND (p.price BETWEEN 100000 AND 1000000)
					// `, minPrice, maxPrice)
					db.Raw(withMinMaxQuery).Find(&products)
				} else { //gaada min max
					withLimitQuery := fmt.Sprintf("%s LIMIT 10", shopRecommendationBaseQuery)
					db.Raw(withLimitQuery).Find(&products)
				}

			} else {
				db.Raw(`SELECT 
				p.*
			FROM
				products p
				JOIN shops s ON p.shop_id = s.id
				JOIN transaction_details td ON td.product_id = p.id
			WHERE
				s.slug = ?
			GROUP BY
				p.id
			ORDER BY SUM(td.quantity) DESC`, *slug).Find(&products)
			}

			for i := 0; i < len(products); i++ {
				fmt.Println(products[i])
			}

		} else if limit != nil {
			query := db.Where("shop_id = ? AND valid_to = ? AND stock > 0 ", shop.ID, "0000-00-00 00:00:00.000").Limit(defaultLimit).Offset(defaultOffset)

			if order != nil {
				query = query.Order(*order)
			}
			if err := query.Find(&products).Error; err != nil {
				return nil, err
			}
			// return products, nil
		}
		// else {
		// 	if err := db.Where("shop_id = ? AND valid_to = ? AND stock > 0 ", shop.ID, "0000-00-00 00:00:00.000").Offset(defaultOffset).Find(&products).Error; err != nil {
		// 		return nil, err
		// 	}
		// }

	} else if keyword != nil && *keyword != "" {
		if categoryID != nil && *categoryID != "" {
			fmt.Println(*categoryID)
			if err := db.Where("valid_to = ? AND stock > 0", "0000-00-00 00:00:00.000").Where("name LIKE ? AND category_id = ?", "%"+*keyword+"%", *categoryID).Limit(defaultLimit).Offset(defaultOffset).Find(&products).Error; err != nil {
				return nil, err
			}
			fmt.Println(len(products))
			for i := 0; i < len(products); i++ {
				fmt.Println(products[i].Name)
			}
		} else {
			if err := db.Where("valid_to = ? AND stock > 0", "0000-00-00 00:00:00.000").Where("name LIKE ?", "%"+*keyword+"%").Limit(defaultLimit).Offset(defaultOffset).Find(&products).Error; err != nil {
				return nil, err
			}
		}
	} else if categoryID != nil && *categoryID != "" {
		if err := db.Where("valid_to = ? AND stock > 0", "0000-00-00 00:00:00.000").Where("category_id = ?", *categoryID).Limit(defaultLimit).Offset(defaultOffset).Find(&products).Error; err != nil {
			return nil, err
		}
	} else if order != nil && *order != "" {
		if err := db.Where("valid_to = ? AND stock > 0", "0000-00-00 00:00:00.000").Order(*order).Find(&products).Error; err != nil {
			return nil, err
		}
	} else if bestSeller != nil {
		query := db.Raw(`SELECT
			p.*
			FROM 
				products p JOIN transaction_details td
				ON p.id = td.product_id join transactions t
				ON t.id = td.transaction_id JOIN shops s
				ON s.id = t.shop_id
			GROUP BY
				p.id,
				p.name  
			ORDER BY SUM(td.quantity) DESC
			LIMIT ?`, defaultLimit)

		if err := query.Find(&products).Error; err != nil {
			return nil, err
		}
	} else if recommendation != nil && *recommendation {
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

		//Simpenin Index Categories
		categoriesIndex := make(map[string]int)
		userCategories := make(map[string]int)

		//Simpen User Preferences -- Isi Categoriesnya
		userPrefCategoryScore := make(map[string]int)

		for i := 0; i < len(userPreferences); i++ {
			userPrefCategoryScore[userPreferences[i].CategoryId] = userPreferences[i].Score
			categoriesIndex[userPreferences[i].CategoryId] = totalUniqueCategories
			userCategories[userPreferences[i].CategoryId] = 0
			totalUniqueCategories += 1
		}

		for k, v := range categoriesIndex {
			vectorCurrUser[v] = userPrefCategoryScore[k]
		}

		var cosineResults = make(map[string]float64, len(otherUsers))
		/*
			OTHER USER SECTION CHECK
		*/
		for i := 0; i < len(otherUsers); i++ {
			otherUserPrefCategoryScore := make(map[string]int)
			var otherUserPreferences []*model.UserPreferences
			cosineResults[otherUsers[i].ID] = 0
			db.Where("user_id = ?", otherUsers[i].ID).Find(&otherUserPreferences) //Find Other User's Preferences
			for i := 0; i < len(otherUserPreferences); i++ {
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

			// fmt.Printf("Cosine Value: %f\n", currCosineVal)
		}
		sortedUsersCosine := make(PairList, len(cosineResults))

		i := 0
		for k, v := range cosineResults {
			sortedUsersCosine[i] = Pair{k, v}
			i++
		}

		sort.Sort(sortedUsersCosine)

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

		stringNewCategories := ""
		iterator := 0
		for k, _ := range uniqueNewCategories {
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

		var extraProduct []*model.Product
		productBaseQuery := "SELECT id, name, description, price, discount, stock, metadata, created_at, category_id, shop_id, original_id, valid_to FROM products WHERE category_id IN"
		query := fmt.Sprintf("%s (%s) LIMIT %d", productBaseQuery, stringNewCategories, 5)
		// query := fmt.Sprintf("%s (%s)", "SELECT id, name FROM categories WHERE id IN", stringNewCategories)
		db.Raw(query).Scan(&extraProduct)
		// db.Raw("SELECT id, name FROM categories WHERE id IN (?)", stringNewCategories).Scan(&extraCategories)
		// db.Where("id IN (?)", stringNewCategories).Limit(5).Find(&extraCategories)

		remaining := displayProduct - len(extraProduct)

		stringUserCategories := ""
		iterator = 0
		for k, _ := range userCategories {
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

		// fmt.Printf("Length Extra Product: %d\n", len(extraProduct))

		for i := range extraProduct {
			fmt.Println(extraProduct[i].Name)
		}

		var userProduct []*model.Product
		query = fmt.Sprintf("%s (%s) LIMIT %d", productBaseQuery, stringUserCategories, remaining)
		db.Raw(query).Scan(&userProduct)

		userProduct = append(userProduct, extraProduct...)
		products = userProduct
	} else {
		if err := db.Where("valid_to = ? AND stock > 0", "0000-00-00 00:00:00.000").Limit(defaultLimit).Find(&products).Error; err != nil {
			return nil, err
		}
	}

	var filteredProduct []*model.Product
	fmt.Println(len(shopTypes))
	if len(shopTypes) > 0 {
		shopTypeDict := make(map[int]int)
		for i := range shopTypes {
			shopTypeDict[*shopTypes[i]] = 0
		}

		for i := range products {
			tempShop := new(model.Shop)
			if err := db.Where("id = ?", products[i].ShopID).Find(&tempShop).Error; err != nil {
				return nil, err
			}
			if _, exists := shopTypeDict[tempShop.Type]; exists {
				filteredProduct = append(filteredProduct, products[i])
			}
		}
	} else {
		filteredProduct = products
	}

	for i := 0; i < len(filteredProduct); i++ {
		helpers.ParseTime(&filteredProduct[i].CreatedAt)
	}
	return filteredProduct, nil
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

func (r *queryResolver) InfiniteScrolling(ctx context.Context, limit int) ([]*model.Product, error) {
	db := config.GetDB()
	var products []*model.Product

	if err := db.Where("valid_to = ? AND stock > 0 ", "0000-00-00 00:00:00.000").Limit(limit).Find(&products).Error; err != nil {
		return nil, err
	}

	return products, nil
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
