package handlers

import (
	"arkavidia-studytrack/internal/models"
	"arkavidia-studytrack/internal/repository"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

func HandleCreateTugas(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tugas models.Tugas

		if err := c.ShouldBindJSON(&tugas); err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": "Invalid formats"})
			return
		}

		createdTugas, err := repository.CreateTugas(pool, c.GetString("user_id"), &tugas)
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
			"data":    createdTugas,
		})
	}
}

func HandleGetAllTugas(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		tugas, err := repository.GetAllTugas(pool, c.GetString("user_id"))

		if err != nil {
			log.Println("get tugas: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch assignment"})
			return
		}

		c.JSON(http.StatusOK, tugas)
	}
}

func HandleGetTugasById(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
			return
		}

		tugas, err := repository.GetTugasByID(pool, id, c.GetString("user_id"))
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
			return
		}

		if err != nil {
			log.Println("get tugas by id: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch assignment"})
			return 
		}

		c.JSON(http.StatusOK, tugas)
	}
}

