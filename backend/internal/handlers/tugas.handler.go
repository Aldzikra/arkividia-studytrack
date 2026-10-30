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
	"github.com/jackc/pgx/v5/pgxpool"
)

func HandleCreateTugas(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tugas models.Tugas

		if err := c.ShouldBindJSON(&tugas); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid formats"})
			return
		}

		createdTugas, err := repository.CreateTugas(pool, c.GetString("user_id"), &tugas)
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}
		if err != nil {
			log.Println("create tugas:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save Assignment"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "Assignment added successfully",
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

func HandleUpdateTugas(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
			return
		}

		var tugas models.Tugas
		if err := c.ShouldBindJSON(&tugas); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid formats"})
			return
		}

		tugas.Id = id

		updated, err := repository.UpdateTugas(pool, c.GetString("user_id"), &tugas)
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Assignment or course not found"})
			return
		}
		if err != nil {
			log.Println("update tugas:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Assignment"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Assignment updated successfully",
			"data":    updated,
		})
	}
}

func HandleDeleteTugas(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
			return
		}

		deleted, err := repository.DeleteTugas(pool, id, c.GetString("user_id"))
		if err != nil {
			log.Println("delete tugas:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Assignment"})
			return
		}
		if !deleted {
			c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Assignment deleted successfully"})
	}
}

func HandleUpdateStatusTugas(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
			return
		}

		var body struct {
			Status string `json:"status" binding:"required,oneof=belum selesai"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid formats"})
			return
		}

		updated, err := repository.UpdateStatusTugas(pool, id, c.GetString("user_id"), body.Status)
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
			return
		}
		if err != nil {
			log.Println("update status tugas:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Status updated successfully",
			"data":    updated,
		})
	}
}
