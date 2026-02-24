package issues

import (
	"mira-api/middleware"
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("GET /issues", middleware.AuthMiddleware(GetIssues))
	http.HandleFunc("POST /issues/create", middleware.AuthMiddleware(CreateIssue))
	http.HandleFunc("PUT /issues/update/{id}", middleware.AuthMiddleware(UpdateIssue))
	http.HandleFunc("DELETE /issues/delete/{id}", middleware.AuthMiddleware(DeleteIssue))
	http.HandleFunc("GET /issues/asset/{assetId}", middleware.AuthMiddleware(GetIssueByAssetID))
}
