import XCTest
import SwiftTreeSitter
import TreeSitterMiniscript

final class TreeSitterMiniscriptTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_miniscript())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Miniscript grammar")
    }
}
