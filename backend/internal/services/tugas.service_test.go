package services

import (
	"arkavidia-studytrack/internal/models"
	"slices"
	"testing"
	"time"
)

var now = time.Date(2026, 7, 2, 9, 0, 0, 0, time.UTC)

func TestCategorizeDeadline(t *testing.T) {
	tests := []struct {
		name     string
		deadline time.Time
		status   string
		want     string
	}{
		{"kurang dari 24 jam", now.Add(time.Hour), "belum", CategoriMendekati},
		{"lebih dari 24 jam", now.Add(4 * 24 * time.Hour), "belum", CategoriNormal},
		{"sudah lewat", now.Add(-time.Minute), "belum", CategoriOverdue},
		{"tepat 24 jam", now.Add(24 * time.Hour), "belum", CategoriNormal},
		{"24 jam kurang semenit", now.Add(24*time.Hour - time.Minute), "belum", CategoriMendekati},
		{"deadline sama dengan now", now, "belum", CategoriOverdue},
		{"selesai, seharusnya mendekati", now.Add(time.Hour), "selesai", CategoriNormal},
		{"selesai, seharusnya overdue", now.Add(-time.Hour), "selesai", CategoriNormal},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := CategorizeDeadline(tt.deadline, tt.status, now); got != tt.want {
				t.Errorf("got %q, want %q", got, tt.want)
			}
		})
	}
}

func TestSortTugas(t *testing.T) {
	list := []models.Tugas{
		{Id: 1, Deadline: now.Add(96 * time.Hour), Status: "belum"}, 
		{Id: 2, Deadline: now.Add(-time.Hour), Status: "belum"},     
		{Id: 3, Deadline: now.Add(5 * time.Hour), Status: "belum"},  
		{Id: 4, Deadline: now.Add(-2 * time.Hour), Status: "belum"}, 
		{Id: 5, Deadline: now.Add(time.Hour), Status: "belum"},      
		{Id: 6, Deadline: now.Add(time.Hour), Status: "selesai"},    
	}

	SortTugas(list, now)

	var ids []int
	for _, tg := range list {
		ids = append(ids, tg.Id)
	}

	want := []int{5, 3, 2, 4, 1, 6}
	if !slices.Equal(ids, want) {
		t.Errorf("order = %v, want %v", ids, want)
	}

	if list[0].DeadlineCategory != CategoriMendekati || list[2].DeadlineCategory != CategoriOverdue || list[5].DeadlineCategory != CategoriNormal {
		t.Errorf("deadline_category tidak terisi benar: %+v", list)
	}
}
