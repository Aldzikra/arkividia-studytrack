package services

import (
	"arkavidia-studytrack/internal/models"
	"sort"
	"time"
)

const (
	CategoriMendekati = "mendekati"
	CategoriOverdue   = "overdue"
	CategoriNormal    = "normal"
)

func CategorizeDeadline(deadline time.Time, status string, now time.Time) string {
	if status == "selesai" {
		return CategoriNormal
	}

	if !deadline.After(now) {
		return CategoriOverdue
	}

	if deadline.Sub(now) < 24*time.Hour {
		return CategoriMendekati
	}

	return CategoriNormal
}

func CategoryRank(c string) int {
	switch c {
	case CategoriMendekati:
		return 0
	case CategoriOverdue:
		return 1
	default:
		return 2
	}
}

func SortTugas(list []models.Tugas, now time.Time) {
	for i := range list {
		list[i].DeadlineCategory = CategorizeDeadline(list[i].Deadline, list[i].Status, now)
	}

	sort.SliceStable(list, func(i, j int) bool {
		ri, rj := CategoryRank(list[i].DeadlineCategory), CategoryRank(list[j].DeadlineCategory)
		if ri != rj {
			return ri < rj 
		}
		if ri == 0 {
			return list[i].Deadline.Before(list[j].Deadline) // grup mendekati: deadline terdekat dulu
		}
		return false // grup lain: urutan dari DB (created_at DESC) dipertahankan
	})
}
