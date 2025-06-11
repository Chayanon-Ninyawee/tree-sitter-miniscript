// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterMiniscript",
    products: [
        .library(name: "TreeSitterMiniscript", targets: ["TreeSitterMiniscript"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterMiniscript",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterMiniscriptTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterMiniscript",
            ],
            path: "bindings/swift/TreeSitterMiniscriptTests"
        )
    ],
    cLanguageStandard: .c11
)
