/* DATA STRUCTURE TO EACH TREE NODE */
class Node {
    constructor(char, weight, left, right) {
        this.char = char;
        this.weight = weight;
        this.left = left;
        this.right = right;
    }
}

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

/* SORTED FREQUENCY */
const sortfreq = (str) => {
    let dict = {};
    let freqs = [];
    for (var i in str) {
        if (str[i] in dict) dict[str[i]] += 1;
        else dict[str[i]] = 1;
    }
    for (var key in dict) {
        freqs.push([key, dict[key]]);
    }
    return freqs.sort((a,b) => (b[1] - a[1]));
}

/* MAKE TREE NODES */
const makenodes = (freqs) => {
    let nodes = [];
    for (let i = 0; i < freqs.length; i++) {
        nodes.push(new Node(freqs[i][0], freqs[i][1]));
    }
    return nodes;
}

/* BUILD A TREE NODE */
const makenode = (left, right) => {
    return new Node(left.char + right.char, left.weight + right.weight, left, right);
}

/* BUILD A CODE TREE */
const buildtree = (nodes) => {
    while (nodes.length > 1) {
        nodes.push(makenode(nodes.pop(), nodes.pop()));
        nodes.sort((a,b) => (b.weight - a.weight));
    }

    return nodes;
}

/* ASSIGN TABLE CODES */
const assigncodes = (node, pat, codes = {}) => {
    pat = pat || '';
    if (typeof node == typeof '') {
        codes[node] = pat;
    }
    else {
        codes = assigncodes(node[0], pat + "0", codes);
        codes = assigncodes(node[1], pat + "1", codes);
    }
    return codes;
}

/* ENCODE EACH CHARACTER */
const encodeeach = (s, tree) => {
    var encoded =[], curr_branch = tree[0];
    while (curr_branch.left && curr_branch.right){
        if((curr_branch.left.char).indexOf(s) != -1){
            encoded.push(0);
            curr_branch = curr_branch.left;
        }
        else if((curr_branch.right.char).indexOf(s) != -1){
            encoded.push(1);
            curr_branch =  curr_branch.right;
        }
    }
    return encoded;
}

/* ENCODE A GIVEN INPUT INTO A CODE */
const encode = (str) => {
    let encoded = [];
    for (var c in str)
        encoded = encoded.concat(encodeeach(str[c]));
    return encoded;
}

/* DECODE EACH CHARACTER OF A STRING OF BYTES */
const decodeeach = (tree, bits) => {
    if((tree.left && tree.right) && bits.length != 0){
        if (bits[0] == 1) {
                bits.shift();
                return decodeeach(tree.right, bits);
        }
        else {
                bits.shift();
                return decodeeach(tree.left, bits);
        }
    }
    else if(!tree.left && !tree.right)
        return tree.char;
}

/* DECODE A STRING OF BYTES */
const decode = (bits, tree) => {
    var decoded = [];
    while(bits.length != 0)
        decoded.push(decodeeach(tree[0], bits));
    return decoded.join('');
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

/* RESET TO EMPTY STATE */
const reset = () => {
    const table = document.getElementById('codetable');
    // Reset table
    table.innerHTML = '';

    // Reset decompress input
    document.getElementById("decompress").value = '';

    // Reset decompress output
    document.getElementById("output").innerHTML = '';
}

/* ======================= GLOBAL VARIABLES ======================== */
let tree;
/* ================================================================= */

/* COMPRESS A TEXT STRING */
const compress = () => {
    const input = document.getElementById("compress")?.value;

    // Disable decompression if there is no input
    const decompress = document.getElementById("decompress");
    decompress.disabled = !input?.length;

    // Reset table draw
    reset();
    
    // Input is empty
    if (!input?.length) {
        return;
    }

    // Calculate character frequency
    let sorted = sortfreq(input);
    // Build a huffman code tree using sorted frequencies
    tree = buildtree(makenodes(sorted));

    const table = [
        ['Caractere', 'Frequência', '%', 'Código'],
        ...sorted
            .map((([key, value]) => [key, `${ value }x`, `${ (((value / input.length)) * 100).toFixed(2) }%`, encodeeach(key, tree).join('')]))
            .sort((a, b) => a[1] < b[1] ? 1 : -1)
    ];
    draw(table);
}

/* DECOMPRESS A TEXT STRING USING THE CURRENT TREE */
const decompress = () => {
    const output = document.getElementById("output");
    const code = document.getElementById("decompress")?.value;

    // Code doesn't match to only binary string
    if (code.match(/[^0-1]/g)) {
        return;
    }

    output.innerHTML = decode(code.split(''), tree);
}
