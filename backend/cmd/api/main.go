package main

import (
	"arkavidia-studytrack/internal/config"
	"arkavidia-studytrack/internal/database"
	"arkavidia-studytrack/internal/handlers"
	"arkavidia-studytrack/internal/middleware"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	var cfg *config.Config
	var err error

	cfg, err = config.Load()
	if err != nil {
		log.Fatal("Fail to load configuration: ", err)
	}

	var pool *pgxpool.Pool
	pool, err = database.Connect(cfg.DatabaseUrl)
	if err != nil {
		log.Fatal("Fail to connect database: ", err)
	}

	defer pool.Close()

	var router *gin.Engine = gin.Default()
	api := router.Group("/api")
	api.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message":  "API is running!",
			"status":   "success",
			"database": "connected",
		})
	})

	api.POST("/auth/register", handlers.HandleCreateUser(pool))
	api.POST("/auth/login", handlers.HandleLogin(pool, cfg))

	api.GET("/mata-kuliah", middleware.AuthMiddleware(cfg), handlers.HandleGetAllMatkul(pool))
	api.POST("/mata-kuliah", middleware.AuthMiddleware(cfg), handlers.HandleCreateMatkul(pool))
	api.PUT("/mata-kuliah/:id", middleware.AuthMiddleware(cfg))
	api.DELETE("/mata-kuliah/:id", middleware.AuthMiddleware(cfg))

	log.Println("Server running on port: 8000")
	router.Run(":" + cfg.Port)
}
