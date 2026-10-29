package handlers

import (
	"arkavidia-studytrack/internal/config"
	"arkavidia-studytrack/internal/models"
	"arkavidia-studytrack/internal/repository"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func HandleCreateUser(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		var registerReq RegisterRequest

		if err := c.BindJSON(&registerReq); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if len(registerReq.Password) < 8 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 8 characters long"})
			return
		}

		existingUser, err := repository.GetUserByEmail(pool, registerReq.Email)
		if err == nil && existingUser != nil {
			c.JSON(http.StatusConflict, gin.H{"error": "email already registered"})
			return
		}

		hashedPass, err := bcrypt.GenerateFromPassword([]byte(registerReq.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Println("hash password:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}

		user := &models.User{
			Username: registerReq.Username,
			Email:    registerReq.Email,
			Password: string(hashedPass),
		}

		createdUser, err := repository.CreateUser(pool, user)
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				msg := "email already registered"
				if pgErr.ConstraintName == "users_username_key" {
					msg = "username already taken"
				}
				c.JSON(http.StatusConflict, gin.H{"error": msg})
				return
			}
			log.Println("create user:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}

		c.JSON(http.StatusCreated, createdUser)
	}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func HandleLogin(pool *pgxpool.Pool, cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var loginRequest LoginRequest

		if err := c.BindJSON(&loginRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		user, err := repository.GetUserByEmail(pool, loginRequest.Email)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		claims := jwt.MapClaims{
			"user_id": user.Id.String(),
			"email":   user.Email,
			"exp":     time.Now().Add(24 * time.Hour).Unix(),
			"iat":     time.Now().Unix(),
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		signedToken, err := token.SignedString([]byte(cfg.JWTSecret))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": signedToken,
			"user":  user,
		})
	}
}
