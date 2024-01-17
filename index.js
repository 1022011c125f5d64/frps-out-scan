const _req_node_path = require('node:path'),
    _req_node_fs = require('node:fs');

if (process.argv[2] === undefined) {
    throw new Error('file path not providered');
}
if (!_req_node_fs.existsSync(process.argv[2])) {
    throw new Error('file not found');
}

let _scannedResult = {},
    _scannedLines = 0;
const rs = _req_node_fs.createReadStream(process.argv[2]).on('data', (chunk) => {
    chunk.toString().match(/get a user connection \[(.+?)\]/g).forEach((v) => {
        const ipPortSplit = v.replace('get a user connection [', '').replace(']', '').split(':');
        if (_scannedResult[ipPortSplit[0]] === undefined) {
            _scannedResult[ipPortSplit[0]] = {
                times: 0,
                // ports: []
            };
        }
        _scannedResult[ipPortSplit[0]].times++;
        // if (_scannedResult[ipPortSplit[0]].ports.indexOf(ipPortSplit[1]) === -1) {
        //     _scannedResult[ipPortSplit[0]].ports.push(ipPortSplit[1]);
        // }
        _scannedLines++;
    });
}).on('end', () => {
    // _req_node_fs.writeFileSync('result.json', JSON.stringify(_scannedResult));
    console.log(`end: ${_scannedLines} lines scanned`);
    console.log(_scannedResult);
}).on('error', (err) => {
    console.error(`error: ${err}`);
});
