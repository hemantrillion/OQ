package main

import (
	"fmt"
	"net/http"
	"os"

	"restaurant-management/middleware"
	"restaurant-management/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware())

	// Health Check and Root API status
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "operational",
			"service": "Booking OQ API Engine (Golang / Gin / MongoDB)",
			"version": "1.0.0",
		})
	})

	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": fmt.Sprintf("%d", os.Getpid()),
		})
	})

	// Public Routes (Signup & Login)
	publicRoutes := router.Group("/")
	routes.UserRoutes(router)

	// Protected Routes (Protected with JWT Authentication Middleware)
	protected := router.Group("/")
	protected.Use(middleware.Authentication())
	{
		routes.FoodRoutes(router)
		routes.MenuRoutes(router)
		routes.TableRoutes(router)
		routes.InvoiceRoutes(router)
		routes.NotesRoutes(router)
		routes.OrderRoutes(router)
		routes.OrderItemRoutes(router)
	}

	_ = publicRoutes

	fmt.Printf("[Server] Booking OQ API running on port :%s\n", port)
	err := router.Run(":" + port)
	if err != nil {
		fmt.Printf("[Server Error] Failed to start server: %v\n", err)
	}
}
