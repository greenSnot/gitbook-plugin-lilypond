var path = require("path");
var tester = require("gitbook-tester");
var assert = require("assert");

var pkg = require("../package.json");

describe("lilypond", function() {
  it("single", function() {
    return tester
      .builder()
      .withContent(
        "before ```lilypond\n" +
          `
       \\new Staff <<
         {c''2}
         \\\\
         {e'2}
         \\\\
         {c'8}
         \\\\
         {d'8}
         \\\\
         {<e'>8}
         \\\\
         {b''8}
         \\\\
         {g'8}
         \\\\
         {f'8}
         \\\\
         {a'''8}
       >>
          ` +
          "``` after"
      )
      .withLocalPlugin(path.join(__dirname, ".."))
      .withBookJson({
        gitbook: pkg.engines.gitbook,
        plugins: ["lilypond"]
      })
      .create()
      .then(function(result) {
        console.log(result[0].content);
        assert.equal(result[0].content.length > 1000, true);
      });
  });
});
