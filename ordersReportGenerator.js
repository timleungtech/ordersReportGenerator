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
        for(let i = 0; i < array.length; i++){
            row = array[i].split(', ')
            obj = new MakeRowObj(row[0], row[1], row[2], row[3], row[4], row[5], row[6])
            objArr.push(obj)
        }
        return objArr
    }
// sort objects by propertyName and then customer
function sortByProperty(){
    let objArr = makeObjArr()
    return objArr.sort((a, b) => (a.productName > b.productName) ? 1 : (a.productName === b.productName) ? ((a.customer > b.customer) ? 1 : -1) : -1 )
}
let array = makeRows()
sortByProperty()
console.table(sortByProperty())