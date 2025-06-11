;;; Highlighting for MiniScript
;;; TODO: Fix Highlighting

;;; Keywords

["if" "then" "else" "end if"] @keyword.conditional
["while" "end while"] @keyword.repeat
["for" "in" "end for"] @keyword.repeat
[(break_statement) (continue_statement)] @keyword.repeat
["return"] @keyword.return
["function" "end function"] @keyword.function
["not" "and" "or" "isa"] @keyword.operator
["new"] @keyword

;;; Operators

[
  "="
  "+="
  "-="
  "*="
  "/="
  "^="
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "+"
  "-"
  "*"
  "/"
  "%"
  "^"
] @operator

;;; Punctuation

["," "."] @punctuation.delimiter
["(" ")" "[" "]" "{" "}"] @punctuation.bracket

;;; Variables

(identifier) @variable
(
  (identifier) @variable.builtin
  (#match? @variable.builtin "self")
)

;;; Constants

(null) @constant.builtin
[(false) (true)] @boolean
(number) @number

;;; Strings

(string) @string

;;; Function calls

(function_call
  name: (identifier) @function.call
  arguments: (arguments)?)

;;; Function definitions

(parameters) @parameter

;;; Comments

(comment) @comment

;;; Errors

(ERROR) @error

