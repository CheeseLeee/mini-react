let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
export class Component {
  setState = () => {
    this.render()
  }
}
export function render(element, container) {
    let state 
    if(new element instanceof Component){    
        let instance = new element
        element = instance.render()    
        state = instance.state  
    }else if(typeof element === 'function'){
        element = element()
    }
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
        classComState:state
    }
    console.log(state)
    nextUnitOfWork = wipRoot
}

function commitRoot() {
    console.log(wipRoot)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}

function commitWork(fiber) {
    if (!fiber) {
        return
    }
    const domParent = fiber.parent.dom
    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}
export function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
    //requestIdleCallback(workLoop)
}

function createDom(fiber) {
    const dom =
        fiber.type == "TEXT_ELEMENT" ?
        document.createTextNode("") :
        document.createElement(fiber.type)
    const isProperty = key => key !== "children"
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(name => {
            if(name.startsWith('className')){
                dom.setAttribute('class',fiber.props[name])
            }else if(name.startsWith('on')){
                let event = name.toLowerCase().slice(2,name.length)
                console.log(event)
                dom.addEventListener(event,fiber.props[name])
            }
            dom[name] = fiber.props[name]
        })
    return dom
}

function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    const elements = fiber.props.children 
    reconcileChildren(fiber,elements)
    // find child
    if (fiber.child) {
        return fiber.child
    }
    // have no child --> find sibling
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        // have no sibling --> find 'uncal'
        nextFiber = nextFiber.parent
    }
}
function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    let prevSibling = null; 
    while (index < elements.length || oldFiber != null) {
      const element = elements[index];
      let newFiber = null;  
      const sameType = oldFiber && element && element.type == oldFiber.type;
      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: "UPDATE"
        };
      }
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: "PLACEMENT"
        };
      }
      if (oldFiber && !sameType) {
        oldFiber.effectTag = "DELETION";
        deletions.push(oldFiber);
      }
  
      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }
  
      if (index === 0) {
        wipFiber.child = newFiber;
      } else if (element) {
        prevSibling.sibling = newFiber;
      }
  
      prevSibling = newFiber;
      index++;
    }
  }
/* function reconcileChildren(wipFiber,elements){
    let index = 0
    let prevSibling = null
    while (index < elements.length) {
        const element = elements[index]
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: wipFiber,
            dom: null
        }
        if (index === 0) {
            wipFiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber

        }
        prevSibling = newFiber
        index++
    } 
} */
requestIdleCallback(workLoop)