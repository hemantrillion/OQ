package middleware

import (
	"net/http"
	"strings"

	helper "restaurant-management/helpers"

	"github.com/gin-gonic/gin"
)

func Authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientToken := c.Request.Header.Get("token")
		if clientToken == "" {
			authHeader := c.Request.Header.Get("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				clientToken = strings.TrimPrefix(authHeader, "Bearer ")
			} else {
				clientToken = authHeader
			}
		}

		if clientToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No Authorization token provided"})
			c.Abort()
			return
		}

		claims, err := helper.ValidateToken(clientToken)
		if err != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err})
			c.Abort()
			return
		}

		c.Set("email", claims.Email)
		c.Set("first_name", claims.First_name)
		c.Set("last_name", claims.Last_name)
		c.Set("uid", claims.Uid)
		c.Set("user_type", claims.User_type)

		c.Next()
	}
}
