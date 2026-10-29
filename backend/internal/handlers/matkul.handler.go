package handlers

import (
	"arkavidia-studytrack/internal/models"
	"arkavidia-studytrack/internal/repository"
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

func HandleCreateMatkul(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		var matkul models.Matkul

		if err := c.ShouldBindJSON(&matkul); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid formats"})
			return
		}

		createdMatkul, err := repository.CreateMatkul(pool, c.GetString("user_id"), &matkul)
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				c.JSON(http.StatusConflict, gin.H{"error": "Course code already exists"})
				return
			}
			log.Println("create matkul:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save Course"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "Course added successfully",
			"data":    createdMatkul,
		})

	}
}

func HandleGetAllMatkul(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		matkul, err := repository.GetAllMatkul(pool, c.GetString("user_id"))

		if err != nil {
			log.Println("get matkul:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses"})
			return
		}

		c.JSON(http.StatusOK, matkul)
	}
}
