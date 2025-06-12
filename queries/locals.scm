;; Scopes

[
  (block)
  (if_statement)
  (for_statement)
  (while_statement)
  (function_definition)
] @local.scope

;; Definitions

(assignment_statement
  (variable
    (identifier) @local.definition))

(for_statement variable: (identifier) @local.definition)

(parameters name: (identifier) @local.definition)

;; References

[
  (identifier)
] @local.reference
