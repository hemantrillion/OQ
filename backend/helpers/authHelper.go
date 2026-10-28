package helper

import (
	"errors"

	"github.com/gin-gonic/gin"
)

// CheckUserType verifies if the request context has the specified user role
func CheckUserType(c *gin.Context, role string) (err error) {
	userType := c.GetString("user_type")
	if userType != role {
		return errors.New("unauthorized to access this resource: insufficient privileges")
	}
	return nil
}

// MatchUserTypeToUid ensures that a normal user can only access their own records
func MatchUserTypeToUid(c *gin.Context, userId string) (err error) {
	userType := c.GetString("user_type")
	uid := c.GetString("uid")

	if userType == "USER" && uid != userId {
		return errors.New("unauthorized to access this resource: record ownership mismatch")
	}

	return nil
}
