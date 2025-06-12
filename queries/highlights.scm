;;; Highlighting for MiniScript

;; Keywords

"new" @keyword

"return" @keyword.return

(break_statement) @keyword

(continue_statement) @keyword

(if_statement
[
  "if"
  "else"
  "then"
  "end if"
] @keyword.conditional)

(if_statement_shorthand
[
  "if"
  "else"
  "then"
] @keyword.conditional)

(elseif_statement
[
  "else if"
  "then"
  "end if"
] @keyword.conditional)

(else_statement
[
  "else"
  "end if"
] @keyword.conditional)

(for_statement
[
  "for"
  "in"
  "end for"
] @keyword.repeat)

(while_statement
[
  "while"
  "end while"
] @keyword.repeat)

(function_definition
[
  "function"
  "end function"
] @keyword.function)

;; Operators

[
 "and"
 "not"
 "or"
 "isa"
] @keyword.operator

[
  "+"
  "-"
  "*"
  "/"
  "%"
  "^"
  "@"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
] @operator

;; Punctuations

[
  ";"
  ":"
  ","
  "."
] @punctuation.delimiter

;; Brackets

[
 "("
 ")"
 "["
 "]"
 "{"
 "}"
] @punctuation.bracket

;; Variables

(identifier) @variable

((identifier) @variable.builtin
 (#eq? @variable.builtin "self"))

;; Constants

(identifier) @constant.builtin
  (#any-of? @constant.builtin
    "pi" "globals" "intrinsics" "locals")
(null) @constant.builtin

[
  (false)
  (true)
] @boolean

;; Maps

(dot_index_expression index: (identifier) @variable.member)

;; Functions

(parameters name: (identifier) @variable.parameter)

(assignment_statement
  (variable .
    [
      (identifier) @function
      (bracket_index_expression
        index: (identifier) @function)
      (dot_index_expression
        index: (identifier) @function)
    ])
  (function_definition))

(function_call
  name: [
    (identifier) @function.call
    (bracket_index_expression
      index: (identifier) @function.call)
    (dot_index_expression
      index: (identifier) @function.call)
  ])

(function_call
  (identifier) @function.builtin
  (#any-of? @function.builtin
    ;; built-in functions in Miniscript
    ; system
    "print" "refEquals" "stackTrace" "time" "wait" "yield"
    ; numeric
    "abs" "acos" "asin" "atan" "bitAnd" "bitOr" "bitXor"
    "ceil" "char" "cos" "floor" "log" "range" "round" "rnd"
    "sign" "sin" "sqrt" "str" "tan"
    ; string/list/map (combined unique entries)
    "code" "hasIndex" "indexes" "indexOf" "insert" "len"
    "lower" "remove" "upper" "val" "values" "slice" "split"
    "join" "pop" "pull" "push" "shuffle" "sort" "sum"
    "replace"))

;; (function_call
;;   (identifier) @function.builtin
;;   (#any-of? @function.builtin
;;     ;; built-in functions in Miniscript
;;     ; system
;;     "print" "refEquals" "stackTrace" "time" "wait" "yield"
;;     ; numeric
;;     "abs" "acos" "asin" "atan" "bitAnd" "bitOr" "bitXor"
;;     "ceil" "char" "cos" "floor" "log" "range" "round" "rnd"
;;     "sign" "sin" "sqrt" "str" "tan"
;;     ; string
;;     "code" "hasIndex" "indexes" "indexOf" "insert" "len"
;;     "lower" "remove" "upper" "val" "values" "slice" "split"
;;     ; list
;;     "hasIndex" "indexes" "indexOf" "insert" "join" "len" "pop"
;;     "pull" "push" "shuffle" "sort" "sum" "remove" "replace"
;;     "slice"
;;     ; map
;;     "hasIndex" "indexes" "indexOf" "len" "pop" "push" "remove"
;;     "replace" "shuffle" "sum" "values"))

;; Others

(comment) @comment

(number) @number

(string) @string

(escape_sequence) @string.escape
