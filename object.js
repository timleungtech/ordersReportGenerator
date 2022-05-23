// put array of objects in rows
let rows = [{},{},{}...]
function createHTMLtable(){
    let html = '<table>'
    html += '<tr>'
    for(let j in rows[0]) {
        html += '<th>' + j + '</th>'
    }
    html += '</tr>'
    for(let i = 0; i < rows.length; i++) {
        html += '<tr>'
        for(let j in rows[i]) {
            if(rows[i].customer === null){
                html += '<th>' + rows[i][j] + '</th>'
            } else {
                html += '<td>' + rows[i][j] + '</td>'
            }        
        }
        html += '</tr>'
    }
    html += '</table>'
    document.getElementById('ordersbyproduct-container').innerHTML = html
}
function insertContainerInDom(){
    document.querySelector('body').insertAdjacentHTML("beforeEnd", '<div id="ordersbyproduct-container"></div>')
}
insertContainerInDom()
createHTMLtable()