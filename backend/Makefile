-include .env
export

MIGRATIONS_DIR := migrations
MIGRATE        := migrate -path $(MIGRATIONS_DIR) -database "$(DATABASE_URL)"
MIGRATE_VER    := v4.18.3

.DEFAULT_GOAL := help

.PHONY: help
help: ## Tampilkan daftar perintah
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ---------- Aplikasi ----------

.PHONY: run
run: ## Jalankan API (go run)
	go run ./cmd/api

.PHONY: build
build: ## Build binary ke bin/api
	go build -o bin/api ./cmd/api

.PHONY: tidy
tidy: ## Rapikan go.mod & go.sum
	go mod tidy

.PHONY: vet
vet: ## go vet seluruh package
	go vet ./...

.PHONY: test
test: ## Jalankan seluruh test
	go test ./... -v


.PHONY: check-db-url
check-db-url:
	@if [ -z "$(DATABASE_URL)" ]; then echo "DATABASE_URL belum di-set (cek .env)"; exit 1; fi

.PHONY: migrate-create
migrate-create: ## Buat file migration baru: make migrate-create name=create_tugas_table
	@if [ -z "$(name)" ]; then echo "Pakai: make migrate-create name=<nama_migration>"; exit 1; fi
	migrate create -ext sql -dir $(MIGRATIONS_DIR) -seq $(name)

.PHONY: migrate-up
migrate-up: check-db-url ## Jalankan semua migration yang belum dijalankan
	$(MIGRATE) up

.PHONY: migrate-down
migrate-down: check-db-url ## Rollback migration: make migrate-down (1 step) / make migrate-down n=3
	$(MIGRATE) down $(or $(n),1)

.PHONY: migrate-version
migrate-version: check-db-url ## Lihat versi migration saat ini
	$(MIGRATE) version

.PHONY: migrate-force
migrate-force: check-db-url ## Paksa set versi (saat status dirty): make migrate-force version=1
	@if [ -z "$(version)" ]; then echo "Pakai: make migrate-force version=<nomor>"; exit 1; fi
	$(MIGRATE) force $(version)

.PHONY: migrate-fresh
migrate-fresh: check-db-url ## [DEV ONLY] Rollback semua lalu migrate ulang (data hilang)
	@read -p "Semua tabel akan di-rollback dan data hilang. Lanjut? [y/N] " ans && [ "$$ans" = "y" ]
	$(MIGRATE) down -all
	$(MIGRATE) up