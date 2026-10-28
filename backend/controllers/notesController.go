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

var notesCollection *mongo.Collection = database.OpenCollection(database.Client, "notes")

func GetNotes() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		if notesCollection == nil {
			c.JSON(http.StatusOK, []models.Note{})
			return
		}

		result, err := notesCollection.Find(context.TODO(), bson.M{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while listing kitchen notes"})
			return
		}

		var allNotes []bson.M
		if err = result.All(ctx, &allNotes); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, allNotes)
	}
}

func GetNote() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		noteId := c.Param("note_id")
		var note models.Note

		if notesCollection == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "database connection unavailable"})
			return
		}

		err := notesCollection.FindOne(ctx, bson.M{"note_id": noteId}).Decode(&note)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while fetching note"})
			return
		}

		c.JSON(http.StatusOK, note)
	}
}

func CreateNote() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var note models.Note

		if err := c.BindJSON(&note); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		validationErr := validate.Struct(note)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		note.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		note.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		note.ID = primitive.NewObjectID()
		note.Note_id = note.ID.Hex()

		if notesCollection == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database connection unavailable"})
			return
		}

		result, insertErr := notesCollection.InsertOne(ctx, note)
		if insertErr != nil {
			msg := fmt.Sprintf("Note item was not created")
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

func UpdateNote() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var note models.Note
		noteId := c.Param("note_id")

		if err := c.BindJSON(&note); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		filter := bson.M{"note_id": noteId}
		var updateObj primitive.D

		if note.Title != "" {
			updateObj = append(updateObj, bson.E{Key: "title", Value: note.Title})
		}
		if note.Text != "" {
			updateObj = append(updateObj, bson.E{Key: "text", Value: note.Text})
		}

		note.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		updateObj = append(updateObj, bson.E{Key: "updated_at", Value: note.Updated_at})

		upsert := true
		opt := options.UpdateOptions{
			Upsert: &upsert,
		}

		if notesCollection == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database connection unavailable"})
			return
		}

		result, err := notesCollection.UpdateOne(
			ctx,
			filter,
			bson.D{
				{Key: "$set", Value: updateObj},
			},
			&opt,
		)

		if err != nil {
			msg := fmt.Sprintf("note update failed")
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}
