const { indent, softline, group, concat, line, hardline } = require("prettier").doc.builders;

function print(path, options, print) {
    const node = path.getValue();
    const expression = path.call(print, "expression", 0);
    const ifBodies = path.map(print, "embedded_statement");
    const hasElse = ifBodies.length > 1;
    const ifHasBraces = !!node["embedded_statement"][0]["block"];
    const emptyIfBraces = ifHasBraces && ifBodies[0].parts.length === 2;
    const elseHasBraces = hasElse && !!node["embedded_statement"][1]["block"];
    const emptyElseBraces = elseHasBraces && ifBodies[1].parts.length === 2;
    const hasElseIf = hasElse && !!node["embedded_statement"][1]["if_statement"];

    const docs = ["if", " ", "(", group(concat([indent(group(concat([softline, expression]))), softline])), ")"];

    if (ifHasBraces) {
        if (emptyIfBraces) {
            docs.push(" ", ifBodies[0]);
        } else {
            docs.push(hardline, ifBodies[0]);
        }
    } else {
        docs.push(indent(group(concat([hasElse ? hardline : line, ifBodies[0]]))));
    }

    if (hasElse) {
        docs.push(hardline, "else");

        if (elseHasBraces) {
            if (emptyElseBraces) {
                docs.push(" ", ifBodies[1]);
            } else {
                docs.push(hardline, ifBodies[1]);
            }
        } else if (hasElseIf) {
            docs.push(" ", ifBodies[1]);
        } else {
            docs.push(indent(group(concat([hardline, ifBodies[1]]))));
        }
    }

    return group(concat(docs));
}

module.exports = print;