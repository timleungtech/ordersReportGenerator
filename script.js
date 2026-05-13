// LPQ Orders by Product report generator. Run this script in the console of CrunchTime's Orders By Customers Consolidated Picklist page for an object table.
// Required: 
//  - Group By Customers
//  - 6 columns sorted in this order: Product Number, Product Name, Issue Unit, Order Qty, Fill Qty, Storage Location

// get all td with html attribute data-qtip
function getTableValues(){
    let rows = document.querySelectorAll('td[data-qtip]')
    let items = [...rows].map(x => x.getAttribute("data-qtip"))
    return items
}
// get all customers who placed orders
function getCustomers(){
    let header = document.querySelectorAll('div.x-grid-group-title')
    let customers = [...header].map(x => x.innerText.trim().slice(10))
    // let sixDigitCustomers = customers.map(x => x.charAt(0) == '3' ? '00' + x : '000' + x)
    return customers
}
// make an array of rows that contains array elements with comma separated values
function makeRows(){
    let arrayOfRows = []
    let row = []
    let items = tableValues
    let j = 0
    let currentCustomer = customers[j]
    for (let i = 0; i < items.length; i++){
        if (items[i].startsWith('Subtotal') === true || items[i].startsWith('Totals') === true){
            j++
            currentCustomer = customers[j]
            i += 2
        } else {
            row = currentCustomer.concat(delimiter, items[i], delimiter, items[i+1], delimiter, items[i+2], delimiter, items[i+3], delimiter, items[i+4], delimiter, items[i+5])
            arrayOfRows.push(row)
            i += 5
        }
    }
    return arrayOfRows
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
function makeArrayOfObjects(){
    let row = []
    let arrayOfObjects = []
    for (let i = 0; i < rows.length; i++){
        row = rows[i].split(delimiter)
        let obj = new MakeRowObj(row[0], row[1], row[2], row[3], row[4], row[5], row[6])
        arrayOfObjects.push(obj)
    }
    return arrayOfObjects
}
// sort objects by productName and then by customer
function sortByProperty(data){
    let primary = 'productName'
    let secondary = 'customer'
    return data.sort((a, b) => (a[primary] > b[primary]) ? 1 : (a[primary] === b[primary]) ? ((a[secondary] > b[secondary]) ? 1 : -1) : -1 )
}
// get unique item names
function getUniqueProductNames(){
    let subtotalProductNames = []
    for (let i = 0; i < data.length; i++){
        subtotalProductNames.push(data[i].productName)
    }
    let uniqueSubtotalNames = [...new Set(subtotalProductNames)];
    return uniqueSubtotalNames
}
// sum items subtotal. params: "orderQty", "fillQty"
function getItemsSubtotalList(qtyType){
    let sum = 0
    let arrayOfSums = []
    for (let j = 0; j < uniqueProductNames.length; j++){
        for (let i = 0; i < data.length; i++){
            if (uniqueProductNames[j] == data[i].productName){
                sum += data[i][qtyType]
            }
        }
        arrayOfSums.push(sum)
        sum = 0
    }
    return arrayOfSums
}
// create subtotals rows
function createSubtotalsRow(){
    let itemsIndex = 0
    let subtotal = {}
    for (let i = 0; i < data.length - 1; i++){
        if (data[i].productName !== data[i+1].productName){
            subtotal = new MakeRowObj(null, data[i].productCode, `TOTAL: ${data[i].productName}`, data[i].unit, orderedSums[itemsIndex], filledSums[itemsIndex], data[i].storage)
            data.splice(i+1, 0, subtotal)
            i++
            itemsIndex++
        }
    }
    let lastSubtotal = new MakeRowObj(null, data[data.length - 1].productCode, `TOTAL: ${data[data.length - 1].productName}`, data[data.length - 1].unit, orderedSums[itemsIndex], filledSums[itemsIndex], data[data.length - 1].storage)
    data.splice(data.length, 0, lastSubtotal)    
    return data
}
function countStoresContainingItem (item){
  let stores = 0
  for (let i = 0; i < data.length; i++){
    if (data[i].productName == item && data[i].customer !== null){
      stores++
    }
  }
  return stores
}

let delimiter = '**'
let tableValues = getTableValues()
let customers = getCustomers()
let rows = makeRows()
let data = sortByProperty(makeArrayOfObjects())

let uniqueProductNames = getUniqueProductNames()
let orderedSums = getItemsSubtotalList('orderQty')
let filledSums = getItemsSubtotalList('fillQty')

let dataWithSubtotals = createSubtotalsRow(data)
console.table(dataWithSubtotals)

// sum all subtotals
console.log(`Ordered: ${getItemsSubtotalList('orderQty').reduce((a, c) => a + c)}`)
console.log(`Filled: ${getItemsSubtotalList('fillQty').reduce((a, c) => a + c)}`)

let storesWithWheat = countStoresContainingItem('BREAD WHEAT OG')
if (storesWithWheat > 0){
  console.log(`Stores with wheat: ${storesWithWheat}`)
}
