/**
 * @file Miniscript grammar for tree-sitter
 * @author Garfieldcmix <chayanon.nin@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  OR: 3, // => or
  AND: 4, // => and
  COMPARE: 5, // => < <= == ~= >= >
  CONCAT: 6, // => ..
  PLUS: 7, // => + -
  MULTI: 8, // => * /             // %
  UNARY: 9, // => not # - ~
  POWER: 10, // => ^
};

const list_seq = (rule, separator, trailing_separator = false) =>
  trailing_separator
    ? seq(rule, repeat(seq(separator, rule)), optional(separator))
    : seq(rule, repeat(seq(separator, rule)));

module.exports = grammar({
  name: "miniscript",

  extras: ($) => [$.comment, " ", /\t/, /\r/, /\f/],

  inline: ($) => [$.iprefix_expression],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._statement),

    block: ($) => repeat1($._statement),

    _statement: ($) =>
      choice(
        $._expression_statement,
        $.assignment_statement,
        $._control_flow_statement,
        $._empty_statement,
      ),

    _empty_statement: (_) => choice(/\n/, /;\n/),

    _terminator: (_) => choice(/\n/, ";"),

    // NOTE: Expression Statement
    // x + y | func() | object.func()
    _expression_statement: ($) =>
      seq(alias($.expression, $.expression_statement), $._terminator),

    // NOTE: Assignment Statement
    // x = 1 | x = function() ... function end
    assignment_statement: ($) =>
      seq(
        field("left", $._assignable_expression),
        field("operator", choice("=", "+=", "-=", "*=", "/=", "%=", "^=")),
        field("right", choice($.expression, $.function_definition)),
        $._terminator,
      ),
    _assignable_expression: ($) =>
      choice(
        $.identifier,
        $.bracket_index_expression,
        $.dot_index_expression,
        $.parenthesized_expression,
      ),

    // NOTE: Function Definition
    function_definition: ($) =>
      seq(
        token("function"),
        field("parameters", optional($.parameters)),
        $._terminator,
        optional($.block),
        token("end function"),
      ),
    parameters: ($) => seq("(", optional($._parameter_list), ")"),
    _parameter_list: ($) =>
      prec(
        2,
        list_seq(
          choice(
            field("name", $.identifier),
            seq(field("name", $.identifier), "=", field("default", $.literal)),
          ),
          ",",
        ),
      ),

    // NOTE: Control Flow Statement
    // if_statement | loop_statement | jump_statement
    _control_flow_statement: ($) =>
      seq(
        choice(
          // $.if_statement_shorthand,
          $.if_statement,
          $._jump_statement,
        ),
        $._terminator,
      ),

    // NOTE: Expression and Stuff
    expression: ($) =>
      choice(
        $.identifier,
        $.literal,
        $.slice_expression,
        $.bracket_index_expression,
        $.dot_index_expression,
        $.function_call,
        $.parenthesized_expression,
        $.list_constructor,
        $.map_constructor,
        $.binary_expression,
        $.unary_expression,
      ),

    iprefix_expression: ($) =>
      choice(
        $.identifier,
        $.literal,
        $.slice_expression,
        $.bracket_index_expression,
        $.dot_index_expression,
        $.function_call,
        $.parenthesized_expression,
        $.list_constructor,
        $.map_constructor,
      ),

    slice_expression: ($) =>
      seq(
        field("map", $.iprefix_expression),
        "[",
        field("start", optional($.expression)),
        ":",
        field("end", optional($.expression)),
        "]",
      ),
    bracket_index_expression: ($) =>
      seq(
        field("map", $.iprefix_expression),
        "[",
        field("index", $.expression),
        "]",
      ),
    dot_index_expression: ($) =>
      seq(
        field("map", $.iprefix_expression),
        ".",
        field("index", $.identifier),
      ),

    // NOTE: Only active when function have arg. e.g. foo() not foo
    function_call: ($) =>
      seq(field("name", $.iprefix_expression), field("arguments", $.arguments)),
    arguments: ($) => seq("(", optional(list_seq($.expression, ",")), ")"),

    parenthesized_expression: ($) => seq("(", $.expression, ")"),

    list_constructor: ($) =>
      seq("[", repeat($._terminator), optional($._expression_list), "]"),
    _expression_list: ($) =>
      list_seq(
        $.expression,
        seq(repeat($._terminator), ",", repeat($._terminator)),
        true,
      ),

    map_constructor: ($) =>
      seq("{", repeat($._terminator), optional($._pair_list), "}"),
    _pair_list: ($) =>
      list_seq(
        $.pair,
        seq(repeat($._terminator), ",", repeat($._terminator)),
        true,
      ),
    pair: ($) =>
      seq(
        field("key", $.expression),
        ":",
        repeat($._terminator),
        field("value", $.expression),
      ),

    binary_expression: ($) =>
      choice(
        ...[
          ["or", PREC.OR],
          ["and", PREC.AND],
          ["isa", PREC.AND],
          ["<", PREC.COMPARE],
          ["<=", PREC.COMPARE],
          ["==", PREC.COMPARE],
          ["!=", PREC.COMPARE],
          [">=", PREC.COMPARE],
          [">", PREC.COMPARE],
          ["+", PREC.PLUS],
          ["-", PREC.PLUS],
          ["*", PREC.MULTI],
          ["/", PREC.MULTI],
          ["%", PREC.MULTI],
        ].map(([operator, precedence]) =>
          prec.left(
            precedence,
            seq(
              field("left", $.expression),
              field("operator", String(operator)),
              field("right", $.expression),
            ),
          ),
        ),
        ...[["^", PREC.POWER]].map(([operator, precedence]) =>
          prec.right(
            precedence,
            seq(
              field("left", $.expression),
              field("operator", String(operator)),
              field("right", $.expression),
            ),
          ),
        ),
      ),

    unary_expression: ($) =>
      prec.left(
        PREC.UNARY,
        seq(
          field("operator", choice("-", "+", "@", "not", "new")),
          field("operand", $.expression),
        ),
      ),

    // NOTE: Stuff for Control Flow Statement
    // if_statement_shorthand: ($) =>
    //   prec(
    //     1,
    //     choice(
    //       seq(
    //         "if",
    //         field("condition", $.expression),
    //         "then",
    //         field("consequence", if_shorthand_body($)),
    //       ),
    //       seq(
    //         "if",
    //         field("condition", $.expression),
    //         "then",
    //         field("consequence", if_shorthand_body($)),
    //         "else",
    //         field("alternative", if_shorthand_body($)),
    //       ),
    //     ),
    //   ),
    if_statement: ($) =>
      seq(
        "if",
        field("condition", $.expression),
        "then",
        $._terminator,
        optional($.block),
        repeat(field("alternative", $.elseif_statement)),
        optional(field("alternative", $.else_statement)),
        token("end if"),
      ),
    elseif_statement: ($) =>
      seq(
        token("else if"),
        field("condition", $.expression),
        "then",
        $._terminator,
        optional($.block),
      ),
    else_statement: ($) => seq("else", $._terminator, optional($.block)),

    _jump_statement: ($) =>
      choice($.return_statement, $.break_statement, $.continue_statement),

    return_statement: ($) =>
      prec.left(0, seq("return", optional($.expression))),

    break_statement: (_) => "break",

    continue_statement: (_) => "continue",

    // NOTE: Identifier, Literals, etc.
    identifier: (_) => {
      const identifier_start =
        /[^\p{Control}\s+\-*/%@^#&~|<>=(){}\[\];:,.\\'"\d]/u;
      const identifier_continue =
        /[^\p{Control}\s+\-*/%@^#&~|<>=(){}\[\];:,.\\'"]*/u;
      return token(seq(identifier_start, identifier_continue));
    },

    comment: ($) =>
      seq(
        field("start", alias("//", "comment_start")),
        field("content", alias(/[^\r\n]*/, "comment_content")),
      ),

    literal: ($) => choice($.null, $.false, $.true, $.number, $.string),

    null: (_) => "null",
    false: (_) => "false",
    true: (_) => "true",

    number: ($) => {
      const decimal_digits = /[0-9]+/;
      const signed_integer = seq(optional(choice("-", "+")), decimal_digits);
      const decimal_exponent_part = seq(choice("e", "E"), signed_integer);

      const decimal_integer_literal = choice(
        "0",
        seq(optional("0"), /[1-9]/, optional(decimal_digits)),
      );

      const decimal_literal = choice(
        seq(
          decimal_integer_literal,
          ".",
          optional(decimal_digits),
          optional(decimal_exponent_part),
        ),
        seq(".", decimal_digits, optional(decimal_exponent_part)),
        seq(decimal_integer_literal, optional(decimal_exponent_part)),
      );

      return token(decimal_literal);
    },

    string: ($) =>
      choice(
        seq(
          field("start", alias('"', "string_start")),
          field("content", optional($.string_content)),
          field("end", alias('"', "string_end")),
        ),
      ),
    string_content: ($) =>
      repeat1(choice(token.immediate(/[^"]+/), $.escape_sequence)),
    escape_sequence: () => token.immediate('""'),
  },
});
