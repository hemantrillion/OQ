package routes

import (
	controller "restaurant-management/controllers"

	"github.com/gin-gonic/gin"
)

func NotesRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.GET("/notes", controller.GetNotes())
	incomingRoutes.GET("/notes/:note_id", controller.GetNote())
	incomingRoutes.POST("/notes", controller.CreateNote())
	incomingRoutes.PATCH("/notes/:note_id", controller.UpdateNote())
}
