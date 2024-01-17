const _req_node_path = require('node:path'),
    _req_node_fs = require('node:fs');

if (process.argv[2] === undefined) {
    throw new Error('file path not providered');
}
if (!_req_node_fs.existsSync(process.argv[2])) {
    throw new Error('file not found');
}
const bannedThreshold = process.argv[3] === undefined ? 1000 : parseInt(process.argv[3]);

let _scannedResult = {},
    _scannedLines = 0,
    _bannedIps = [];
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
        if (_scannedResult[ipPortSplit[0]].times >= bannedThreshold && _bannedIps.indexOf(ipPortSplit[0]) === -1) {
            _bannedIps.push(ipPortSplit[0]);
        }
        _scannedLines++;
    });
}).on('end', () => {
    // _req_node_fs.writeFileSync('result.json', JSON.stringify(_scannedResult));
    console.log(`end: ${_scannedLines} lines scanned`);
    console.log(_scannedResult);
    console.log(_bannedIps.join(','));
}).on('error', (err) => {
    console.error(`error: ${err}`);
});
