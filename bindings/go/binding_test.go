package tree_sitter_miniscript_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_miniscript "github.com/chayanon-ninyawee/tree-sitter-miniscript/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_miniscript.Language())
	if language == nil {
		t.Errorf("Error loading Miniscript grammar")
	}
}
