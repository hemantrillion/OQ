package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func DBinstance() *mongo.Client {
	mongodbURL := os.Getenv("MONGODB_URL")
	if mongodbURL == "" {
		mongodbURL = "mongodb://localhost:27017"
	}
	fmt.Printf("[Database] Connecting to MongoDB at: %s\n", mongodbURL)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongodbURL))
	if err != nil {
		log.Printf("[Database Warning] Failed to initialize MongoDB client: %v\n", err)
		return client
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Printf("[Database Warning] MongoDB ping failed (check if mongod is running): %v\n", err)
	} else {
		fmt.Println("[Database] Connected successfully to MongoDB!")
	}

	return client
}

var Client *mongo.Client = DBinstance()

func OpenCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	if client == nil {
		return nil
	}
	dbName := os.Getenv("DATABASE_NAME")
	if dbName == "" {
		dbName = "booking_oq"
	}
	return client.Database(dbName).Collection(collectionName)
}
