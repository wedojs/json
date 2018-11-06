import { Component, Input, OnChanges } from '@angular/core';



@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.css']
})
export class JsonViewerComponent implements OnChanges {

  constructor() { }

  @Input() json: any
  parsedJson: any
  randomValues = window.crypto.getRandomValues(new Uint32Array(10000))
  randomValuesArrayIndex = 0
  /**
   * If state of any key is true , it means
   * it is in expanded state
   */
  state = {}

  ngOnChanges(simpleChange) {
    if (simpleChange.json.currentValue) {
      this.parsedJson = {
        "L0-Root-node": this.reshape(simpleChange.json.currentValue, 1)
      }
      if(Object.keys(this.parsedJson["L0-Root-node"]).length === 0) {
        this.parsedJson = undefined
        this.state = {}
      }
    }
  }
  decideWhatToDo(parentNodeId) {
    if (this.state[parentNodeId]) {
      this.removeChildNodes(parentNodeId)
    } else {
      this.addNode(parentNodeId)
    }

  }
  removeChildNodes(parentNodeId) {
    const parentNode = document.getElementById(parentNodeId)
    parentNode.removeChild(parentNode.lastChild)
    this.state[parentNodeId] = false
    parentNode.setAttribute('class', 'closed')
  }
  addChildNode(ele, isKeyANode) {
    ele = String(ele)
    let tmpSpan = document.createElement('span')
    let liNode = document.createElement('li')

    let innerTmpSpan = document.createElement('span')
    innerTmpSpan.innerHTML = ele.slice(ele.indexOf('-') + 1)

    innerTmpSpan.classList.add('hoverable')

    if (isKeyANode) {
      innerTmpSpan.classList.add('box')
      tmpSpan.setAttribute('class', 'closed')
    }

    tmpSpan.id = ele
    tmpSpan.appendChild(innerTmpSpan)

    tmpSpan.addEventListener('click', event => {
      event.stopPropagation()
      let _parentNodeId = event.target['parentElement']['id']
      this.decideWhatToDo(_parentNodeId)
    })

    liNode.appendChild(tmpSpan)
    return liNode
  }

  addNode(parentNodeId) {
    const parentNode = document.getElementById(parentNodeId)
    const nodeToBeAdded = document.createElement('ul')
    parentNode.classList.replace('closed', 'open')

    const currentChildNode = this.needleInAHayStack(this.parsedJson, parentNodeId)

    if (currentChildNode === undefined)
      return

    // keep note of expanded nodes
    this.state[parentNodeId] = true
    if (currentChildNode instanceof Object) {
      let currentChildNodeKeys = Object.keys(currentChildNode)
      currentChildNodeKeys.forEach(ele => {
        if(this.state[ele])
          this.state[ele] = false

        nodeToBeAdded.appendChild(this.addChildNode(ele, true))
      })
    } else {
      nodeToBeAdded.appendChild(this.addChildNode(currentChildNode, false))
    }

    parentNode.appendChild(nodeToBeAdded)
  }

  needleInAHayStack(hayStack, needle) {
    const copiedHayStack = this.deepCopyJson(hayStack)
    const allKeys = Object.keys(copiedHayStack)

    let stack = []

    let eureka = {
      status: false,
      data: undefined
    }

    allKeys.forEach(e => {
      if (e === needle) {
        eureka = {
          status: true,
          data: copiedHayStack[needle]
        }
      } else {
        if (copiedHayStack[e] instanceof Object)
          stack.push(copiedHayStack[e])
      }
    })

    if (eureka.status)
      return eureka.data

    let val
    stack.forEach(e => {
      if (!val)
        val = this.needleInAHayStack(e, needle)
    })
    return val
  }

  deepCopyJson(oldJson) {
    return JSON.parse(JSON.stringify(oldJson))
  }

  /**
   * Bitch :-)
   */
  reshape(oldJson, level) {
    let copiedJson = this.deepCopyJson(oldJson)
    let jsonToReturn = {}
    let allKeys = Object.keys(copiedJson)
    for (let i = 0; i < allKeys.length; i += 1) {
      if (copiedJson[allKeys[i]] instanceof Object) {
        jsonToReturn[`${this.randomValues[this.randomValuesArrayIndex++]}-${allKeys[i]}`] = this.reshape(copiedJson[allKeys[i]], level + 1)
      } else {
        jsonToReturn[`${this.randomValues[this.randomValuesArrayIndex++]}-${allKeys[i]}`] = copiedJson[allKeys[i]]
      }
    }
    return jsonToReturn
  }
}
