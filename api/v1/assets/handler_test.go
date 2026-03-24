package asset

import "testing"

func TestCanonicalizeAssetStatusForResponse(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{name: "canonical maintenance", input: "UNDER_MAINTENANCE", want: canonicalMaintenanceStatus},
		{name: "spaced maintenance", input: "Under Maintenance", want: canonicalMaintenanceStatus},
		{name: "single-word maintenance", input: "maintenance", want: canonicalMaintenanceStatus},
		{name: "non-maintenance preserved", input: "Active", want: "Active"},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := canonicalizeAssetStatusForResponse(test.input); got != test.want {
				t.Fatalf("canonicalizeAssetStatusForResponse(%q) = %q, want %q", test.input, got, test.want)
			}
		})
	}
}

func TestStatusMatchesFilter(t *testing.T) {
	tests := []struct {
		name        string
		assetStatus string
		filter      string
		want        bool
	}{
		{name: "maintenance alias exact", assetStatus: "maintenance", filter: "UNDER_MAINTENANCE", want: true},
		{name: "maintenance alias spaced", assetStatus: "Under Maintenance", filter: "maintenance", want: true},
		{name: "maintenance alias dashed", assetStatus: "under-maintenance", filter: "under maintenance", want: true},
		{name: "non-maintenance mismatch", assetStatus: "Active", filter: "UNDER_MAINTENANCE", want: false},
		{name: "exact normalized non-maintenance", assetStatus: "Brand New", filter: "brand-new", want: true},
		{name: "empty filter matches all", assetStatus: "Active", filter: " ", want: true},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := statusMatchesFilter(test.assetStatus, test.filter); got != test.want {
				t.Fatalf("statusMatchesFilter(%q, %q) = %v, want %v", test.assetStatus, test.filter, got, test.want)
			}
		})
	}
}