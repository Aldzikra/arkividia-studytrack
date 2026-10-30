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

func HandleGetMatkulByID(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
			return
		}

		matkul, err := repository.GetMatkulByID(pool, id, c.GetString("user_id"))
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}
		if err != nil {
			log.Println("get matkul by id:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch course"})
			return
		}

		c.JSON(http.StatusOK, matkul)
	}
}

func HandleUpdateMatkul(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
			return
		}

		var matkul models.Matkul
		if err := c.ShouldBindJSON(&matkul); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid formats"})
			return
		}
		matkul.Id = id

		updated, err := repository.UpdateMatkul(pool, c.GetString("user_id"), &matkul)
		if err != nil {
			var pgErr *pgconn.PgError
			switch {
			case errors.Is(err, pgx.ErrNoRows):
				c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			case errors.As(err, &pgErr) && pgErr.Code == "23505":
				c.JSON(http.StatusConflict, gin.H{"error": "Course code already exists"})
			default:
				log.Println("update matkul:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Course updated successfully",
			"data":    updated,
		})
	}
}

func HandleDeleteMatkul(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
			return
		}

		deleted, err := repository.DeleteMatkul(pool, c.GetString("user_id"), id)
		if err != nil {
			log.Println("delete matkul:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Course"})
			return
		}
		if !deleted {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Course deleted successfully"})
	}
}
