const fs = require('fs');
const http = require('http');
const axios = require('axios');
const parse = require('node-html-parser').parse;

const URLPROVEEDORES = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const URLCLIENTES = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

async function proveedores (callback){
    let prom = await axios.get(URLPROVEEDORES);
    let info = prom.data;
    
    fs.readFile('index.html',(err, data) => {
        if(err){
            return err;
        }

        const file = parse(data.toString());
        const row = file.querySelector('.row');
        const table = row.querySelector('table');
        const tbody = table.querySelector('tbody');
        const thead = table.querySelector('thead');
        const title = thead.querySelector('#title');
        title.appendChild((parse('<h1>Listado de Proveedores</h1>')));

        let vendors = [];
        
        for (let i = 0; i < info.length; i++) {
            const element = info[i];
            let fila = '';
            fila += '<td>'+ element.idproveedor + '</td>';
            fila += '<td>'+ element.nombrecompania + '</td>';
            fila += '<td>'+ element.nombrecontacto + '</td>';
            vendors.push(parse('<tr>'+fila+'</tr>'));
        }
        tbody.set_content(vendors);

        callback(file.toString());
    });
}

async function clientes (callback){
    let prom = await axios.get(URLCLIENTES);
    let info = prom.data;
    
    fs.readFile('index.html',(err, data) => {
        if(err){
            return err;
        }

        const file = parse(data.toString());
        const row = file.querySelector('.row');
        const table = row.querySelector('table');
        const tbody = table.querySelector('tbody');
        const thead = table.querySelector('thead');
        const title = thead.querySelector('#title');
        title.appendChild((parse('<h1>Listado de Clientes</h1>')));
        

        let clients = [];
        
        for (let i = 0; i < info.length; i++) {
            const element = info[i];
            let fila = '';
            fila += '<td>'+ element.idCliente + '</td>';
            fila += '<td>'+ element.NombreCompania + '</td>';
            fila += '<td>'+ element.NombreContacto + '</td>';
            clients.push(parse('<tr>'+fila+'</tr>'));
        }
        tbody.set_content(clients);

        callback(file.toString());
    });
}


http.createServer(function (req, res) {
    
    if(req.url == '/api/proveedores'){
        proveedores((file) => {
            res.end(file);
        });
    }
    else if(req.url == '/api/clientes'){
        clientes((file) => {
            res.end(file);
        });
    }
    else{
        res.end('No existe');
    }
  
  }).listen(8081); 