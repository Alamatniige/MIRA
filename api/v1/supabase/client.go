package supabase

import (
	"os"

	supa "github.com/nedpals/supabase-go"
)

var Client *supa.Client

func Init() {
	Client = supa.CreateClient(
		os.Getenv("SUPABASE_URL"),
		os.Getenv("SUPABASE_ANON_KEY"),
	)
}
