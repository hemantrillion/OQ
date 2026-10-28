package controller

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"restaurant-management/database"
	"restaurant-management/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var menuCollectionRef *mongo.Collection = database.OpenCollection(database.Client, "menu")

func GetMenus() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		if menuCollectionRef == nil {
			c.JSON(http.StatusOK, []models.Menu{})
			return
		}

		result, err := menuCollectionRef.Find(context.TODO(), bson.M{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while listing the menu items"})
			return
		}

		var allMenus []bson.M
		if err = result.All(ctx, &allMenus); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, allMenus)
	}
}

func GetMenu() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		menuId := c.Param("menu_id")
		var menu models.Menu

		if menuCollectionRef == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "database connection unavailable"})
			return
		}

		err := menuCollectionRef.FindOne(ctx, bson.M{"menu_id": menuId}).Decode(&menu)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while fetching the menu"})
			return
		}
		c.JSON(http.StatusOK, menu)
	}
}

func CreateMenu() gin.HandlerFunc {
	return func(c *gin.Context) {
		var menu models.Menu
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		if err := c.BindJSON(&menu); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		validationErr := validate.Struct(menu)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		menu.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		menu.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		menu.ID = primitive.NewObjectID()
		menu.Menu_id = menu.ID.Hex()

		if menuCollectionRef == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database not connected"})
			return
		}

		result, insertErr := menuCollectionRef.InsertOne(ctx, menu)
		if insertErr != nil {
			msg := fmt.Sprintf("Menu item was not created")
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

func inTimeSpan(start, end, check time.Time) bool {
	return check.After(start) && check.Before(end)
}

func UpdateMenu() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var menu models.Menu

		if err := c.BindJSON(&menu); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		menuId := c.Param("menu_id")
		filter := bson.M{"menu_id": menuId}

		var updateObj primitive.D

		if menu.Start_Date != nil && menu.End_Date != nil {
			if !inTimeSpan(*menu.Start_Date, *menu.End_Date, time.Now()) {
				msg := "kindly retype the time"
				c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
				return
			}

			updateObj = append(updateObj, bson.E{Key: "start_date", Value: menu.Start_Date})
			updateObj = append(updateObj, bson.E{Key: "end_date", Value: menu.End_Date})

			if menu.Name != "" {
				updateObj = append(updateObj, bson.E{Key: "name", Value: menu.Name})
			}
			if menu.Category != "" {
				updateObj = append(updateObj, bson.E{Key: "category", Value: menu.Category})
			}

			menu.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
			updateObj = append(updateObj, bson.E{Key: "updated_at", Value: menu.Updated_at})

			upsert := true
			opt := options.UpdateOptions{
				Upsert: &upsert,
			}

			if menuCollectionRef == nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "database connection unavailable"})
				return
			}

			result, err := menuCollectionRef.UpdateOne(
				ctx,
				filter,
				bson.D{
					{Key: "$set", Value: updateObj},
				},
				&opt,
			)

			if err != nil {
				msg := "Menu update failed"
				c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
				return
			}

			c.JSON(http.StatusOK, result)
		} else {
			if menu.Name != "" {
				updateObj = append(updateObj, bson.E{Key: "name", Value: menu.Name})
			}
			if menu.Category != "" {
				updateObj = append(updateObj, bson.E{Key: "category", Value: menu.Category})
			}

			menu.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
			updateObj = append(updateObj, bson.E{Key: "updated_at", Value: menu.Updated_at})

			upsert := true
			opt := options.UpdateOptions{
				Upsert: &upsert,
			}

			result, err := menuCollectionRef.UpdateOne(
				ctx,
				filter,
				bson.D{
					{Key: "$set", Value: updateObj},
				},
				&opt,
			)

			if err != nil {
				msg := "Menu update failed"
				c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
				return
			}

			c.JSON(http.StatusOK, result)
		}
	}
}
