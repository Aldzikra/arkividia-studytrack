package main

import (
	"arkavidia-studytrack/internal/config"
	"arkavidia-studytrack/internal/database"
	"arkavidia-studytrack/internal/handlers"
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
	router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message":  "API is running!",
			"status":   "success",
			"database": "connected",
		})
	})

	router.POST("/auth/register", handlers.HandleCreateUser(pool))
	router.POST("/auth/login")

	log.Println("Server running on port: 8000")
	router.Run(":" + cfg.Port)
}
