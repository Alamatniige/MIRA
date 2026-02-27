package issues

import (
	"mira-api/middleware"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/issues", middleware.AuthMiddleware(GetIssues)).Methods("GET")
	r.HandleFunc("/issues/create", middleware.AuthMiddleware(CreateIssue)).Methods("POST")
	r.HandleFunc("/issues/update/{id}", middleware.AuthMiddleware(UpdateIssue)).Methods("PUT")
	r.HandleFunc("/issues/delete/{id}", middleware.AuthMiddleware(DeleteIssue)).Methods("DELETE")
	r.HandleFunc("/issues/asset/{assetId}", middleware.AuthMiddleware(GetIssueByAssetID)).Methods("GET")
}
