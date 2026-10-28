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

var tableCollection *mongo.Collection = database.OpenCollection(database.Client, "table")

func GetTables() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		if tableCollection == nil {
			c.JSON(http.StatusOK, []models.Table{})
			return
		}

		result, err := tableCollection.Find(context.TODO(), bson.M{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while listing table items"})
			return
		}

		var allTables []bson.M
		if err = result.All(ctx, &allTables); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, allTables)
	}
}

func GetTable() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		tableId := c.Param("table_id")
		var table models.Table

		if tableCollection == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "database connection unavailable"})
			return
		}

		err := tableCollection.FindOne(ctx, bson.M{"table_id": tableId}).Decode(&table)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while fetching the table"})
			return
		}
		c.JSON(http.StatusOK, table)
	}
}

func CreateTable() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var table models.Table

		if err := c.BindJSON(&table); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		validationErr := validate.Struct(table)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		table.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		table.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		table.ID = primitive.NewObjectID()
		table.Table_id = table.ID.Hex()

		if tableCollection == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database connection unavailable"})
			return
		}

		result, insertErr := tableCollection.InsertOne(ctx, table)
		if insertErr != nil {
			msg := fmt.Sprintf("Table was not created")
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

func UpdateTable() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var table models.Table
		tableId := c.Param("table_id")

		if err := c.BindJSON(&table); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var updateObj primitive.D

		if table.Number_of_guests != nil {
			updateObj = append(updateObj, bson.E{Key: "number_of_guests", Value: table.Number_of_guests})
		}

		if table.Table_number != nil {
			updateObj = append(updateObj, bson.E{Key: "table_number", Value: table.Table_number})
		}

		table.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		updateObj = append(updateObj, bson.E{Key: "updated_at", Value: table.Updated_at})

		upsert := true
		opt := options.UpdateOptions{
			Upsert: &upsert,
		}

		filter := bson.M{"table_id": tableId}

		if tableCollection == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database connection unavailable"})
			return
		}

		result, err := tableCollection.UpdateOne(
			ctx,
			filter,
			bson.D{
				{Key: "$set", Value: updateObj},
			},
			&opt,
		)

		if err != nil {
			msg := fmt.Sprintf("table update failed")
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}
