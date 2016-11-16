const express = require('express')
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const app = express()

const inventoryEndpoint =
  process.env.INVENTORY_ENDPOINT || 'http://localhost:8000/inventory'
const itemMasterEndpoint =
  process.env.ITEM_MASTER_ENDPOINT ||'http://localhost:5000/items'

app.get('/inventory/:id', (req, res) => {
  const id = req.params.id
  const inventoryResultP = request(`${inventoryEndpoint}/${id}`)
  const itemResultP = request(`${itemMasterEndpoint}/${id}`)

  Promise.all([inventoryResultP, itemResultP])
    .then(([inventoryResult, itemResult]) => {
      
      const qty = JSON.parse(inventoryResult.body).qty
      const itemName = JSON.parse(itemResult.body).itemName
      const result = { itemId: id, itemName: itemName, qty: qty }
      console.log(`GET <id: ${id}> Result: ${JSON.stringify(result)}`)
      res.json(result)
  
    })
    .catch(e => {
      console.log(e)
      res.status(500)
      res.json({ error: e.message })
  
    })
})

app.listen(3000)