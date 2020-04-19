const path = require("path");
const fs = require('fs');
const tmpdir = require('os').tmpdir();
const child_process = require('child_process');

module.exports = {
  hooks: {
    "page:before": function(page) {
      const umls = page.content.match(/```lilypond\n(.|\n)*```/gim);
      if (umls instanceof Array) {
        for (var i = 0, len = umls.length; i < len; i++) {
          const tmpfile = path.join(tmpdir, Math.random().toString(16).substr(2));
          fs.writeFileSync(tmpfile, umls[i].replace(/```lilypond/i, '').replace(/```\s*$/i, ''));
          try {
            child_process.execSync(`cd ${tmpdir} && lilypond -dbackend=svg ${tmpfile}`);
          } catch (e) {
            page.content = page.content.replace(
              umls[i],
              '```\n' + e.message + '```\n',
            );
            fs.unlinkSync(tmpfile);
            continue;
          }
          const tmpsvg = tmpfile + '.svg';
          const lilypond_svg = fs.readFileSync(tmpsvg).toString();
          page.content = page.content.replace(
            umls[i],
            lilypond_svg,
          );
          fs.unlinkSync(tmpfile);
          fs.unlinkSync(tmpsvg);
        }
      }
      return page;
    }
  }
};
