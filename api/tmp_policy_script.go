package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "postgresql://postgres.efdhhuibnmebekqkjjom:Demon-Vape123@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sql := `
	-- 1. Create the bucket and make it PUBLIC
	INSERT INTO storage.buckets (id, name, public)
	VALUES ('asset', 'asset', true)
	ON CONFLICT (id) DO UPDATE SET public = true;

	-- 2. Allow public read access to all images
	CREATE POLICY "Public Image Access"
	ON storage.objects FOR SELECT
	USING ( bucket_id = 'asset' );

	-- 3. Allow anonymous/API uploads
	CREATE POLICY "API Upload Access"
	ON storage.objects FOR INSERT
	WITH CHECK ( bucket_id = 'asset' );
	`

	if err := db.Exec(sql).Error; err != nil {
		// It's possible the policies already exist
		fmt.Printf("Error applying SQL (maybe policies already exist): %v\n", err)
	} else {
		fmt.Println("Successfully applied Supabase Storage policies!")
	}
}
