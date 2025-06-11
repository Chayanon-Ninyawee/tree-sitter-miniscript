from unittest import TestCase

import tree_sitter
import tree_sitter_miniscript


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_miniscript.language())
        except Exception:
            self.fail("Error loading Miniscript grammar")
