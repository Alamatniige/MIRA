package supabase

import (
	"os"

	supa "github.com/nedpals/supabase-go"
)

var Client *supa.Client
var AdminClient *supa.Client

func Init() {
	Client = supa.CreateClient(
		os.Getenv("SUPABASE_URL"),
		os.Getenv("SUPABASE_ANON_KEY"),
	)

	serviceRoleKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	if serviceRoleKey != "" {
		AdminClient = supa.CreateClient(
			os.Getenv("SUPABASE_URL"),
			serviceRoleKey,
		)
	}
}
