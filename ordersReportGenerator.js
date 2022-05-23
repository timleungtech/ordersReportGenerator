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
            row = currentCustomer.trim().slice(10).concat(delimiter, items[i], delimiter, items[i+1], delimiter, items[i+2], delimiter, items[i+3], delimiter, items[i+4], delimiter, items[i+5])
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
//     let orderSum = 0
//     let fillSum = 0
//     for(let i = 0; i < objArr.length - 1; i++){
//         if (objArr[i].productName == objArr[i+1].productName){
//             orderSum += objArr[i+1].orderQty
//             fillSum += objArr[i+1].fillQty
//     }
//     return [orderSum, fillSum]
}
function getItemsOrderedTotal(){
    let objArr = sortByProperty()
    let allItems = getUniqueSubtotalNames()
    let sum = []
    let arrayOfSums = []
    for(let j = 0; j < allItems.length; j++){   //6
        for(let i = 0; i < objArr.length; i++){     //12
            if (objArr.productName == allItems[j]){
                sum += objArr.orderQty
            }
            arrayOfSums.push(sum)
        }
    }
    return arrayOfSums
}
function getSubtotalFillSum(){

}


// create subtotals rows
function createSubtotalsRow(){
    let objArr = sortByProperty()
    let orderSum = 0
    let fillSum = 0
    let subtotal = {}
    console.table(objArr)
    for(let i = 0; i < objArr.length - 1; i++){
        if (objArr[i].productName !== objArr[i+1].productName){
            subtotal = new MakeRowObj(null, objArr[i].productCode, objArr[i].productName, objArr[i].unit, orderSum, fillSum, objArr[i].storage)
            objArr.splice(i+1, 0, subtotal)
            i++
        }
    }
    // let lastSubtotal = new MakeRowObj(null, objArr[i].productCode, objArr[objArr.length - 1].productName, objArr[i].unit, orderSum, fillSum, objArr[i].storage)
    // console.log(lastSubtotal)
    console.table(objArr)
}

// createSubtotalsRow()
// sortByProperty()
getItemsOrderedTotal()
// getSubtotalNames()
// console.table(sortByProperty()) // Array(481) Array(12) to 18