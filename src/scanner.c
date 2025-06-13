#include "tree_sitter/parser.h"

enum TokenType
{
    TIGHT_UNARY_EXPRESSION_ALT
};

void *tree_sitter_miniscript_external_scanner_create() {
    return NULL;
}

void tree_sitter_miniscript_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_miniscript_external_scanner_serialize(void *payload, char *buffer) {
    return 0;
}

void tree_sitter_miniscript_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

bool tree_sitter_miniscript_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    if (!valid_symbols[TIGHT_UNARY_EXPRESSION_ALT]) return false;

    bool isThereSpaceInFront = false;
    // Skip any leading whitespace (not allowed for tight unary operators)
    while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
        lexer->advance(lexer, false);  // Consume the '+' or '-'
        isThereSpaceInFront = true;
    }
    if (!isThereSpaceInFront) return false;  // To make sure that systax like foo+1 get parse as binary

    // Check for '+' or '-'
    if (lexer->lookahead == '+' || lexer->lookahead == '-') {
        int op = lexer->lookahead;
        lexer->advance(lexer, false);  // Consume the '+' or '-'

        // Reject if what follows is whitespace
        if (lexer->lookahead == ' ' || lexer->lookahead == '\t' || lexer->lookahead == '\n' || lexer->lookahead == '\r')
        {
            return false;
        }

        // Otherwise, this is a valid unary operator with no space
        lexer->result_symbol = TIGHT_UNARY_EXPRESSION_ALT;
        return true;
    }

    return false;
}
