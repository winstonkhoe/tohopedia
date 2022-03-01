package helpers

import (
	"time"
)

func ParseTime(t *time.Time) {
	loc, _ := time.LoadLocation("Asia/Jakarta")
	*t = t.In(loc)
	// return t.In(loc)
}