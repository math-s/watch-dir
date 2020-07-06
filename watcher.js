const path = require('path');
const fs = require('fs');
const colors = require('colors');
const dirTree = require("directory-tree");
var directoryPath = path.join(__dirname, '../template');
var tree = dirTree(directoryPath, { exclude: [/node_modules/,/.git/] });


function printTree /*:: <T>*/(initialTree /*: T*/, printNode /*: PrintNode<T>*/, getChildren /*: GetChildren<T>*/) {
  function printBranch(tree, branch) {
    const isGraphHead = branch.length === 0;
    const children = getChildren(tree) || [];

    let branchHead = '';

    if (!isGraphHead) {
      branchHead = children && children.length !== 0 ? '┬ ' : '─ ';
    }

    const toPrint = printNode(tree, `${branch}${branchHead}`);

    if (typeof toPrint === 'string') {
        if(toPrint == 'LICENSE' || toPrint == 'README.md'){console.log(`${branch.blue}${branchHead.blue}${toPrint.gray}`);}
        else if(children.length != '0'){console.log(`${branch.blue}${branchHead.blue}${toPrint.blue}`);}
        else if(toPrint.slice(-3) == '.js' || toPrint.slice(-5) == '.json'){console.log(`${branch.blue}${branchHead.blue}${toPrint.yellow}`);}
        else {console.log(`${branch.blue}${branchHead.blue}${toPrint}`);}
    }

    let baseBranch = branch;

    if (!isGraphHead) {
      const isChildOfLastBranch = branch.slice(-2) === '└─';
      baseBranch = branch.slice(0, -2) + (isChildOfLastBranch ? '  ' : '│ ');
    }

    const nextBranch = baseBranch + '├─';
    const lastBranch = baseBranch + '└─';

    children.forEach((child, index) => {
      printBranch(child, children.length - 1 === index ? lastBranch : nextBranch);
    });
  }

  printBranch(initialTree, '');
}




function printDir(tree){
    printTree(
    tree,
    node => node.name,
    node => node.children
    )
    recursiveWatch(directoryPath);
}
console.clear();

printDir(tree)

fs.watch(directoryPath, (eventType, filename) => { 
    if(eventType == 'change' || eventType == 'rename'){
        console.clear();
        var tree = dirTree(directoryPath, { exclude: [/node_modules/,/.git/] });

        printDir(tree);
    };
});

function recursiveWatch(dirname){
    fs.readdir(dirname, (err, files)=>{
        files.forEach((file) => {
            if(fs.lstatSync(path.join(dirname, file)).isDirectory()){
                fs.watch(path.join(dirname, file), (eventType, filename) => {
                    if(eventType == 'change' || eventType == 'rename'){
                        console.clear();
                        var tree = dirTree(directoryPath, { exclude: [/node_modules/,/.git/] });

                        printDir(tree);
                    };
                });
                recursiveWatch(path.join(dirname, file));          
            }
        });
    });
}

recursiveWatch(directoryPath);



