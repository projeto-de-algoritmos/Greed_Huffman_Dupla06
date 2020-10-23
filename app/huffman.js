/* CALCULATE FREQUENCY OF EACH CHARACTER ON A GIVEN STRING */
const frequency = (str) => {
    var freqs = {};
    for (var i in str) {
        if (freqs[str[i]] == undefined) {
            freqs[str[i]] = 1;
        }
        else {
            freqs[str[i]] = freqs[str[i]] + 1
        }
    }
    return (freqs);
}

/* SORT FREQUENCY */
const sortfreq = (freqs) => {
    var tuples = [];
    for (var keys in freqs) {
        tuples.push([freqs[keys], keys]);
    }
    return tuples.sort();
}

/* BUILD A CODE TREE */
const buildtree = (tuples) => {
    while (tuples.length > 1) {
        var leasttwo = [tuples[0][1], tuples[1][1]];
        var rest = tuples.slice(2, tuples.length);
        var combfreq = tuples[0][0] + tuples[1][0];
        tuples = rest;
        ext = [combfreq, leasttwo];
        tuples.push(ext);
        tuples.sort();
    }
    return tuples[0][1];
}

/* ASSIGN TABLE CODES */
const assigncodes = (node, pat, codes = {}) => {
    pat = pat || "";
    if (typeof node == typeof "") {
        codes[node] = pat;
    }
    else {
        codes = assigncodes(node[0], pat + "0", codes);
        codes = assigncodes(node[1], pat + "1", codes);
    }
    return codes;
}

/* ENCODE A GIVEN INPUT INTO A CODE */
const encode = (str) => {
    var output = "";
    for (var ch in str) {
        output = output + codes[str[ch]];
    }
    return output;
}

/* DECODE A GIVEN OUTPUT USING A CODE TREE */
const decode = (tree, str) => {
    output = "";
    p = tree;
    for (var bit in str) {
        if (str[bit] == 0) {
            p = p[0];
        }
        else {
            p = p[1];
        }
        if (typeof p == typeof "") {
            output = output + p;
            p = tree;
        }
    }
    return output;
}

/* DRAW A HTML TABLE USING A MATRIX */
const draw = (data) => {
    const table = document.getElementById('codetable');
    // Reset table
    table.innerHTML = '';

    // Draw a HTML table
    data.forEach((items, index) => {
        const row = document.createElement('tr');
        items.forEach(item => {
            const column = document.createElement(index > 0 ? 'td' : 'th');
            column.innerHTML = item;
            row.appendChild(column);
        });
        table.appendChild(row);
    })
}

/* COMPRESS A TEXT STRING */
const compress = () => {
    const input = document.getElementById("compress")?.value;
    
    // Input is empty
    if (!input?.length) {
        return;
    }

    let freq = frequency(input);
    let tree = buildtree(sortfreq(freq));
    let codes = assigncodes(tree);

    const table = [
        ['Caractere', 'Frequência', '%', 'Código'],
        ...Object.entries(codes)
            .map((([key, value]) => [key, freq[key], `${ (freq[key] / input.length).toFixed(2) }%`, value]))
            .sort((a, b) => a[1] < b[1] ? 1 : -1)
    ];
    draw(table);
}
