package asset

import "testing"

func TestCanonicalizeCurrentStatus(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{name: "canonical maintenance underscore", input: "UNDER_MAINTENANCE", want: "Under Maintenance"},
		{name: "spaced maintenance", input: "Under Maintenance", want: "Under Maintenance"},
		{name: "single-word maintenance", input: "maintenance", want: "Under Maintenance"},
		{name: "good", input: "good", want: "Good"},
		{name: "available maps to good", input: "available", want: "Good"},
		{name: "under review", input: "under review", want: "Under Review"},
		{name: "non-canonical preserved", input: "Active", want: "Active"},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := canonicalizeCurrentStatus(test.input); got != test.want {
				t.Fatalf("canonicalizeCurrentStatus(%q) = %q, want %q", test.input, got, test.want)
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
		{name: "exact normalized match", assetStatus: "Under Maintenance", filter: "under maintenance", want: true},
		{name: "dashed normalized match", assetStatus: "under-maintenance", filter: "under maintenance", want: true},
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