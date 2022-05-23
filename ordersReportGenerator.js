// LPQ Orders by Product report generator. Run this script in the console of CrunchTime's Orders By Customers Consolidated Picklist page for an object table.
// Required: 6 columns sorted in this order: Product Number, Product Name, Issue Unit, Order Qty, Fill Qty, Storage Location

// get all td with html attribute data-qtip
function getTableValues(){
    let rows = document.querySelectorAll('td[data-qtip]')
    let items = [...rows].map(n => n.getAttribute("data-qtip"))
    return items
}
// get all customers who placed orders
function getCustomers(){
    let header = document.querySelectorAll('div.x-grid-group-title')
    let customers = [...header].map(n => n.innerText)
    return customers
}
// make an array of rows that contains array elements with comma separated values
function makeRows(){
    let newArr = []
    let row = []
    let j = 0
    let delimiter = ', '
    let items = getTableValues()
    let currentCustomer = getCustomers()[j]
    for(let i = 0; i < items.length; i++){
        if (items[i].startsWith('Subtotal') === true || items[i].startsWith('Totals') === true){
            j++
            currentCustomer = getCustomers()[j]
            i += 2
        } else {
            row = '00' + currentCustomer.trim().slice(10)
            if (row.charAt(2) !== '3'){
                row = '0' + row
            }
            row = row.concat(delimiter, items[i], delimiter, items[i+1], delimiter, items[i+2], delimiter, items[i+3], delimiter, items[i+4], delimiter, items[i+5])
            newArr.push(row)
            i += 5
        }
    }
    return newArr
}
// row constructor to convert array to object
class MakeRowObj{
    constructor(customer, productCode, productName, unit, orderQty, fillQty, storage){
        this.customer = customer
        this.productCode = productCode
        this.productName = productName
        this.unit = unit
        this.orderQty = Number(orderQty)
        this.fillQty = Number(fillQty)
        this.storage = storage
    }
}
// converts array to object
function makeObjArr(){
        let row = []
        let objArr = []
        let array = makeRows()
        for(let i = 0; i < array.length; i++){
            row = array[i].split(', ')
            obj = new MakeRowObj(row[0], row[1], row[2], row[3], row[4], row[5], row[6])
            objArr.push(obj)
        }
        return objArr
    }
// sort objects by productName and then by customer
function sortByProperty(){
    let objArr = makeObjArr()
    return objArr.sort((a, b) => (a.productName > b.productName) ? 1 : (a.productName === b.productName) ? ((a.customer > b.customer) ? 1 : -1) : -1 )
}
// get unique item names
function getUniqueItemNames(){
    let objArr = sortByProperty()
    let subtotal = []
    for(let i = 0; i < objArr.length; i++){
        subtotal.push(objArr[i].productName)
    }
    let uniqueSubtotalNames = [...new Set(subtotal)];
    return uniqueSubtotalNames
}
// sum subtotal of ordered items
function getItemsOrderedTotal(){
    let objArr = sortByProperty()
    let allItems = getUniqueItemNames()
    let sum = 0
    let arrayOfSums = []
    for(let j = 0; j < allItems.length; j++){
        for(let i = 0; i < objArr.length; i++){
            if (allItems[j] == objArr[i].productName){
                sum += objArr[i].orderQty
            }
        }
        arrayOfSums.push(sum)
        sum = 0
    }
    return arrayOfSums
}
// sum subtotal of filled items
function getItemsFilledTotal(){
    let objArr = sortByProperty()
    let allItems = getUniqueItemNames()
    let sum = 0
    let arrayOfSums = []
    for(let j = 0; j < allItems.length; j++){
        for(let i = 0; i < objArr.length; i++){
            if (allItems[j] == objArr[i].productName){
                sum += objArr[i].fillQty
            }
        }
        arrayOfSums.push(sum)
        sum = 0
    }
    return arrayOfSums
}
// create subtotals rows
function createSubtotalsRow(){
    let objArr = sortByProperty()
    let orderSum = getItemsOrderedTotal()
    let fillSum = getItemsFilledTotal()
    let j = 0
    let subtotal = {}
    // console.table(objArr)
    for(let i = 0; i < objArr.length - 1; i++){
        if (objArr[i].productName !== objArr[i+1].productName){
            subtotal = new MakeRowObj(null, objArr[i].productCode, `TOTAL: ${objArr[i].productName}`, objArr[i].unit, orderSum[j], fillSum[j], objArr[i].storage)
            objArr.splice(i+1, 0, subtotal)
            i++
            j++
        }
    }
    let lastSubtotal = new MakeRowObj(null, objArr[objArr.length - 1].productCode, `TOTAL: ${objArr[objArr.length - 1].productName}`, objArr[objArr.length - 1].unit, orderSum[j], fillSum[j], objArr[objArr.length - 1].storage)
    objArr.splice(objArr.length, 0, lastSubtotal)
    console.table(objArr)
    // return objArr
}
createSubtotalsRow()
// // inserts a div before the end of the DOM body tag
// function insertContainerInDom(){
//     document.querySelector('body').insertAdjacentHTML('beforeEnd', '<div id="ordersbyproduct-container"></div>')
// }
// // creates an HTML table in DOM
// function createHTMLtable(){
//     let rows = createSubtotalsRow()
//     let html = '<table>'
//     html += '<tr>'
//     for(let j in rows[0]) {
//         html += '<th>' + j + '</th>'
//     }
//     html += '</tr>'
//     for(let i = 0; i < rows.length; i++) {
//         html += '<tr>'
//         for(let j in rows[i]) {
//             if(rows[i].customer === null){
//                 html += '<th>' + rows[i][j] + '</th>'
//             } else {
//                 html += '<td>' + rows[i][j] + '</td>'
//             }        
//         }
//         html += '</tr>'
//     }
//     html += '</table>'
//     document.getElementById('ordersbyproduct-container').innerHTML = html
// }
// function generateTableInDOM(){
//     insertContainerInDom()
//     createHTMLtable()
// }
// document.querySelector('#button-1227').addEventListener('click', generateTableInDOM())